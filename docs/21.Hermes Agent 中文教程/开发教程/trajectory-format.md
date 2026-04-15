---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 轨迹格式
description: Hermes Agent 如何保存对话轨迹以用于训练数据、调试和强化学习数据集
permalink: /hermes/developer-guide/trajectory-format
---

# 轨迹格式

Hermes Agent 以 ShareGPT 兼容的 JSONL 格式保存对话轨迹，
用于训练数据、调试产物和强化学习数据集。

源文件：`agent/trajectory.py`、`run_agent.py`（搜索 `_save_trajectory`）、`batch_runner.py`

## 文件命名约定

轨迹写入当前工作目录中的文件：

| 文件 | 何时 |
|------|------|
| `trajectory_samples.jsonl` | 成功完成的对话 (`completed=True`) |
| `failed_trajectories.jsonl` | 失败或中断的对话 (`completed=False`) |

批处理运行器 (`batch_runner.py`) 为每个批次写入自定义输出文件
（例如 `batch_001_output.jsonl`），带有额外的元数据字段。

你可以通过 `save_trajectory()` 中的 `filename` 参数覆盖文件名。

## JSONL 条目格式

文件中的每一行是一个自包含的 JSON 对象。有两个变体：

### CLI/交互式格式（来自 `_save_trajectory`）

```json
{
  "conversations": [ ... ],
  "timestamp": "2026-03-30T14:22:31.456789",
  "model": "anthropic/claude-sonnet-4.6",
  "completed": true
}
```

### 批处理运行器格式（来自 `batch_runner.py`）

```json
{
  "prompt_index": 42,
  "conversations": [ ... ],
  "metadata": { "prompt_source": "gsm8k", "difficulty": "hard" },
  "completed": true,
  "partial": false,
  "api_calls": 7,
  "toolsets_used": ["code_tools", "file_tools"],
  "tool_stats": {
    "terminal": {"count": 3, "success": 3, "failure": 0},
    "read_file": {"count": 2, "success": 2, "failure": 0},
    "write_file": {"count": 0, "success": 0, "failure": 0}
  },
  "tool_error_counts": {
    "terminal": 0,
    "read_file": 0,
    "write_file": 0
  }
}
```

`tool_stats` 和 `tool_error_counts` 字典被规范化以包含
所有可能的工具（来自 `model_tools.TOOL_TO_TOOLSET_MAP`）和零默认值，
确保 HuggingFace 数据集加载的条目模式一致。

## 对话数组（ShareGPT 格式）

`conversations` 数组使用 ShareGPT 角色约定：

| API 角色 | ShareGPT `from` |
|----------|-----------------|
| system | `"system"` |
| user | `"human"` |
| assistant | `"gpt"` |
| tool | `"tool"` |

### 完整示例

```json
{
  "conversations": [
    {
      "from": "system",
      "value": "你是一个函数调用 AI 模型。在 <tools> </tools> XML 标签内提供函数签名。你可以调用一个或多个函数来协助用户查询。如果可用工具与用户查询无关，只需用自然对话语言回复。不要对函数中要插入的值做假设。调用并执行函数后，你将在 <tool_response> </tool_response> XML 标签内获得函数结果。以下是可用工具：\n<tools>\n[{\"name\": \"terminal\", \"description\": \"执行 shell 命令\", \"parameters\": {\"type\": \"object\", \"properties\": {\"command\": {\"type\": \"string\"}}}, \"required\": null}]\n</tools>\n对于每个函数调用，返回一个具有以下 pydantic 模型 json 模式的 JSON 对象：\n{'title': 'FunctionCall', 'type': 'object', 'properties': {'name': {'title': 'Name', 'type': 'string'}, 'arguments': {'title': 'Arguments', 'type': 'object'}}, 'required': ['name', 'arguments']}\n每个函数调用应包含在 <tool_call> </tool_call> XML 标签内。\n示例：\n<tool_call>\n{'name': <function-name>,'arguments': <args-dict>}\n</tool_call>"
    },
    {
      "from": "human",
      "value": "安装了什么 Python 版本？"
    },
    {
      "from": "gpt",
      "value": "<think>\n用户想知道 Python 版本。我应该运行 python3 --version。\n</think>\n<tool_call>\n{\"name\": \"terminal\", \"arguments\": {\"command\": \"python3 --version\"}}\n</tool_call>"
    },
    {
      "from": "tool",
      "value": "<tool_response>\n{\"tool_call_id\": \"call_abc123\", \"name\": \"terminal\", \"content\": \"Python 3.11.6\"}\n</tool_response>"
    },
    {
      "from": "gpt",
      "value": "<think>\n获取了版本。我现在可以回答用户。\n</think>\n此系统上安装了 Python 3.11.6。"
    }
  ],
  "timestamp": "2026-03-30T14:22:31.456789",
  "model": "anthropic/claude-sonnet-4.6",
  "completed": true
}
```

