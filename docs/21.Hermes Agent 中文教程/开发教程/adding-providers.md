---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 添加提供商
description: 如何向 Hermes Agent 添加新的推理提供商 —— 认证、运行时解析、CLI 流程、适配器、测试和文档
permalink: /hermes/developer-guide/adding-providers
---

# 添加提供商

Hermes 已经可以通过自定义提供商路径与任何 OpenAI 兼容的端点通信。除非你想为该服务提供一流的用户体验，否则不要添加内置提供商：

- 提供商特定的认证或令牌刷新
- 精选的模型目录
- 设置 / `hermes model` 菜单条目
- `provider:model` 语法的提供商别名
- 需要适配器的非 OpenAI API 格式

如果提供商只是"另一个 OpenAI 兼容的基础 URL 和 API 密钥"，命名自定义提供商可能就足够了。

## 思维模型

内置提供商必须在几个层面对齐：

1. `hermes_cli/auth.py` 决定如何找到凭证。
2. `hermes_cli/runtime_provider.py` 将其转换为运行时数据：
   - `provider`
   - `api_mode`
   - `base_url`
   - `api_key`
   - `source`
3. `run_agent.py` 使用 `api_mode` 决定如何构建和发送请求。
4. `hermes_cli/models.py` 和 `hermes_cli/main.py` 使提供商在 CLI 中显示。（`hermes_cli/setup.py` 自动委托给 `main.py` —— 那里不需要更改。）
5. `agent/auxiliary_client.py` 和 `agent/model_metadata.py` 保持辅助任务和令牌预算正常工作。

重要的抽象是 `api_mode`。

- 大多数提供商使用 `chat_completions`。
- Codex 使用 `codex_responses`。
- Anthropic 使用 `anthropic_messages`。
- 新的非 OpenAI 协议通常意味着添加新的适配器和新的 `api_mode` 分支。

## 首先选择实现路径

### 路径 A —— OpenAI 兼容提供商

当提供商接受标准的聊天补全样式请求时使用此路径。

典型工作：

- 添加认证元数据
- 添加模型目录/别名
- 添加运行时解析
- 添加 CLI 菜单连接
- 添加辅助模型默认值
- 添加测试和用户文档

你通常不需要新的适配器或新的 `api_mode`。

### 路径 B —— 原生提供商

当提供商的行为不像 OpenAI 聊天补全时使用此路径。

树中今天的示例：

- `codex_responses`
- `anthropic_messages`

此路径包含路径 A 的所有内容，外加：

- `agent/` 中的提供商适配器
- `run_agent.py` 中用于请求构建、调度、使用提取、中断处理和响应规范化的分支
- 适配器测试

## 文件清单

### 每个内置提供商必需

1. `hermes_cli/auth.py`
2. `hermes_cli/models.py`
3. `hermes_cli/runtime_provider.py`
4. `hermes_cli/main.py`
5. `agent/auxiliary_client.py`
6. `agent/model_metadata.py`
7. 测试
8. `website/docs/` 下的用户文档

:::tip
`hermes_cli/setup.py` **不需要**更改。设置向导将提供商/模型选择委托给 `main.py` 中的 `select_provider_and_model()` —— 在那里添加的任何提供商会自动在 `hermes setup` 中可用。
:::

### 原生/非 OpenAI 提供商的附加项

10. `agent/<provider>_adapter.py`
11. `run_agent.py`
12. 如果需要提供商 SDK，则为 `pyproject.toml`

## 步骤 1：选择一个规范的提供商 ID

选择一个提供商 ID 并在各处使用。

仓库中的示例：

- `openai-codex`
- `kimi-coding`
- `minimax-cn`

相同的 ID 应出现在：

- `hermes_cli/auth.py` 中的 `PROVIDER_REGISTRY`
- `hermes_cli/models.py` 中的 `_PROVIDER_LABELS`
- `hermes_cli/auth.py` 和 `hermes_cli/models.py` 中的 `_PROVIDER_ALIASES`
- `hermes_cli/main.py` 中的 CLI `--provider` 选项
- 设置/模型选择分支
- 辅助模型默认值
- 测试

如果这些文件之间的 ID 不同，提供商可能会感觉连接不完整：认证可能工作，而 `/model`、设置或运行时解析会静默遗漏它。

## 步骤 2：在 `hermes_cli/auth.py` 中添加认证元数据

对于 API 密钥提供商，将 `ProviderConfig` 条目添加到 `PROVIDER_REGISTRY`，包括：

- `id`
- `name`
- `auth_type="api_key"`
- `inference_base_url`
- `api_key_env_vars`
- 可选的 `base_url_env_var`

还将别名添加到 `_PROVIDER_ALIASES`。

使用现有提供商作为模板：

- 简单的 API 密钥路径：Z.AI、MiniMax
- 带端点检测的 API 密钥路径：Kimi、Z.AI
- 原生令牌解析：Anthropic
- OAuth / 认证存储路径：Nous、OpenAI Codex

这里要回答的问题：

