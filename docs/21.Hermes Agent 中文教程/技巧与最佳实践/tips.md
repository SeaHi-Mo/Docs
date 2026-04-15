---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/tips
title: 技巧与最佳实践
description: 充分利用 Hermes Agent 的实用建议 —— 提示技巧、CLI 快捷方式、上下文文件、记忆、成本优化和安全
---

# 技巧与最佳实践

一系列快速获胜的实用技巧，让您立即更有效地使用 Hermes Agent。每个部分针对不同的方面 —— 扫描标题并跳转到相关的内容。

---

## 获得最佳结果

### 具体说明您想要什么

模糊的提示产生模糊的结果。不要说"修复代码"，而要说"修复 `api/handlers.py` 第 47 行的 TypeError —— `process_request()` 函数从 `parse_body()` 接收 `None`。"您提供的上下文越多，所需的迭代就越少。

### 预先提供上下文

在请求前面加上相关细节：文件路径、错误消息、预期行为。一条精心设计的消息胜过三轮澄清。直接粘贴错误回溯 —— 智能体可以解析它们。

### 使用上下文文件进行重复指令

如果您发现自己重复相同的指令（"使用制表符而不是空格"，"我们使用 pytest"，"API 位于 `/api/v2`"），请将它们放在 `AGENTS.md` 文件中。智能体每个会话自动读取它 —— 设置后零工作量。

### 让智能体使用它的工具

不要试图手把手指导每一步。说"找到并修复失败的测试"而不是"打开 `tests/test_foo.py`，查看第 42 行，然后..."智能体有文件搜索、终端访问和代码执行 —— 让它探索和迭代。

### 对复杂工作流使用技能

在编写解释如何做事的长提示之前，检查是否已经有相应的技能。键入 `/skills` 浏览可用技能，或直接调用一个，如 `/axolotl` 或 `/github-pr-workflow`。

## CLI 高级用户技巧

### 多行输入

按 **Alt+Enter**（或 **Ctrl+J**）插入换行符而不发送。这让您可以撰写多行提示、粘贴代码块或在按 Enter 发送之前构建复杂的请求。

### 粘贴检测

CLI 自动检测多行粘贴。直接粘贴代码块或错误回溯 —— 它不会将每行作为单独的消息发送。粘贴被缓冲并作为一条消息发送。

### 中断和重定向

按 **Ctrl+C** 一次可中断智能体正在进行的响应。然后您可以键入新消息以重定向它。2 秒内双击 Ctrl+C 可强制退出。当智能体开始走错方向时，这非常宝贵。

### 使用 `-c` 恢复会话

忘记了上次会话的内容？运行 `hermes -c` 可准确恢复到您离开的位置，并恢复完整的对话历史。您也可以按标题恢复：`hermes -r "my research project"`。

### 剪贴板图像粘贴

按 **Ctrl+V** 将图像从剪贴板直接粘贴到聊天中。智能体使用视觉分析屏幕截图、图表、错误弹出窗口或 UI 模型 —— 无需先保存到文件。

### 斜杠命令自动完成

键入 `/` 并按 **Tab** 查看所有可用命令。这包括内置命令（`/compress`, `/model`, `/title`）和每个已安装的技能。您不需要记住任何东西 —— Tab 补全为您提供帮助。

:::tip
使用 `/verbose` 循环工具输出显示模式：**off → new → all → verbose**。"all" 模式非常适合观察智能体的操作；"off" 对于简单问答最简洁。
:::

## 上下文文件

### AGENTS.md：您项目的 brain

在项目根目录创建 `AGENTS.md`，包含架构决策、编码约定和项目特定指令。这会自动注入每个会话，因此智能体始终知道您项目的规则。

```markdown
# 项目上下文
- 这是一个使用 SQLAlchemy ORM 的 FastAPI 后端
- 始终对数据库操作使用 async/await
- 测试放在 tests/ 中并使用 pytest-asyncio
- 永远不要提交 .env 文件
```

### SOUL.md：自定义个性