## 规范化规则

### 推理内容标记

轨迹转换器将所有推理规范化为 `<think>` 标签，无论
模型最初如何产生它：

1. **原生思考令牌**（来自 Anthropic、OpenAI o-series 等提供商的 `msg["reasoning"]` 字段）：包装为 `<think>\n{reasoning}\n</think>\n`
   并前置在内容之前。

2. **REASONING_SCRATCHPAD XML**（当禁用原生思考且模型
   通过系统提示指令的 XML 推理时）：`<REASONING_SCRATCHPAD>` 标签通过 `convert_scratchpad_to_think()` 转换为 `<think>`。

3. **空 think 块**：每个 `gpt` 回合保证有一个 `<think>`
   块。如果没有产生推理，插入空块：
   `<think>\n</think>\n` —— 这确保训练数据的格式一致。

### 工具调用规范化

来自 API 格式的工具调用（带有 `tool_call_id`、函数名称、参数为
JSON 字符串）被转换为 XML 包装的 JSON：

```
<tool_call>
{"name": "terminal", "arguments": {"command": "ls -la"}}
</tool_call>
```

- 参数从 JSON 字符串解析回对象（非双重编码）
- 如果 JSON 解析失败（不应该发生 —— 在对话期间验证），
  使用空 `{}` 并记录警告
- 一个助手回合中的多个工具调用在单个 `gpt` 消息中产生多个 `<tool_call>` 块

### 工具响应规范化

助手消息后的所有工具结果被分组到单个 `tool`
回合中，带有 XML 包装的 JSON 响应：

```
<tool_response>
{"tool_call_id": "call_abc123", "name": "terminal", "content": "output here"}
</tool_response>
```

- 如果工具内容看起来像 JSON（以 `{` 或 `[` 开头），它被解析，以便
  content 字段包含 JSON 对象/数组而不是字符串
- 多个工具结果在一条消息中用换行符连接
- 工具名称通过与父助手的 `tool_calls` 数组位置匹配

### 系统消息

系统消息在保存时生成（不是从对话中获取）。
它遵循 Hermes 函数调用提示模板，包括：

- 解释函数调用协议的前言
- 包含 JSON 工具定义的 `<tools>` XML 块
- `FunctionCall` 对象的 Schema 引用
- `<tool_call>` 示例

工具定义包括 `name`、`description`、`parameters` 和 `required`
（设置为 `null` 以匹配规范格式）。

## 加载轨迹

轨迹是标准 JSONL —— 用任何 JSON 行读取器加载：

```python
import json

def load_trajectories(path: str):
    """从 JSONL 文件加载轨迹条目。"""
    entries = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                entries.append(json.loads(line))
    return entries

# 仅过滤成功完成
successful = [e for e in load_trajectories("trajectory_samples.jsonl")
              if e.get("completed")]

# 提取对话用于训练
training_data = [e["conversations"] for e in successful]
```

### 为 HuggingFace 数据集加载

```python
from datasets import load_dataset

ds = load_dataset("json", data_files="trajectory_samples.jsonl")
```

规范化的 `tool_stats` 模式确保所有条目具有相同的列，
防止数据集加载期间的 Arrow 模式不匹配错误。

## 控制轨迹保存

在 CLI 中，轨迹保存由以下控制：

```yaml
# config.yaml
agent:
  save_trajectories: true  # 默认：false
```

或通过 `--save-trajectories` 标志。当智能体使用
`save_trajectories=True` 初始化时，`_save_trajectory()` 方法在每个对话回合结束时调用。

批处理运行器始终保存轨迹（这是其主要目的）。

所有回合中零推理的样本会被批处理运行器自动丢弃，
以避免用非推理示例污染训练数据。
