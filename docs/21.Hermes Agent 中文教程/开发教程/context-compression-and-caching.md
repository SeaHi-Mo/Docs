---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 上下文压缩与缓存
description: Hermes Agent 如何使用双重压缩系统和 Anthropic 提示缓存来管理长对话中的上下文窗口使用
permalink: /hermes/developer-guide/context-compression-and-caching
---

# 上下文压缩与缓存

Hermes Agent 使用双重压缩系统和 Anthropic 提示缓存来高效管理长对话中的上下文窗口使用。

源文件：`agent/context_engine.py` (ABC)、`agent/context_compressor.py` (默认引擎)、`agent/prompt_caching.py`、`gateway/run.py` (会话清理)、`run_agent.py` (搜索 `_compress_context`)

## 可插拔上下文引擎

上下文管理建立在 `ContextEngine` ABC (`agent/context_engine.py`) 之上。内置的 `ContextCompressor` 是默认实现，但插件可以将其替换为替代引擎（例如，无损上下文管理）。

```yaml
context:
  engine: "compressor"    # 默认 —— 内置有损摘要
  engine: "lcm"           # 示例 —— 提供无损上下文的插件
```

引擎负责：
- 决定何时触发压缩 (`should_compress()`)
- 执行压缩 (`compress()`)
- 可选地公开智能体可以调用的工具（例如，`lcm_grep`）
- 跟踪 API 响应中的令牌使用

选择通过 `config.yaml` 中的 `context.engine` 进行配置驱动。解析顺序：
1. 检查 `plugins/context_engine/<name>/` 目录
2. 检查通用插件系统 (`register_context_engine()`)
3. 回退到内置的 `ContextCompressor`

插件引擎**从不自动激活** —— 用户必须显式将 `context.engine` 设置为插件名称。默认的 `"compressor"` 始终使用内置引擎。

通过 `hermes plugins` → Provider Plugins → Context Engine 进行配置，或直接编辑 `config.yaml`。

关于构建上下文引擎插件，参见 [上下文引擎插件](./context-engine-plugin.md)。

## 双重压缩系统

Hermes 有两个独立的压缩层，独立运行：

```
                     ┌──────────────────────────┐
  传入消息            │   网关会话清理            │  在上下文 85% 时触发
  ─────────────────► │   (智能体前，粗略估计)     │  大型会话的安全网
                     └─────────────┬────────────┘
                                   │
                                   ▼
                     ┌──────────────────────────┐
                     │   智能体 ContextCompressor │  在上下文 50% 时触发（默认）
                     │   (循环内，实际令牌)       │  正常的上下文管理
                     └──────────────────────────┘
```

### 1. 网关会话清理 (85% 阈值)

位于 `gateway/run.py`（搜索 `_maybe_compress_session`）。这是一个**安全网**，在智能体处理消息之前运行。它防止会话在回合之间增长过大时的 API 故障（例如，Telegram/Discord 中的过夜累积）。

- **阈值**：固定为模型上下文长度的 85%
- **令牌来源**：优先使用上次的实际 API 报告令牌；回退到粗略的基于字符的估计 (`estimate_messages_tokens_rough`)
- **触发条件**：仅在 `len(history) >= 4` 且启用压缩时触发
- **目的**：捕获逃脱智能体自身压缩器的会话

网关清理阈值故意高于智能体的压缩器。将其设置为 50%（与智能体相同）会导致长网关会话的每次回合都过早压缩。

### 2. 智能体 ContextCompressor (50% 阈值，可配置)

位于 `agent/context_compressor.py`。这是**主压缩系统**，在智能体的工具循环内运行，可访问准确的 API 报告令牌计数。

## 配置

所有压缩设置都从 `config.yaml` 中的 `compression` 键读取：

```yaml
compression:
  enabled: true              # 启用/禁用压缩（默认：true）
  threshold: 0.50            # 上下文窗口比例（默认：0.50 = 50%）
  target_ratio: 0.20         # 作为尾部保留的阈值比例（默认：0.20）
  protect_last_n: 20         # 始终保护的最小尾部消息数（默认：20）
  summary_model: null        # 摘要的覆盖模型（默认：使用辅助模型）
```

### 参数详情

| 参数 | 默认值 | 范围 | 描述 |
|-----------|---------|-------|-------------|
| `threshold` | `0.50` | 0.0-1.0 | 当提示令牌 ≥ `threshold × context_length` 时触发压缩 |
| `target_ratio` | `0.20` | 0.10-0.80 | 控制尾部保护令牌预算：`threshold_tokens × target_ratio` |
| `protect_last_n` | `20` | ≥1 | 始终保留的最近消息的最小数量 |
| `protect_first_n` | `3` | （硬编码） | 始终保留系统提示 + 首次交换 |

