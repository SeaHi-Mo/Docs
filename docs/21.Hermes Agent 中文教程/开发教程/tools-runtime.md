---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 工具运行时
description: 工具注册表、工具集、调度和终端环境的运行时行为
permalink: /hermes/developer-guide/tools-runtime
---

# 工具运行时

Hermes 工具是自注册函数，分组为工具集，并通过中央注册表/调度系统执行。

主要文件：

- `tools/registry.py`
- `model_tools.py`
- `toolsets.py`
- `tools/terminal_tool.py`
- `tools/environments/*`

## 工具注册模型

每个工具模块在导入时调用 `registry.register(...)`。

`model_tools.py` 负责导入/发现工具模块并构建模型使用的模式列表。

### `registry.register()` 如何工作

`tools/` 中的每个工具文件在模块级别调用 `registry.register()` 来声明自己。函数签名是：

```python
registry.register(
    name="terminal",               # 唯一工具名称（用于 API 模式）
    toolset="terminal",            # 此工具所属的工具集
    schema={...},                  # OpenAI 函数调用模式（描述、参数）
    handler=handle_terminal,       # 工具被调用时执行的函数
    check_fn=check_terminal,       # 可选：返回 True/False 表示可用性
    requires_env=["SOME_VAR"],     # 可选：需要的环境变量（用于 UI 显示）
    is_async=False,                # 处理程序是否是异步协程
    description="运行命令",        # 人类可读的描述
    emoji="💻",                    # 用于旋转器/进度显示的 emoji
)
```

每次调用创建一个存储在单例 `ToolRegistry._tools` 字典中的 `ToolEntry`，以工具名称为键。如果跨工具集发生名称冲突，会记录警告，后注册者胜出。

### 发现：`_discover_tools()`

当导入 `model_tools.py` 时，它调用 `_discover_tools()`，按顺序导入每个工具模块：

```python
_modules = [
    "tools.web_tools",
    "tools.terminal_tool",
    "tools.file_tools",
    "tools.vision_tools",
    "tools.mixture_of_agents_tool",
    "tools.image_generation_tool",
    "tools.skills_tool",
    "tools.skill_manager_tool",
    "tools.browser_tool",
    "tools.cronjob_tools",
    "tools.rl_training_tool",
    "tools.tts_tool",
    "tools.todo_tool",
    "tools.memory_tool",
    "tools.session_search_tool",
    "tools.clarify_tool",
    "tools.code_execution_tool",
    "tools.delegate_tool",
    "tools.process_registry",
    "tools.send_message_tool",
    # "tools.honcho_tools",  # 已移除 —— Honcho 现在是记忆提供商插件
    "tools.homeassistant_tool",
]
```

每次导入触发模块的 `registry.register()` 调用。可选工具（例如，缺少图像生成的 `fal_client`）中的错误被捕获并记录 —— 它们不会阻止其他工具加载。

核心工具发现后，还会发现 MCP 工具和插件工具：

1. **MCP 工具** —— `tools.mcp_tool.discover_mcp_tools()` 读取 MCP 服务器配置并从外部服务器注册工具。
2. **插件工具** —— `hermes_cli.plugins.discover_plugins()` 加载可能注册额外工具的用户/项目/pip 插件。

## 工具可用性检查 (`check_fn`)

每个工具可以可选地提供一个 `check_fn` —— 一个可调用对象，在工具可用时返回 `True`，否则返回 `False`。典型检查包括：

- **API 密钥存在** —— 例如，`lambda: bool(os.environ.get("SERP_API_KEY"))` 用于网页搜索
- **服务运行** —— 例如，检查 Honcho 服务器是否已配置
- **二进制文件已安装** —— 例如，验证浏览器工具的 `playwright` 是否可用

当 `registry.get_definitions()` 为模型构建模式列表时，它运行每个工具的 `check_fn()`：

```python
# 来自 registry.py 的简化版
if entry.check_fn:
    try:
        available = bool(entry.check_fn())
    except Exception:
        available = False   # 异常 = 不可用
    if not available:
        continue            # 完全跳过此工具
```

关键行为：
- 检查结果是**每次调用缓存的** —— 如果多个工具共享相同的 `check_fn`，它只运行一次。
- `check_fn()` 中的异常被视为"不可用"（故障安全）。
- `is_toolset_available()` 方法检查工具集的 `check_fn` 是否通过，用于 UI 显示和工具集解析。

## 工具集解析

工具集是工具的命名捆绑包。Hermes 通过以下方式解析它们：

- 显式启用/禁用工具集列表
- 平台预设（`hermes-cli`、`hermes-telegram` 等）
- 动态 MCP 工具集
- 策划的特殊用途集如 `hermes-acp`

### `get_tool_definitions()` 如何过滤工具

主入口点是 `model_tools.get_tool_definitions(enabled_toolsets, disabled_toolsets, quiet_mode)`：

1. **如果提供 `enabled_toolsets`** —— 仅包含来自这些工具集的工具。每个工具集名称通过 `resolve_toolset()` 解析，将复合工具集展开为单个工具名称。

