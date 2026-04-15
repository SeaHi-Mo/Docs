---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 子代理委托
description: 使用 delegate_task 生成隔离的子代理以进行并行工作流
permalink: /hermes/user-guide/features/delegation
---

# 子代理委托

`delegate_task` 工具生成具有隔离上下文、受限工具集和自己的终端会话的子 AIAgent 实例。每个子代获得一个新的对话并独立工作 —— 只有其最终摘要进入父代的上下文。

## 单个任务

```python
delegate_task(
    goal="Debug why tests fail",
    context="Error: assertion in test_foo.py line 42",
    toolsets=["terminal", "file"]
)
```

## 并行批处理

最多 3 个并发子代理：

```python
delegate_task(tasks=[
    {"goal": "Research topic A", "toolsets": ["web"]},
    {"goal": "Research topic B", "toolsets": ["web"]},
    {"goal": "Fix the build", "toolsets": ["terminal", "file"]}
])
```

## 子代理上下文的工作原理

:::warning 关键：子代理一无所知
子代理以**全新的对话**开始。它们对父代的对话历史、先前的工具调用或委托之前讨论的任何内容一无所知。子代理的唯一上下文来自您提供的 `goal` 和 `context` 字段。
:::
这意味着您必须传递子代理需要的**所有内容**：

```python
# 错误 —— 子代理不知道 "the error" 是什么
delegate_task(goal="Fix the error")

# 正确 —— 子代理拥有它需要的所有上下文
delegate_task(
    goal="Fix the TypeError in api/handlers.py",
    context="""The file api/handlers.py has a TypeError on line 47:
    'NoneType' object has no attribute 'get'.
    The function process_request() receives a dict from parse_body(),
    but parse_body() returns None when Content-Type is missing.
    The project is at /home/user/myproject and uses Python 3.11."""
)
```

子代理接收一个从您的目标和上下文构建的专注系统提示，指示它完成任务并提供其工作内容的结构化摘要、发现内容、修改的任何文件以及遇到的任何问题。

## 实用示例

### 并行研究

同时研究多个主题并收集摘要：

```python
delegate_task(tasks=[
    {
        "goal": "Research the current state of WebAssembly in 2025",
        "context": "Focus on: browser support, non-browser runtimes, language support",
        "toolsets": ["web"]
    },
    {
        "goal": "Research the current state of RISC-V adoption in 2025",
        "context": "Focus on: server chips, embedded systems, software ecosystem",
        "toolsets": ["web"]
    },
    {
        "goal": "Research quantum computing progress in 2025",
        "context": "Focus on: error correction breakthroughs, practical applications, key players",
        "toolsets": ["web"]
    }
])
```

### 代码审查 + 修复

将审查和修复工作流委托给新的上下文：

```python
delegate_task(
    goal="Review the authentication module for security issues and fix any found",
    context="""Project at /home/user/webapp.
    Auth module files: src/auth/login.py, src/auth/jwt.py, src/auth/middleware.py.
    The project uses Flask, PyJWT, and bcrypt.
    Focus on: SQL injection, JWT validation, password handling, session management.
    Fix any issues found and run the test suite (pytest tests/auth/).""",
    toolsets=["terminal", "file"]
)
```

### 多文件重构

委托一个会淹没父代上下文的大型重构任务：

```python
delegate_task(
    goal="Refactor all Python files in src/ to replace print() with proper logging",
    context="""Project at /home/user/myproject.
    Use the 'logging' module with logger = logging.getLogger(__name__).
    Replace print() calls with appropriate log levels:
    - print(f"Error: ...") -> logger.error(...)
    - print(f"Warning: ...") -> logger.warning(...)
    - print(f"Debug: ...") -> logger.debug(...)
    - Other prints -> logger.info(...)
    Don't change print() in test files or CLI output.
    Run pytest after to verify nothing broke.""",
    toolsets=["terminal", "file"]
)
```

## 批处理模式详情

当您提供 `tasks` 数组时，子代理使用线程池**并行**运行：