想要 Hermes 拥有稳定的默认声音？编辑 `~/.hermes/SOUL.md`（或如果您使用自定义 Hermes 家目录，则为 `$HERMES_HOME/SOUL.md`）。Hermes 现在自动播种一个起始 SOUL，并使用该全局文件作为实例范围的个性来源。

有关完整演练，请参阅 [在 Hermes 中使用 SOUL.md](/docs/guides/use-soul-with-hermes)。

```markdown
# Soul
You are a senior backend engineer. Be terse and direct.
Skip explanations unless asked. Prefer one-liners over verbose solutions.
Always consider error handling and edge cases.
```

对持久个性使用 `SOUL.md`。对项目特定指令使用 `AGENTS.md`。

### .cursorrules 兼容性

已经有 `.cursorrules` 或 `.cursor/rules/*.mdc` 文件？Hermes 也会读取这些。无需重复您的编码约定 —— 它们会自动从工作目录加载。

### 发现

Hermes 在会话开始时从当前工作目录加载顶级 `AGENTS.md`。子目录 `AGENTS.md` 文件在工具调用期间延迟发现（通过 `subdirectory_hints.py`）并注入到工具结果中 —— 它们不会预先加载到系统提示中。

:::tip
保持上下文文件集中且简洁。每个字符都计入您的令牌预算，因为它们被注入到每条消息中。
:::

## 记忆与技能

### 记忆 vs 技能：什么放在哪里

**记忆**用于事实：您的环境、偏好、项目位置和智能体学到的关于您的事情。**技能**用于程序：多步工作流、工具特定指令和可重用配方。对"什么"使用记忆，对"如何"使用技能。

### 何时创建技能

如果您发现一个需要 5 步以上的任务，并且您会再次执行，请让智能体为其创建一个技能。说"将你刚才做的保存为名为 `deploy-staging` 的技能。"下次，只需键入 `/deploy-staging`，智能体就会加载完整程序。

### 管理记忆容量

记忆是有意有界的（~2,200 字符用于 MEMORY.md，~1,375 字符用于 USER.md）。当它填满时，智能体会整合条目。您可以通过说"清理你的记忆"或"替换旧的 Python 3.9 注释 —— 我们现在使用 3.12"来提供帮助。

### 让智能体记住

在富有成效的会话之后，说"下次记住这个"，智能体会保存关键要点。您也可以具体说明："保存到记忆中，我们的 CI 使用带有 `deploy.yml` 工作流的 GitHub Actions。"

:::warning
记忆是冻结快照 —— 会话期间所做的更改直到下一个会话开始才会出现在系统提示中。智能体立即写入磁盘，但提示缓存在会话中不会被使无效。
:::

## 性能与成本

### 不要破坏提示缓存

大多数 LLM 提供商缓存系统提示前缀。如果您保持系统提示稳定（相同的上下文文件、相同的记忆），会话中的后续消息会获得**缓存命中**，这显著便宜。避免在会话中更改模型或系统提示。

### 在达到限制之前使用 /compress

长会话积累令牌。当您注意到响应变慢或被截断时，运行 `/compress`。这会摘要对话历史，保留关键上下文同时显著减少令牌数量。使用 `/usage` 检查您的位置。

### 委托进行并行工作

需要同时研究三个主题？让智能体使用 `delegate_task` 和并行子任务。每个子智能体独立运行，有自己的上下文，只有最终摘要返回 —— 大幅减少主对话的令牌使用。

### 使用 execute_code 进行批处理操作

不要一次运行一个终端命令，而是让智能体编写一个一次完成所有操作的脚本。"编写一个 Python 脚本将所有 `.jpeg` 文件重命名为 `.jpg` 并运行它"比单独重命名文件更便宜更快。

### 选择正确的模型

使用 `/model` 在会话中切换模型。使用前沿模型（Claude Sonnet/Opus、GPT-4o）进行复杂推理和架构决策。切换到更快的模型进行简单任务，如格式化、重命名或样板生成。