2. **如果提供 `disabled_toolsets`** —— 从所有工具集开始，然后减去禁用的。

3. **如果两者都没有** —— 包含所有已知工具集。

4. **注册表过滤** —— 解析的工具名称集传递给 `registry.get_definitions()`，应用 `check_fn` 过滤并返回 OpenAI 格式模式。

5. **动态模式修补** —— 过滤后，`execute_code` 和 `browser_navigate` 模式被动态调整，仅引用实际通过过滤的工具（防止模型幻觉不可用的工具）。

### 旧工具集名称

带有 `_tools` 后缀的旧工具集名称（例如，`web_tools`、`terminal_tools`）通过 `_LEGACY_TOOLSET_MAP` 映射到它们的现代工具名称，以向后兼容。

## 调度

运行时，工具通过中央注册表调度，代理循环对需要代理级状态的工具（如记忆/待办事项/会话搜索处理）有例外。

### 调度流程：模型 tool_call → 处理程序执行

当模型返回 `tool_call` 时，流程是：

```
带有 tool_call 的模型响应
    ↓
run_agent.py 代理循环
    ↓
model_tools.handle_function_call(name, args, task_id, user_task)
    ↓
[代理循环工具？] → 由代理循环直接处理（待办事项、记忆、session_search、delegate_task）
    ↓
[插件预钩子] → invoke_hook("pre_tool_call", ...)
    ↓
registry.dispatch(name, args, **kwargs)
    ↓
按名称查找 ToolEntry
    ↓
[异步处理程序？] → 通过 _run_async() 桥接
[同步处理程序？]  → 直接调用
    ↓
返回结果字符串（或 JSON 错误）
    ↓
[插件后钩子] → invoke_hook("post_tool_call", ...)
```

### 错误包装

所有工具执行在两个级别包装错误处理：

1. **`registry.dispatch()`** —— 捕获处理程序的任何异常并返回 `{"error": "工具执行失败：异常类型：消息"}` 作为 JSON。

2. **`handle_function_call()`** —— 将整个调度包装在辅助 try/except 中，返回 `{"error": "执行 tool_name 时出错：消息"}`。

这确保模型始终收到格式良好的 JSON 字符串，永远不会收到未处理的异常。

### 代理循环工具

四个工具在注册表调度之前被拦截，因为它们需要代理级状态（TodoStore、MemoryStore 等）：

- `todo` —— 计划/任务跟踪
- `memory` —— 持久记忆写入
- `session_search` —— 跨会话回忆
- `delegate_task` —— 生成子代理会话

这些工具的模式仍在注册表中注册（用于 `get_tool_definitions`），但如果调度以某种方式直接到达它们，它们的处理程序返回存根错误。

### 异步桥接

当工具处理程序是异步的，`_run_async()` 将其桥接到同步调度路径：

- **CLI 路径（无运行循环）** —— 使用持久事件循环保持缓存的异步客户端存活
- **网关路径（运行循环）** —— 用 `asyncio.run()` 启动一次性线程
- **工作线程（并行工具）** —— 使用线程本地存储中存储的每线程持久循环

## DANGEROUS_PATTERNS 审批流程

终端工具集成了在 `tools/approval.py` 中定义的危险命令审批系统：

1. **模式检测** —— `DANGEROUS_PATTERNS` 是覆盖破坏性操作的 `(regex, description)` 元组列表：
   - 递归删除 (`rm -rf`)
   - 文件系统格式化 (`mkfs`, `dd`)
   - SQL 破坏性操作 (`DROP TABLE`, 不带 `WHERE` 的 `DELETE FROM`)
   - 系统配置覆盖 (`> /etc/`)
   - 服务操作 (`systemctl stop`)
   - 远程代码执行 (`curl | sh`)
   - 分叉炸弹、进程终止等

2. **检测** —— 执行任何终端命令之前，`detect_dangerous_command(command)` 对照所有模式检查。

3. **审批提示** —— 如果找到匹配：
   - **CLI 模式** —— 交互式提示要求用户批准、拒绝或永久允许
   - **网关模式** —— 异步审批回调将请求发送到消息平台
   - **智能审批** —— 可选地，辅助 LLM 可以自动批准匹配模式的低风险命令（例如，`rm -rf node_modules/` 是安全的但匹配"递归删除"）

4. **会话状态** —— 审批按会话跟踪。一旦你批准会话的"递归删除"，后续 `rm -rf` 命令不会重新提示。

5. **永久允许列表** —— "永久允许"选项将模式写入 `config.yaml` 的 `command_allowlist`，跨会话持久化。

## 终端/运行时环境

终端系统支持多个后端：

- local
- docker
- ssh
- singularity
- modal
- daytona

它还支持：

- 每个任务的 cwd 覆盖
- 后台进程管理
- PTY 模式
- 危险命令的审批回调

## 并发

工具调用可能顺序或并发执行，取决于工具组合和交互要求。

## 相关文档

- [工具集参考](../reference/toolsets-reference.md)
- [内置工具参考](../reference/tools-reference.md)
- [智能体循环内部机制](./agent-loop.md)
- [ACP 内部机制](./acp-internals.md)