- Hermes 应该检查哪些环境变量，按什么优先顺序？
- 提供商是否需要基础 URL 覆盖？
- 它是否需要端点探测或令牌刷新？
- 凭证缺失时认证错误应该说什么？

如果提供商需要的不仅仅是"查找 API 密钥"，请添加专用的凭证解析器，而不是将逻辑塞入不相关的分支。

## 步骤 3：在 `hermes_cli/models.py` 中添加模型目录和别名

更新提供商目录，使提供商在菜单和 `provider:model` 语法中工作。

典型编辑：

- `_PROVIDER_MODELS`
- `_PROVIDER_LABELS`
- `_PROVIDER_ALIASES`
- `list_available_providers()` 内的提供商显示顺序
- 如果提供商支持实时 `/models` 获取，则为 `provider_model_ids()`

如果提供商公开实时模型列表，请优先使用该列表，并将 `_PROVIDER_MODELS` 作为静态回退。

此文件也是使如下输入工作的关键：

```text
anthropic:claude-sonnet-4-6
kimi:model-name
```

如果此处缺少别名，提供商可能正确认证，但在 `/model` 解析中仍然失败。

## 步骤 4：在 `hermes_cli/runtime_provider.py` 中解析运行时数据

`resolve_runtime_provider()` 是 CLI、网关、cron、ACP 和辅助客户端使用的共享路径。

添加一个返回包含以下内容的字典的分支：

```python
{
    "provider": "your-provider",
    "api_mode": "chat_completions",  # 或你的原生模式
    "base_url": "https://...",
    "api_key": "...",
    "source": "env|portal|auth-store|explicit",
    "requested_provider": requested_provider,
}
```

如果提供商是 OpenAI 兼容的，`api_mode` 通常应保持为 `chat_completions`。

注意 API 密钥优先级。Hermes 已经包含避免将 OpenRouter 密钥泄漏到不相关端点的逻辑。新提供商应该对哪个密钥发送到哪个基础 URL 同样明确。

## 步骤 5：在 `hermes_cli/main.py` 中连接 CLI

提供商在出现在交互式 `hermes model` 流程中之前是不可发现的。

在 `hermes_cli/main.py` 中更新这些内容：

- `provider_labels` 字典
- `select_provider_and_model()` 中的 `providers` 列表
- 提供商调度（`if selected_provider == ...`）
- `--provider` 参数选项
- 如果提供商支持这些流程，则为登录/注销选项
- `_model_flow_<provider>()` 函数，或者如果适用则重用 `_model_flow_api_key_provider()`

:::tip
`hermes_cli/setup.py` 不需要更改 —— 它调用 `main.py` 中的 `select_provider_and_model()`，所以你的新提供商会自动出现在 `hermes model` 和 `hermes setup` 中。
:::

## 步骤 6：保持辅助调用正常工作

这里有两个文件很重要：

### `agent/auxiliary_client.py`

如果这是直接的 API 密钥提供商，将便宜的/快速的默认辅助模型添加到 `_API_KEY_PROVIDER_AUX_MODELS`。

辅助任务包括：

- 视觉摘要
- 网页提取摘要
- 上下文压缩摘要
- 会话搜索摘要
- 记忆刷新

如果提供商没有合理的辅助默认值，辅助任务可能会回退不良或意外地使用昂贵的主模型。

### `agent/model_metadata.py`

添加提供商模型的上下文长度，以便令牌预算、压缩阈值和限制保持合理。

## 步骤 7：如果提供商是原生的，添加适配器和 `run_agent.py` 支持

如果提供商不是普通的聊天补全，请将提供商特定的逻辑隔离在 `agent/<provider>_adapter.py` 中。

保持 `run_agent.py` 专注于编排。它应该调用适配器辅助函数，而不是在整个文件中内联手动构建提供商有效负载。

原生提供商通常需要在以下地方进行工作：

### 新适配器文件

典型职责：

- 构建 SDK / HTTP 客户端
- 解析令牌
- 将 OpenAI 风格的对话消息转换为提供商的请求格式
- 如果需要则转换工具模式
- 将提供商响应规范化回 `run_agent.py` 期望的内容
- 提取使用和完成原因数据

### `run_agent.py`

搜索 `api_mode` 并审计每个切换点。至少验证：

- `__init__` 选择新的 `api_mode`
- 客户端构造适用于提供商
- `_build_api_kwargs()` 知道如何格式化请求
- `_api_call_with_interrupt()` 调度到正确的客户端调用
- 中断/客户端重建路径工作
- 响应验证接受提供商的形状
- 完成原因提取正确
- 令牌使用提取正确
- 回退模型激活可以干净地切换到新提供商
- 摘要生成和记忆刷新路径仍然工作

还要搜索 `run_agent.py` 中的 `self.client.`。任何假设标准 OpenAI 客户端存在的代码路径都可能在使用不同客户端对象或 `self.client = None` 的原生提供商上中断。

### 提示缓存和提供商特定的请求字段

