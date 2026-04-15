---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 智能体循环内部机制
description: AIAgent 执行的详细解析，包括 API 模式、工具、回调和回退行为
permalink: /hermes/developer-guide/agent-loop
---

# 智能体循环内部机制

核心编排引擎是 `run_agent.py` 中的 `AIAgent` 类——大约 9,200 行代码，处理从提示组装到工具调度再到提供商故障转移的所有事务。

## 核心职责

`AIAgent` 负责：

- 通过 `prompt_builder.py` 组装有效的系统提示和工具模式
- 选择正确的提供商/API 模式（chat_completions、codex_responses、anthropic_messages）
- 进行可中断的模型调用，支持取消操作
- 执行工具调用（顺序执行或通过线程池并发执行）
- 以 OpenAI 消息格式维护对话历史
- 处理压缩、重试和回退模型切换
- 跟踪父智能体和子智能体的迭代预算
- 在上下文丢失之前刷新持久化记忆

## 两个入口点

```python
# 简单接口 —— 返回最终响应字符串
response = agent.chat("修复 main.py 中的 bug")

# 完整接口 —— 返回包含消息、元数据、使用统计的字典
result = agent.run_conversation(
    user_message="修复 main.py 中的 bug",
    system_message=None,           # 如果省略则自动构建
    conversation_history=None,      # 如果省略则从会话自动加载
    task_id="task_abc123"
)
```

`chat()` 是对 `run_conversation()` 的轻量包装，从结果字典中提取 `final_response` 字段。

## API 模式

Hermes 支持三种 API 执行模式，根据提供商选择、显式参数和基础 URL 启发式规则解析：

| API 模式 | 用于 | 客户端类型 |
|----------|----------|-------------|
| `chat_completions` | OpenAI 兼容端点（OpenRouter、自定义、大多数提供商） | `openai.OpenAI` |
| `codex_responses` | OpenAI Codex / Responses API | `openai.OpenAI`（Responses 格式） |
| `anthropic_messages` | 原生 Anthropic Messages API | `anthropic.Anthropic`（通过适配器） |

该模式决定了消息格式、工具调用结构、响应解析方式以及缓存/流式处理方式。这三种模式在 API 调用前后都收敛于相同的内部消息格式（OpenAI 风格的 `role`/`content`/`tool_calls` 字典）。

**模式解析顺序：**
1. 显式的 `api_mode` 构造参数（最高优先级）
2. 提供商特定检测（例如，`anthropic` 提供商 → `anthropic_messages`）
3. 基础 URL 启发式规则（例如，`api.anthropic.com` → `anthropic_messages`）
4. 默认值：`chat_completions`

## 回合生命周期

智能体循环的每次迭代遵循以下序列：

```text
run_conversation()
  1. 如果未提供则生成 task_id
  2. 将用户消息附加到对话历史
  3. 构建或重用缓存的系统提示（prompt_builder.py）
  4. 检查是否需要预检压缩（>50% 上下文）
  5. 从对话历史构建 API 消息
     - chat_completions: 按原样使用 OpenAI 格式
     - codex_responses: 转换为 Responses API 输入项
     - anthropic_messages: 通过 anthropic_adapter.py 转换
  6. 注入临时提示层（预算警告、上下文压力）
  7. 如果在 Anthropic 上则应用提示缓存标记
  8. 进行可中断的 API 调用（_api_call_with_interrupt）
  9. 解析响应：
     - 如果有 tool_calls：执行它们，附加结果，返回步骤 5
     - 如果是文本响应：持久化会话，如有需要则刷新记忆，返回
```

### 消息格式

所有消息在内部使用 OpenAI 兼容格式：

```python
{"role": "system", "content": "..."}
{"role": "user", "content": "..."}
{"role": "assistant", "content": "...", "tool_calls": [...]}
{"role": "tool", "tool_call_id": "...", "content": "..."}
```

推理内容（来自支持扩展思考的模型）存储在 `assistant_msg["reasoning"]` 中，并通过 `reasoning_callback` 可选显示。

### 消息交替规则

智能体循环强制执行严格的消息角色交替：

- 系统消息之后：`用户 → 助手 → 用户 → 助手 → ...`
- 工具调用期间：`助手（带 tool_calls） → 工具 → 工具 → ... → 助手`
- **绝不**连续两个助手消息
- **绝不**连续两个用户消息
- **只有** `tool` 角色可以有连续条目（并行工具结果）

提供商会验证这些序列，并会拒绝格式错误的历史记录。

## 可中断的 API 调用

API 请求被包装在 `_api_call_with_interrupt()` 中，它在后台线程中运行实际的 HTTP 调用，同时监控中断事件：

```text
┌──────────────────────┐     ┌──────────────┐
│  主线程               │     │  API 线程     │
│  等待：               │────▶│  HTTP POST    │
│  - 响应就绪           │     │  发送到提供商  │
│  - 中断事件           │     └──────────────┘
│  - 超时               │
└──────────────────────┘
```

当被中断时（用户发送新消息、`/stop` 命令或信号）：
- API 线程被放弃（响应被丢弃）
- 智能体可以处理新输入或干净地关闭
- 不会将部分响应注入对话历史

## 工具执行

### 顺序 vs 并发

当模型返回工具调用时：

