---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 添加工具
description: 如何向 Hermes Agent 添加新工具 —— 模式、处理程序、注册和工具集
permalink: /hermes/developer-guide/adding-tools
---

# 添加工具

在编写工具之前，先问自己：**这应该是一个[技能](creating-skills.md)吗？**

当能力可以表示为指令 + shell 命令 + 现有工具（arXiv 搜索、git 工作流、Docker 管理、PDF 处理）时，将其制作成**技能**。

当需要端到端集成 API 密钥、自定义处理逻辑、二进制数据处理或流式传输（浏览器自动化、TTS、视觉分析）时，将其制作成**工具**。

## 概述

添加工具涉及**3 个文件**：

1. **`tools/your_tool.py`** —— 处理程序、模式、检查函数、`registry.register()` 调用
2. **`toolsets.py`** —— 将工具名称添加到 `_HERMES_CORE_TOOLS`（或特定工具集）
3. **`model_tools.py`** —— 将 `"tools.your_tool"` 添加到 `_discover_tools()` 列表

## 第 1 步：创建工具文件

每个工具文件遵循相同的结构：

```python
# tools/weather_tool.py
"""Weather Tool -- look up current weather for a location."""

import json
import os
import logging

logger = logging.getLogger(__name__)

# --- 可用性检查 ---

def check_weather_requirements() -> bool:
    """Return True if the tool's dependencies are available."""
    return bool(os.getenv("WEATHER_API_KEY"))

# --- 处理程序 ---

def weather_tool(location: str, units: str = "metric") -> str:
    """Fetch weather for a location. Returns JSON string."""
    api_key = os.getenv("WEATHER_API_KEY")
    if not api_key:
        return json.dumps({"error": "WEATHER_API_KEY not configured"})
    try:
        # ... call weather API ...
        return json.dumps({"location": location, "temp": 22, "units": units})
    except Exception as e:
        return json.dumps({"error": str(e)})

# --- 模式 ---

WEATHER_SCHEMA = {
    "name": "weather",
    "description": "Get current weather for a location.",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "City name or coordinates (e.g. 'London' or '51.5,-0.1')"
            },
            "units": {
                "type": "string",
                "enum": ["metric", "imperial"],
                "description": "Temperature units (default: metric)",
                "default": "metric"
            }
        },
        "required": ["location"]
    }
}

# --- 注册 ---

from tools.registry import registry

registry.register(
    name="weather",
    toolset="weather",
    schema=WEATHER_SCHEMA,
    handler=lambda args, **kw: weather_tool(
        location=args.get("location", ""),
        units=args.get("units", "metric")),
    check_fn=check_weather_requirements,
    requires_env=["WEATHER_API_KEY"],
)
```

### 关键规则

:::danger 重要
- 处理程序**必须**返回 JSON 字符串（通过 `json.dumps()`），永远不要原始字典
- 错误**必须**作为 `{"error": "message"}` 返回，永远不要作为异常抛出
- 构建工具定义时调用 `check_fn` —— 如果返回 `False`，工具被静默排除
- `handler` 接收 `(args: dict, **kwargs)`，其中 `args` 是 LLM 的工具调用参数
:::

## 第 2 步：添加到工具集

在 `toolsets.py` 中，添加工具名称：

```python
# 如果它应该在所有平台上可用（CLI + 消息）：
_HERMES_CORE_TOOLS = [
    ...
    "weather",  # <-- 添加到这里
]

# 或创建新的独立工具集：
"weather": {
    "description": "Weather lookup tools",
    "tools": ["weather"],
    "includes": []
},
```

## 第 3 步：添加发现导入

在 `model_tools.py` 中，将模块添加到 `_discover_tools()` 列表：

```python
def _discover_tools():
    _modules = [
        ...
        "tools.weather_tool",  # <-- 添加到这里
    ]
```

此导入触发工具文件底部的 `registry.register()` 调用。

## 异步处理程序

如果您的处理程序需要异步代码，请使用 `is_async=True` 标记：

```python
async def weather_tool_async(location: str) -> str:
    async with aiohttp.ClientSession() as session:
        ...
    return json.dumps(result)

registry.register(
    name="weather",
    toolset="weather",
    schema=WEATHER_SCHEMA,
    handler=lambda args, **kw: weather_tool_async(args.get("location", "")),
    check_fn=check_weather_requirements,
    is_async=True,  # 注册表自动调用 _run_async()
)
```

注册表透明地处理异步桥接 —— 您永远不需要自己调用 `asyncio.run()`。

## 需要 task_id 的处理程序

管理每个会话状态的工具通过 `**kwargs` 接收 `task_id`：

```python
def _handle_weather(args, **kw):
    task_id = kw.get("task_id")
    return weather_tool(args.get("location", ""), task_id=task_id)

registry.register(
    name="weather",
    ...
    handler=_handle_weather,
)
```

## 智能体循环拦截工具

一些工具（`todo`, `memory`, `session_search`, `delegate_task`）需要访问每个会话的智能体状态。这些在到达注册表之前由 `run_agent.py` 拦截。注册表仍然保存它们的模式，但如果拦截被绕过，`dispatch()` 返回回退错误。

## 可选：设置向导集成

如果您的工具需要 API 密钥，请将其添加到 `hermes_cli/config.py`：

```python
OPTIONAL_ENV_VARS = {
    ...
    "WEATHER_API_KEY": {
        "description": "Weather API key for weather lookup",
        "prompt": "Weather API key",
        "url": "https://weatherapi.com/",
        "tools": ["weather"],
        "password": True,
    },
}
```

## 清单

- [ ] 工具文件已创建，包含处理程序、模式、检查函数和注册
- [ ] 添加到 `toolsets.py` 中的适当工具集
- [ ] 发现导入已添加到 `model_tools.py`
- [ ] 处理程序返回 JSON 字符串，错误作为 `{"error": "..."}` 返回
- [ ] 可选：API 密钥已添加到 `hermes_cli/config.py` 中的 `OPTIONAL_ENV_VARS`
- [ ] 可选：已添加到 `toolset_distributions.py` 以进行批处理
- [ ] 已使用 `hermes chat -q "Use the weather tool for London"` 测试
