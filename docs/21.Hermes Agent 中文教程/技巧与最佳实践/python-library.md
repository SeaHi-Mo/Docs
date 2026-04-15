---
title: "将 Hermes 用作 Python 库"
sidebar_position: 5
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/python-library
description: "在您自己的 Python 脚本、Web 应用或自动化管道中嵌入 AIAgent — 无需 CLI"
---


# 将 Hermes 用作 Python 库

Hermes 不仅仅是一个 CLI 工具。您可以直接导入 `AIAgent` 并以编程方式在您自己的 Python 脚本、Web 应用程序或自动化管道中使用它。本指南向您展示如何操作。

---

## 安装

直接从仓库安装 Hermes：

```bash
pip install git+https://github.com/NousResearch/hermes-agent.git
```

或使用 [uv](https://docs.astral.sh/uv/)：

```bash
uv pip install git+https://github.com/NousResearch/hermes-agent.git
```

您也可以在 `requirements.txt` 中固定它：

```text
hermes-agent @ git+https://github.com/NousResearch/hermes-agent.git
```

:::tip
使用 Hermes 作为库时，需要使用与 CLI 相同的环境变量。至少需要设置 `OPENROUTER_API_KEY`（或 `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` 如果使用直接提供商访问）。
:::

---

## 基本用法

使用 Hermes 的最简单方式是 `chat()` 方法 — 传递一条消息，返回一个字符串：

```python
from run_agent import AIAgent

agent = AIAgent(
    model="anthropic/claude-sonnet-4",
    quiet_mode=True,
)
response = agent.chat("法国的首都是什么？")
print(response)
```

`chat()` 在内部处理完整的对话循环 — 工具调用、重试、所有内容 — 并只返回最终的文本响应。

:::warning
在您自己的代码中嵌入 Hermes 时，始终设置 `quiet_mode=True`。没有它，代理会打印 CLI 旋转器、进度指示器和其他终端输出，这会弄乱您应用程序的输出。
:::

---

## 完整对话控制

要对对话进行更多控制，请直接使用 `run_conversation()`。它返回一个包含完整响应、消息历史和元数据的字典：

```python
agent = AIAgent(
    model="anthropic/claude-sonnet-4",
    quiet_mode=True,
)

result = agent.run_conversation(
    user_message="搜索最近的 Python 3.13 功能",
    task_id="my-task-1",
)

print(result["final_response"])
print(f"交换的消息数: {len(result['messages'])}")
```

返回的字典包含：
- **`final_response`** — 代理的最终文本回复
- **`messages`** — 完整的消息历史（系统、用户、助手、工具调用）
- **`task_id`** — 用于 VM 隔离的任务标识符

您还可以传递一个自定义系统消息，覆盖该调用的临时系统提示：

```python
result = agent.run_conversation(
    user_message="解释快速排序",
    system_message="您是一位计算机科学导师。使用简单的类比。",
)
```

---

## 配置工具

使用 `enabled_toolsets` 或 `disabled_toolsets` 控制代理可以访问哪些工具集：

```python
agent = AIAgent(
    model="anthropic/claude-sonnet-4",
    quiet_mode=True,
    enabled_toolsets=["core", "web"],  # 仅启用核心和网络工具
)
```

禁用特定工具：

```python
agent = AIAgent(
    model="anthropic/claude-sonnet-4",
    quiet_mode=True,
    disabled_toolsets=["dangerous"],  # 禁用危险工具
)
```

---

## 完整示例：Web 搜索代理

```python
from run_agent import AIAgent

# 创建一个具有网络搜索能力的代理
agent = AIAgent(
    model="anthropic/claude-sonnet-4",
    quiet_mode=True,
    enabled_toolsets=["core", "web"],
)

# 使用网络搜索回答查询
response = agent.chat("搜索最新的 AI 新闻并总结前 3 个故事")
print(response)
```

---

## 在异步代码中使用

`AIAgent` 是同步的。要在异步上下文中使用它，请在单独的线程中运行它：

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor
from run_agent import AIAgent

executor = ThreadPoolExecutor()

async def ask_hermes(question: str) -> str:
    agent = AIAgent(
        model="anthropic/claude-sonnet-4",
        quiet_mode=True,
    )
    
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        executor,
        agent.chat,
        question
    )

# 在 async 函数中使用
async def main():
    response = await ask_hermes("解释量子计算")
    print(response)

asyncio.run(main())
```

---

## 会话持久化

`AIAgent` 本身不持久化会话。每次调用 `chat()` 或 `run_conversation()` 都会启动一个新会话。要实现多轮对话，请手动管理消息历史：

```python
from run_agent import AIAgent

agent = AIAgent(
    model="anthropic/claude-sonnet-4",
    quiet_mode=True,
)

# 维护消息历史
messages = []

# 第一轮
result = agent.run_conversation(
    user_message="你好，我叫 Alice",
    conversation_history=messages,
)
messages = result["messages"]

# 第二轮（保留上下文）
result = agent.run_conversation(
    user_message="我叫什么名字？",
    conversation_history=messages,
)
print(result["final_response"])  # "Alice"
```

---

## 错误处理

代理可能因各种原因引发异常：

```python
from run_agent import AIAgent

agent = AIAgent(
    model="anthropic/claude-sonnet-4",
    quiet_mode=True,
)

try:
    response = agent.chat("搜索示例")
except Exception as e:
    print(f"错误: {e}")
    # 处理错误...
```

---

## 完整 API 参考

### AIAgent 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `model` | str | 模型名称（例如 "anthropic/claude-sonnet-4"） |
| `quiet_mode` | bool | 禁用终端输出（推荐用于程序化使用） |
| `enabled_toolsets` | List[str] | 启用的工具集列表 |
| `disabled_toolsets` | List[str] | 禁用的工具集列表 |
| `max_iterations` | int | 最大 API 调用次数（默认：90） |
| `save_trajectories` | bool | 保存轨迹数据 |
| `skip_memory` | bool | 跳过记忆检索 |
| `skip_context_files` | bool | 跳过上下文文件加载 |
| `platform` | str | 平台标识符（例如 "api"） |
| `session_id` | str | 会话 ID（用于持久化） |

### 方法

- **`chat(message: str) -> str`** — 简单接口，返回最终响应字符串
- **`run_conversation(user_message: str, **kwargs) -> dict`** — 完整接口，返回包含 final_response、messages 等的字典

---

## 相关资源

- [配置指南](../user-guide/configuration.md)
- [工具参考](../reference/tools-reference.md)
- [API 服务器](../user-guide/features/api-server.md)