提示缓存和提供商特定的旋钮很容易退化。

树中已有的示例：

- Anthropic 有原生的提示缓存路径
- OpenRouter 获取提供商路由字段
- 不是每个提供商都应该接收每个请求端选项

添加原生提供商时，请仔细检查 Hermes 只发送该提供商实际理解的字段。

## 步骤 8：测试

至少，触及保护提供商连接的测试。

常见位置：

- `tests/test_runtime_provider_resolution.py`
- `tests/test_cli_provider_resolution.py`
- `tests/test_cli_model_command.py`
- `tests/test_setup_model_selection.py`
- `tests/test_provider_parity.py`
- `tests/test_run_agent.py`
- 原生提供商的 `tests/test_<provider>_adapter.py`

对于仅文档的示例，确切的文件集可能不同。重点是覆盖：

- 认证解析
- CLI 菜单/提供商选择
- 运行时提供商解析
- 智能体执行路径
- provider:model 解析
- 任何适配器特定的消息转换

禁用 xdist 运行测试：

```bash
source venv/bin/activate
python -m pytest tests/test_runtime_provider_resolution.py tests/test_cli_provider_resolution.py tests/test_cli_model_command.py tests/test_setup_model_selection.py -n0 -q
```

对于更深的更改，在推送前运行完整套件：

```bash
source venv/bin/activate
python -m pytest tests/ -n0 -q
```

## 步骤 9：实时验证

测试之后，运行真实的冒烟测试。

```bash
source venv/bin/activate
python -m hermes_cli.main chat -q "打个招呼" --provider your-provider --model your-model
```

如果更改了菜单，还要测试交互式流程：

```bash
source venv/bin/activate
python -m hermes_cli.main model
python -m hermes_cli.main setup
```

对于原生提供商，还要验证至少一个工具调用，而不仅仅是纯文本响应。

## 步骤 10：更新用户文档

如果提供商打算作为一流选项发布，请同时更新用户文档：

- `website/docs/getting-started/quickstart.md`
- `website/docs/user-guide/configuration.md`
- `website/docs/reference/environment-variables.md`

开发人员可以完美地连接提供商，但仍然让用户无法发现所需的环境变量或设置流程。

## OpenAI 兼容提供商清单

如果提供商是标准聊天补全，请使用此清单。

- [ ] `ProviderConfig` 已添加到 `hermes_cli/auth.py`
- [ ] 别名已添加到 `hermes_cli/auth.py` 和 `hermes_cli/models.py`
- [ ] 模型目录已添加到 `hermes_cli/models.py`
- [ ] 运行时分支已添加到 `hermes_cli/runtime_provider.py`
- [ ] CLI 连接已添加到 `hermes_cli/main.py`（setup.py 自动继承）
- [ ] 辅助模型已添加到 `agent/auxiliary_client.py`
- [ ] 上下文长度已添加到 `agent/model_metadata.py`
- [ ] 运行时/CLI 测试已更新
- [ ] 用户文档已更新

## 原生提供商清单

当提供商需要新协议路径时使用。

- [ ] OpenAI 兼容清单中的所有内容
- [ ] 适配器已添加到 `agent/<provider>_adapter.py`
- [ ] 新的 `api_mode` 在 `run_agent.py` 中受支持
- [ ] 中断/重建路径工作
- [ ] 使用和完成原因提取工作
- [ ] 回退路径工作
- [ ] 适配器测试已添加
- [ ] 实时冒烟测试通过

## 常见陷阱

### 1. 将提供商添加到认证但未添加到模型解析

这使得凭证正确解析，而 `/model` 和 `provider:model` 输入失败。

### 2. 忘记 `config["model"]` 可以是字符串或字典

许多提供商选择代码必须对两种形式进行规范化。

### 3. 假设需要内置提供商

如果服务只是 OpenAI 兼容的，自定义提供商可能已经用更少的维护解决了用户问题。

### 4. 忘记辅助路径

主聊天路径可以工作，而摘要、记忆刷新或视觉辅助失败，因为辅助路由从未更新。

### 5. 原生提供商分支隐藏在 `run_agent.py` 中

搜索 `api_mode` 和 `self.client.`。不要假设明显的请求路径是唯一的。

### 6. 将 OpenRouter 专用的旋钮发送给其他提供商

提供商路由等字段只属于支持它们的提供商。

### 7. 更新 `hermes model` 但未更新 `hermes setup`

两个流程都需要了解提供商。

## 实现时良好的搜索目标

如果你正在寻找提供商触及的所有位置，搜索这些符号：

- `PROVIDER_REGISTRY`
- `_PROVIDER_ALIASES`
- `_PROVIDER_MODELS`
- `resolve_runtime_provider`
- `_model_flow_`
- `select_provider_and_model`
- `api_mode`
- `_API_KEY_PROVIDER_AUX_MODELS`
- `self.client.`

## 相关文档

- [提供商运行时解析](./provider-runtime.md)
- [架构](./architecture.md)
- [贡献](./contributing.md)