### 计算值（对于默认值的 200K 上下文模型）

```
context_length       = 200,000
threshold_tokens     = 200,000 × 0.50 = 100,000
tail_token_budget    = 100,000 × 0.20 = 20,000
max_summary_tokens   = min(200,000 × 0.05, 12,000) = 10,000
```

## 压缩算法

`ContextCompressor.compress()` 方法遵循 4 阶段算法：

### 第 1 阶段：修剪旧工具结果（廉价，无 LLM 调用）

受保护尾部之外的旧工具结果 (>200 字符) 被替换为：
```
[旧工具输出已清除以节省上下文空间]
```

这是一个廉价的预通道，可从冗长的工具输出（文件内容、终端输出、搜索结果）中节省大量令牌。

### 第 2 阶段：确定边界

```
┌─────────────────────────────────────────────────────────────┐
│  消息列表                                                    │
│                                                             │
│  [0..2]  ← protect_first_n（系统 + 首次交换）                │
│  [3..N]  ← 中间回合 → 被摘要                                 │
│  [N..end] ← 尾部（按令牌预算 OR protect_last_n）             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

尾部保护是**基于令牌预算的**：从末尾向后遍历，累积令牌直到预算耗尽。如果预算保护的消息更少，则回退到固定的 `protect_last_n` 计数。

边界对齐以避免拆分 tool_call/tool_result 组。`_align_boundary_backward()` 方法越过连续的工具结果找到父助手消息，保持组完整。

### 第 3 阶段：生成结构化摘要

:::warning 摘要模型上下文长度
摘要模型必须具有**至少与主智能体模型一样大**的上下文窗口。整个中间部分在单个 `call_llm(task="compression")` 调用中发送到摘要模型。如果摘要模型的上下文较小，API 将返回上下文长度错误 —— `_generate_summary()` 捕获它，记录警告，并返回 `None`。然后压缩器将**没有摘要**地删除中间回合，静默丢失对话上下文。这是压缩质量下降的最常见原因。
:::

使用结构化模板通过辅助 LLM 对中间回合进行摘要：

```
## 目标
[用户试图完成什么]

## 约束与偏好
[用户偏好、编码风格、约束、重要决策]

## 进度
### 已完成
[已完成的工作 —— 具体文件路径、运行的命令、结果]
### 进行中
[当前正在进行的工作]
### 受阻
[遇到的任何阻碍或问题]

## 关键决策
[重要的技术决策及其原因]

## 相关文件
[读取、修改或创建的文件 —— 每个文件附简要说明]

## 下一步
[接下来需要做什么]

## 关键上下文
[具体值、错误消息、配置详情]
```

摘要预算随压缩内容量而变化：
- 公式：`content_tokens × 0.20`（`_SUMMARY_RATIO` 常量）
- 最小值：2,000 令牌
- 最大值：`min(context_length × 0.05, 12,000)` 令牌

### 第 4 阶段：组装压缩消息

压缩后的消息列表为：
1. 头部消息（首次压缩时在系统提示后附加注释）
2. 摘要消息（选择角色以避免连续相同角色违规）
3. 尾部消息（未修改）

孤立的 tool_call/tool_result 对被 `_sanitize_tool_pairs()` 清理：
- 引用已删除调用的工具结果 → 删除
- 结果已被删除的工具调用 → 注入存根结果

### 迭代重新压缩

在后续压缩时，将之前的摘要传递给 LLM，并指示**更新**它而不是从头开始摘要。这在多次压缩之间保留信息 —— 项目从"进行中"移动到"已完成"，添加新进度，删除过时信息。

压缩器实例上的 `_previous_summary` 字段为此目的存储最后的摘要文本。

## 前后示例

### 压缩前（45 条消息，~95K 令牌）

```
[0] system:    "你是一个有用的助手..." (系统提示)
[1] user:      "帮我设置一个 FastAPI 项目"
[2] assistant: <tool_call> terminal: mkdir project </tool_call>
[3] tool:      "directory created"
[4] assistant: <tool_call> write_file: main.py </tool_call>
[5] tool:      "file written (2.3KB)"
    ... 30 多个回合的文件编辑、测试、调试 ...