- **最大并发数：** 3 个任务（如果更长，`tasks` 数组会被截断为 3 个）
- **线程池：** 使用带有 `MAX_CONCURRENT_CHILDREN = 3` 个工作者的 `ThreadPoolExecutor`
- **进度显示：** 在 CLI 模式下，树视图实时显示来自每个子代理的工具调用，带有每任务完成行。在网关模式下，进度被批处理并中继到父代的进度回调
- **结果排序：** 结果按任务索引排序以匹配输入顺序，无论完成顺序如何
- **中断传播：** 中断父代会中断所有活动子代

单任务委托直接运行，没有线程池开销。

## 模型覆盖

您可以通过 `config.yaml` 为子代理配置不同的模型 —— 用于将简单任务委托给更便宜/更快的模型：

```yaml
# 在 ~/.hermes/config.yaml 中
delegation:
  model: "google/gemini-flash-2.0"    # 用于子代理的 cheaper 模型
  provider: "openrouter"              # 可选：将子代理路由到不同的提供商
```

如果省略，子代理使用与父代相同的模型。

## 工具集选择技巧

`toolsets` 参数控制子代理可以访问哪些工具。根据任务选择：

| 工具集模式 | 使用场景 |
|----------------|----------|
| `["terminal", "file"]` | 代码工作、调试、文件编辑、构建 |
| `["web"]` | 研究、事实核查、文档查找 |
| `["terminal", "file", "web"]` | 全栈任务（默认）|
| `["file"]` | 只读分析、不执行的代码审查 |
| `["terminal"]` | 系统管理、进程管理 |

某些工具集对子代理**始终被阻止**，无论您指定什么：
- `delegation` — 无递归委托（防止无限生成）
- `clarify` — 子代理无法与用户交互
- `memory` — 不写入共享持久记忆
- `code_execution` — 子代理应该逐步推理
- `send_message` — 无跨平台副作用（例如，发送 Telegram 消息）

## 最大迭代次数

每个子代理有一个迭代限制（默认：50），控制它可以进行多少次工具调用轮次：

```python
delegate_task(
    goal="Quick file check",
    context="Check if /etc/nginx/nginx.conf exists and print its first 10 lines",
    max_iterations=10  # 简单任务，不需要很多轮次
)
```

## 深度限制

委托有**2 的深度限制** —— 父代（深度 0）可以生成子代（深度 1），但子代不能进一步委托。这防止了失控的递归委托链。

## 关键属性

- 每个子代理获得其**自己的终端会话**（与父代分开）
- **无嵌套委托** — 子代不能进一步委托（无孙代）
- 子代理**不能**调用：`delegate_task`、`clarify`、`memory`、`send_message`、`execute_code`
- **中断传播** — 中断父代会中断所有活动子代
- 只有最终摘要进入父代的上下文，保持令牌使用高效
- 子代理继承父代的 **API 密钥、提供商配置和凭证池**（在速率限制时启用密钥轮换）

## 委托与 execute_code 对比

| 因素 | delegate_task | execute_code |
|--------|--------------|-------------|
| **推理** | 完整的 LLM 推理循环 | 仅 Python 代码执行 |
| **上下文** | 全新的隔离对话 | 无对话，仅脚本 |
| **工具访问** | 所有非阻止工具带推理 | 通过 RPC 的 7 个工具，无推理 |
| **并行性** | 最多 3 个并发子代理 | 单个脚本 |
| **最适合** | 需要判断的复杂任务 | 机械的多步骤管道 |
| **令牌成本** | 更高（完整 LLM 循环）| 更低（仅返回 stdout）|
| **用户交互** | 无（子代理无法澄清）| 无 |

**经验法则：** 当子任务需要推理、判断或多步骤问题解决时使用 `delegate_task`。当您需要机械数据处理或脚本化工作流时使用 `execute_code`。

## 配置

```yaml
# 在 ~/.hermes/config.yaml 中
delegation:
  max_iterations: 50                        # 每个子代的最大轮次（默认：50）
  default_toolsets: ["terminal", "file", "web"]  # 默认工具集
  model: "google/gemini-3-flash-preview"             # 可选提供商/模型覆盖
  provider: "openrouter"                             # 可选内置提供商

# 或者使用直接自定义端点而非提供商：
delegation:
  model: "qwen2.5-coder"
  base_url: "http://localhost:1234/v1"
  api_key: "local-key"
```

:::tip
Agent 根据任务复杂性自动处理委托。您无需明确要求它委托 —— 它会在有意义时自动执行。
:::