---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 事件钩子
description: 在关键生命周期点运行自定义代码 —— 记录活动、发送警报、发布到 webhook
permalink: /hermes/user-guide/features/hooks
---

# 事件钩子

Hermes 有两个钩子系统，在关键生命周期点运行自定义代码：

| 系统 | 注册方式 | 运行在 | 使用场景 |
|--------|---------------|---------|----------|
| **[网关钩子](#网关事件钩子)** | `~/.hermes/hooks/` 中的 `HOOK.yaml` + `handler.py` | 仅网关 | 日志记录、警报、webhook |
| **[插件钩子](#插件钩子)** | [插件](/docs/user-guide/features/plugins)中的 `ctx.register_hook()` | CLI + 网关 | 工具拦截、指标、防护栏 |

两个系统都是非阻塞的 —— 任何钩子中的错误都会被捕获并记录，永远不会使 Agent 崩溃。

## 网关事件钩子

网关钩子在网关操作期间自动触发（Telegram、Discord、Slack、WhatsApp），而不会阻塞主 Agent 管道。

### 创建钩子

每个钩子都是 `~/.hermes/hooks/` 下的一个目录，包含两个文件：

```text
~/.hermes/hooks/
└── my-hook/
    ├── HOOK.yaml      # 声明要监听的事件
    └── handler.py     # Python 处理函数
```

#### HOOK.yaml

```yaml
name: my-hook
description: 将所有 Agent 活动记录到文件
events:
  - agent:start
  - agent:end
  - agent:step
```

`events` 列表决定哪些事件触发您的处理程序。您可以订阅任何事件组合，包括通配符如 `command:*`。

#### handler.py

```python
import json
from datetime import datetime
from pathlib import Path

LOG_FILE = Path.home() / ".hermes" / "hooks" / "my-hook" / "activity.log"

async def handle(event_type: str, context: dict):
    """为每个订阅的事件调用。必须命名为 'handle'。"""
    entry = {
        "timestamp": datetime.now().isoformat(),
        "event": event_type,
        **context,
    }
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")
```

**处理程序规则：**
- 必须命名为 `handle`
- 接收 `event_type`（字符串）和 `context`（字典）
- 可以是 `async def` 或常规 `def` —— 两者都有效
- 错误被捕获并记录，永远不会使 Agent 崩溃

### 可用事件

| 事件 | 触发时机 | 上下文键 |
|-------|---------------|--------------|
| `gateway:startup` | 网关进程启动 | `platforms`（活动平台名称列表）|
| `session:start` | 新消息会话创建 | `platform`, `user_id`, `session_id`, `session_key` |
| `session:end` | 会话结束（重置前）| `platform`, `user_id`, `session_key` |
| `session:reset` | 用户运行 `/new` 或 `/reset` | `platform`, `user_id`, `session_key` |
| `agent:start` | Agent 开始处理消息 | `platform`, `user_id`, `session_id`, `message` |
| `agent:step` | 工具调用循环的每次迭代 | `platform`, `user_id`, `session_id`, `iteration`, `tool_names` |
| `agent:end` | Agent 完成处理 | `platform`, `user_id`, `session_id`, `message`, `response` |
| `command:*` | 执行任何斜杠命令 | `platform`, `user_id`, `command`, `args` |

#### 通配符匹配

为 `command:*` 注册的处理程序会为任何 `command:` 事件触发（`command:model`、`command:reset` 等）。通过单次订阅监控所有斜杠命令。

### 示例

#### 启动检查清单 (BOOT.md) — 内置

网关附带一个内置的 `boot-md` 钩子，在每次启动时查找 `~/.hermes/BOOT.md`。如果文件存在，Agent 会在后台会话中运行其指令。无需安装 —— 只需创建文件。

**创建 `~/.hermes/BOOT.md`：**

```markdown
# 启动检查清单

1. 检查是否有任何 cron 作业昨晚失败 —— 运行 `hermes cron list`
2. 向 Discord #general 发送消息说 "Gateway restarted, all systems go"
3. 检查 /opt/app/deploy.log 是否有过去 24 小时的任何错误
```

Agent 在后台线程中运行这些指令，因此不会阻塞网关启动。如果不需要关注，Agent 回复 `[SILENT]` 且不发送消息。

:::tip
没有 BOOT.md？钩子静默跳过 —— 零开销。需要启动自动化时创建文件，不需要时删除。
:::
#### 长任务 Telegram 警报

当 Agent 运行超过 10 步时给自己发送消息：

```yaml
# ~/.hermes/hooks/long-task-alert/HOOK.yaml
name: long-task-alert
description: 当 Agent 运行多步时警报
events:
  - agent:step
```

```python
# ~/.hermes/hooks/long-task-alert/handler.py
import os
import httpx

THRESHOLD = 10
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_HOME_CHANNEL")

async def handle(event_type: str, context: dict):
    iteration = context.get("iteration", 0)
    if iteration == THRESHOLD and BOT_TOKEN and CHAT_ID:
        tools = ", ".join(context.get("tool_names", []))
        text = f"⚠️ Agent 已运行 {iteration} 步。最后工具：{tools}"
        async with httpx.AsyncClient() as client:
            await client.post(
                f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
                json={"chat_id": CHAT_ID, "text": text},
            )
```

#### 命令使用记录器

跟踪使用了哪些斜杠命令：

```yaml
# ~/.hermes/hooks/command-logger/HOOK.yaml
name: command-logger
description: 记录斜杠命令使用
events:
  - command:*
```

```python
# ~/.hermes/hooks/command-logger/handler.py
import json
from datetime import datetime
from pathlib import Path

LOG = Path.home() / ".hermes" / "logs" / "command_usage.jsonl"

def handle(event_type: str, context: dict):
    LOG.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "ts": datetime.now().isoformat(),
        "command": context.get("command"),
        "args": context.get("args"),
        "platform": context.get("platform"),
        "user": context.get("user_id"),
    }
    with open(LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")
```

#### 会话启动 Webhook

新会话时 POST 到外部服务：

```yaml
# ~/.hermes/hooks/session-webhook/HOOK.yaml
name: session-webhook
description: 新会话时通知外部服务
events:
  - session:start
  - session:reset
```

```python
# ~/.hermes/hooks/session-webhook/handler.py
import httpx

WEBHOOK_URL = "https://your-service.example.com/hermes-events"

async def handle(event_type: str, context: dict):
    async with httpx.AsyncClient() as client:
        await client.post(WEBHOOK_URL, json={
            "event": event_type,
            **context,
        }, timeout=5)
```

### 工作原理

1. 网关启动时，`HookRegistry.discover_and_load()` 扫描 `~/.hermes/hooks/`
2. 带有 `HOOK.yaml` + `handler.py` 的每个子目录被动态加载
3. 处理程序为其声明的事件注册
4. 在每个生命周期点，`hooks.emit()` 触发所有匹配的处理程序
5. 任何处理程序中的错误被捕获并记录 —— 损坏的钩子永远不会使 Agent 崩溃

:::info
网关钩子仅在**网关**（Telegram、Discord、Slack、WhatsApp）中触发。CLI 不加载网关钩子。对于随处可用的钩子，请使用[插件钩子](#插件钩子)。
:::
## 插件钩子

[插件](/docs/user-guide/features/plugins)可以注册在 **CLI 和网关**会话中触发的钩子。这些通过插件 `register()` 函数中的 `ctx.register_hook()` 以编程方式注册。

```python
def register(ctx):
    ctx.register_hook("pre_tool_call", my_tool_observer)
    ctx.register_hook("post_tool_call", my_tool_logger)
    ctx.register_hook("pre_llm_call", my_memory_callback)
    ctx.register_hook("post_llm_call", my_sync_callback)
    ctx.register_hook("on_session_start", my_init_callback)
    ctx.register_hook("on_session_end", my_cleanup_callback)
```

**所有钩子的一般规则：**

- 回调接收**关键字参数**。始终接受 `**kwargs` 以向前兼容 —— 未来版本可能会添加新参数而不会破坏您的插件。
- 如果回调**崩溃**，它会被记录并跳过。其他钩子和 Agent 继续正常运行。行为不端的插件永远不会破坏 Agent。
- 所有钩子都是**即发即弃的观察者**，其返回值被忽略 —— 除了 `pre_llm_call`，它可以[注入上下文](#pre_llm_call)。

### 快速参考

| 钩子 | 触发时机 | 返回 |
|------|-----------|---------|
| [`pre_tool_call`](#pre_tool_call) | 任何工具执行之前 | 忽略 |
| [`post_tool_call`](#post_tool_call) | 任何工具返回之后 | 忽略 |
| [`pre_llm_call`](#pre_llm_call) | 每轮一次，在工具调用循环之前 | 上下文注入 |
| [`post_llm_call`](#post_llm_call) | 每轮一次，在工具调用循环之后 | 忽略 |
| [`on_session_start`](#on_session_start) | 新会话创建（仅第一轮）| 忽略 |
| [`on_session_end`](#on_session_end) | 会话结束 | 忽略 |

---

### `pre_tool_call`

在**每次工具执行之前立即**触发 —— 内置工具和插件工具都一样。

**回调签名：**

```python
def my_callback(tool_name: str, args: dict, task_id: str, **kwargs):
```

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `tool_name` | `str` | 即将执行的工具名称（例如 `"terminal"`、`"web_search"`、`"read_file"`）|
| `args` | `dict` | 模型传递给工具的参数 |
| `task_id` | `str` | 会话/任务标识符。如果未设置则为空字符串。|

**触发位置：** 在 `model_tools.py` 中，在 `handle_function_call()` 内部，在工具的处理程序运行之前。每次工具调用触发一次 —— 如果模型并行调用 3 个工具，这会触发 3 次。

**返回值：** 忽略。

**使用场景：** 日志记录、审计跟踪、工具调用计数器、阻止危险操作（打印警告）、速率限制。

**示例 —— 工具调用审计日志：**

```python
import json, logging
from datetime import datetime

logger = logging.getLogger(__name__)

def audit_tool_call(tool_name, args, task_id, **kwargs):
    logger.info("TOOL_CALL session=%s tool=%s args=%s",
                task_id, tool_name, json.dumps(args)[:200])

def register(ctx):
    ctx.register_hook("pre_tool_call", audit_tool_call)
```

**示例 —— 危险工具警告：**

```python
DANGEROUS = {"terminal", "write_file", "patch"}

def warn_dangerous(tool_name, **kwargs):
    if tool_name in DANGEROUS:
        print(f"⚠ 执行潜在危险工具：{tool_name}")

def register(ctx):
    ctx.register_hook("pre_tool_call", warn_dangerous)
```