[38] assistant: <tool_call> terminal: pytest </tool_call>
[39] tool:      "8 passed, 2 failed\n..."  (5KB output)
[40] user:      "修复失败的测试"
[41] assistant: <tool_call> read_file: tests/test_api.py </tool_call>
[42] tool:      "import pytest\n..."  (3KB)
[43] assistant: "我看到测试夹具的问题..."
[44] user:      "很好，还要添加错误处理"
```

### 压缩后（25 条消息，~45K 令牌）

```
[0] system:    "你是一个有用的助手...
               [注：一些较早的对话回合已被压缩...]"
[1] user:      "帮我设置一个 FastAPI 项目"
[2] assistant: "[上下文压缩] 较早的回合已被压缩...

               ## 目标
               设置一个带有测试和错误处理的 FastAPI 项目

               ## 进度
               ### 已完成
               - 创建项目结构：main.py、tests/、requirements.txt
               - 在 main.py 中实现了 5 个 API 端点
               - 在 tests/test_api.py 中编写了 10 个测试用例
               - 10 个测试中 8 个通过

               ### 进行中
               - 修复 2 个失败的测试（test_create_user、test_delete_user）

               ## 相关文件
               - main.py —— 带有 5 个端点的 FastAPI 应用
               - tests/test_api.py —— 10 个测试用例
               - requirements.txt —— fastapi、pytest、httpx

               ## 下一步
               - 修复失败的测试夹具
               - 添加错误处理"
[3] user:      "修复失败的测试"
[4] assistant: <tool_call> read_file: tests/test_api.py </tool_call>
[5] tool:      "import pytest\n..."
[6] assistant: "我看到测试夹具的问题..."
[7] user:      "很好，还要添加错误处理"
```

## 提示缓存 (Anthropic)

源：`agent/prompt_caching.py`

通过在对话前缀上缓存，在多回合对话中将输入令牌成本降低约 75%。使用 Anthropic 的 `cache_control` 断点。

### 策略：system_and_3

Anthropic 每个请求最多允许 4 个 `cache_control` 断点。Hermes 使用 "system_and_3" 策略：

```
断点 1：系统提示           （跨所有回合稳定）
断点 2：倒数第 3 条非系统消息  ─┐
断点 3：倒数第 2 条非系统消息   ├─ 滚动窗口
断点 4：最后一条非系统消息      ─┘
```

### 工作原理

`apply_anthropic_cache_control()` 深度复制消息并注入 `cache_control` 标记：

```python
# 缓存标记格式
marker = {"type": "ephemeral"}
# 或 1 小时 TTL：
marker = {"type": "ephemeral", "ttl": "1h"}
```

标记根据内容类型不同地应用：

| 内容类型 | 标记位置 |
|-------------|-------------------|
| 字符串内容 | 转换为 `[{"type": "text", "text": ..., "cache_control": ...}]` |
| 列表内容 | 添加到最后一个元素的 dict |
| None/空 | 添加为 `msg["cache_control"]` |
| 工具消息 | 添加为 `msg["cache_control"]`（仅限原生 Anthropic） |

### 缓存感知设计模式

1. **稳定的系统提示**：系统提示是断点 1，跨所有回合缓存。避免在对话中途改变它（压缩仅在首次压缩时附加注释）。

2. **消息顺序很重要**：缓存命中需要前缀匹配。在中间添加或删除消息会使其后所有内容的缓存失效。

3. **压缩缓存交互**：压缩后，压缩区域的缓存失效，但系统提示缓存保留。滚动 3 消息窗口在 1-2 回合内重新建立缓存。

4. **TTL 选择**：默认为 `5m`（5 分钟）。对于用户在回合之间有休息的长会话，使用 `1h`。

### 启用提示缓存

当满足以下条件时，提示缓存会自动启用：
- 模型是 Anthropic Claude 模型（通过模型名称检测）
- 提供商支持 `cache_control`（原生 Anthropic API 或 OpenRouter）

```yaml
# config.yaml —— TTL 可配置
model:
  cache_ttl: "5m"   # "5m" 或 "1h"
```

CLI 在启动时显示缓存状态：
```
💾 提示缓存：已启用（通过 OpenRouter 的 Claude，5m TTL）
```

## 上下文压力警告

智能体在压缩阈值的 85% 处发出上下文压力警告（不是上下文的 85% —— 是压缩阈值本身的 85%，即上下文的 50%）：

```
⚠️  上下文已达到压缩阈值的 85% (42,500/50,000 令牌)
```

压缩后，如果使用量降至阈值的 85% 以下，则清除警告状态。如果压缩未能降至警告级别以下（对话太密集），警告仍然存在，但直到再次超过阈值才会重新触发压缩。