- **单个工具调用** → 在主线程中直接执行
- **多个工具调用** → 通过 `ThreadPoolExecutor` 并发执行
  - 例外：标记为交互式的工具（例如 `clarify`）强制顺序执行
  - 无论完成顺序如何，结果都按原始工具调用顺序重新插入

### 执行流程

```text
对于 response.tool_calls 中的每个 tool_call：
    1. 从 tools/registry.py 解析处理程序
    2. 触发 pre_tool_call 插件钩子
    3. 检查是否为危险命令（tools/approval.py）
       - 如果是危险的：调用 approval_callback，等待用户
    4. 使用 args + task_id 执行处理程序
    5. 触发 post_tool_call 插件钩子
    6. 将 {"role": "tool", "content": result} 附加到历史
```

### 智能体级工具

有些工具在到达 `handle_function_call()` 之前被 `run_agent.py` *拦截*：

| 工具 | 被拦截的原因 |
|------|--------------------|
| `todo` | 读取/写入智能体本地任务状态 |
| `memory` | 写入具有字符限制的持久记忆文件 |
| `session_search` | 通过智能体的会话数据库查询会话历史 |
| `delegate_task` | 生成具有隔离上下文的子智能体 |

这些工具直接修改智能体状态并返回合成工具结果，而不通过注册表。

## 回调接口

`AIAgent` 支持平台特定的回调，可在 CLI、网关和 ACP 集成中实现实时进度：

| 回调 | 触发时机 | 使用者 |
|----------|-----------|---------|
| `tool_progress_callback` | 每次工具执行之前/之后 | CLI 旋转器、网关进度消息 |
| `thinking_callback` | 当模型开始/停止思考时 | CLI "正在思考..." 指示器 |
| `reasoning_callback` | 当模型返回推理内容时 | CLI 推理显示、网关推理块 |
| `clarify_callback` | 当调用 `clarify` 工具时 | CLI 输入提示、网关交互式消息 |
| `step_callback` | 每次完整的智能体回合之后 | 网关步骤跟踪、ACP 进度 |
| `stream_delta_callback` | 每个流式令牌（启用时） | CLI 流式显示 |
| `tool_gen_callback` | 从流中解析工具调用时 | CLI 旋转器中的工具预览 |
| `status_callback` | 状态更改（思考、执行等） | ACP 状态更新 |

## 预算和回退行为

### 迭代预算

智能体通过 `IterationBudget` 跟踪迭代：

- 默认值：90 次迭代（可通过 `agent.max_turns` 配置）
- 在父智能体和子智能体之间共享——子智能体消耗父智能体的预算
- 通过 `_get_budget_warning()` 实现两级预算压力：
  - 70%+ 使用率（警告层）：将 `[BUDGET: 迭代 X/Y。还剩 N 次迭代。开始整合你的工作。]` 附加到最后一个工具结果
  - 90%+ 使用率（警告层）：将 `[BUDGET WARNING: 迭代 X/Y。只剩 N 次迭代。立即提供你的最终响应。]` 附加到最后一个工具结果
- 100% 时，智能体停止并返回已完成工作的摘要

### 回退模型

当主模型失败时（429 速率限制、5xx 服务器错误、401/403 认证错误）：

1. 检查配置中的 `fallback_providers` 列表
2. 按顺序尝试每个回退
3. 成功时，继续使用新提供商进行对话
4. 401/403 时，在故障转移前尝试刷新凭证

回退系统还独立覆盖辅助任务——视觉、压缩、网页提取和会话搜索各自都有可通过 `auxiliary.*` 配置部分配置的自己的回退链。

## 压缩和持久化

### 何时触发压缩

- **预检**（API 调用前）：如果对话超过模型上下文窗口的 50%
- **网关自动压缩**：如果对话超过 85%（更激进，在回合之间运行）

### 压缩期间发生什么

1. 首先将记忆刷新到磁盘（防止数据丢失）
2. 中间对话回合被总结为紧凑摘要
3. 最后 N 条消息保持完整（`compression.protect_last_n`，默认值：20）
4. 工具调用/结果消息对保持在一起（绝不拆分）
5. 生成新的会话谱系 ID（压缩创建一个"子"会话）

### 会话持久化

每次回合之后：
- 消息被保存到会话存储（通过 `hermes_state.py` 的 SQLite）
- 记忆更改被刷新到 `MEMORY.md` / `USER.md`
- 会话可通过 `/resume` 或 `hermes chat --resume` 稍后恢复

## 关键源文件

| 文件 | 用途 |
|------|---------|
| `run_agent.py` | AIAgent 类 —— 完整的智能体循环（~9,200 行） |
| `agent/prompt_builder.py` | 来自记忆、技能、上下文文件、个性的系统提示组装 |
| `agent/context_engine.py` | ContextEngine ABC —— 可插拔的上下文管理 |
| `agent/context_compressor.py` | 默认引擎 —— 有损摘要算法 |
| `agent/prompt_caching.py` | Anthropic 提示缓存标记和缓存指标 |
| `agent/auxiliary_client.py` | 用于辅助任务（视觉、摘要）的辅助 LLM 客户端 |
| `model_tools.py` | 工具模式集合、`handle_function_call()` 调度 |

## 相关文档

- [提供商运行时解析](./provider-runtime.md)
- [提示组装](./prompt-assembly.md)
- [上下文压缩与提示缓存](./context-compression-and-caching.md)
- [工具运行时](./tools-runtime.md)
- [架构概述](./architecture.md)