:::tip
定期运行 `/usage` 查看您的令牌消耗。运行 `/insights` 查看过去 30 天的使用模式更广泛视图。
:::

## 消息提示

### 设置主频道

在您首选的 Telegram 或 Discord 聊天中使用 `/sethome` 将其指定为主频道。cron 作业结果和定时任务输出会传递到这里。没有它，智能体无处发送主动消息。

### 使用 /title 组织会话

使用 `/title auth-refactor` 或 `/title research-llm-quantization` 命名您的会话。命名的会话很容易通过 `hermes sessions list` 找到，并使用 `hermes -r "auth-refactor"` 恢复。未命名的会话会堆积起来，变得无法区分。

### DM 配对进行团队访问

不要手动收集用户 ID 用于允许列表，而是启用 DM 配对。当队友私信机器人时，他们会获得一次性配对代码。您使用 `hermes pairing approve telegram XKGH5N7P` 批准它 —— 简单且安全。

### 工具进度显示模式

使用 `/verbose` 控制您看到多少工具活动。在消息平台上，通常少即是多 —— 保持在 "new" 以仅查看新的工具调用。在 CLI 中，"all" 为您提供智能体所做一切的令人满意实时视图。

:::tip
在消息平台上，会话在空闲时间后自动重置（默认：24 小时）或每天凌晨 4 点。如果您需要更长的会话，请在 `~/.hermes/config.yaml` 中按平台调整。
:::

## 安全

### 对不受信任的代码使用 Docker

使用不受信任的仓库或运行不熟悉的代码时，使用 Docker 或 Daytona 作为终端后端。在 `.env` 中设置 `TERMINAL_BACKEND=docker`。容器内的破坏性命令无法损害您的主机系统。

```bash
# 在您的 .env 中：
TERMINAL_BACKEND=docker
TERMINAL_DOCKER_IMAGE=hermes-sandbox:latest
```

### 避免 Windows 编码陷阱

在 Windows 上，一些默认编码（如 `cp125x`）无法表示所有 Unicode 字符，这可能在测试或脚本中写入文件时导致 `UnicodeEncodeError`。

- 优先使用显式 UTF-8 编码打开文件：

```python
with open("results.txt", "w", encoding="utf-8") as f:
    f.write("✓ All good\n")
```

- 在 PowerShell 中，您还可以将当前会话切换到 UTF-8 以进行控制台和本机命令输出：

```powershell
$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
```

这让 PowerShell 和子进程保持 UTF-8 并有助于避免仅 Windows 故障。

### 在选择"Always"之前审查

当智能体触发危险命令批准（`rm -rf`, `DROP TABLE` 等）时，您有四个选项：**once**, **session**, **always**, **deny**。在选择 "always" 之前仔细考虑 —— 它会永久将该模式加入允许列表。在舒适之前从 "session" 开始。

### 命令批准是您的安全网

Hermes 在执行前根据精心策划的危险模式列表检查每个命令。这包括递归删除、SQL 删除、将 curl 管道到 shell 等。不要在生产环境中禁用此功能 —— 它的存在是有充分理由的。

:::warning
在容器后端（Docker、Singularity、Modal、Daytona）中运行时，危险命令检查被**跳过**，因为容器是安全边界。确保您的容器镜像被正确锁定。
:::

### 对消息机器人使用允许列表

切勿在具有终端访问权限的机器人上设置 `GATEWAY_ALLOW_ALL_USERS=true`。始终使用平台特定的允许列表（`TELEGRAM_ALLOWED_USERS`, `DISCORD_ALLOWED_USERS`）或 DM 配对来控制谁可以与您的智能体交互。

```bash
# 推荐：每个平台的显式允许列表
TELEGRAM_ALLOWED_USERS=123456789,987654321
DISCORD_ALLOWED_USERS=123456789012345678

# 或使用跨平台允许列表
GATEWAY_ALLOWED_USERS=123456789,987654321
```

---

*有应该在此页面上的技巧？打开 issue 或 PR —— 欢迎社区贡献。*
