---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 个性与 SOUL.md
description: 使用全局 SOUL.md、内置个性和自定义角色定义自定义 Hermes Agent 的个性
permalink: /hermes/user-guide/features/personality
---

# 个性与 SOUL.md

Hermes Agent 的个性是完全可自定义的。`SOUL.md` 是**主要身份**——它是系统提示中的第一件事，定义了 Agent 是谁。

- `SOUL.md` —— 一个持久的人格文件，位于 `HERMES_HOME` 中，作为 Agent 的身份（系统提示中的插槽 #1）
- 内置或自定义 `/personality` 预设 —— 会话级系统提示覆盖

如果您想更改 Hermes 的身份 —— 或用完全不同的 Agent 角色替换它 —— 请编辑 `SOUL.md`。

## SOUL.md 现在如何工作

Hermes 现在在以下位置自动种子一个默认的 `SOUL.md`：

```text
~/.hermes/SOUL.md
```

更精确地说，它使用当前实例的 `HERMES_HOME`，因此如果您使用自定义主目录运行 Hermes，它将使用：

```text
$HERMES_HOME/SOUL.md
```

### 重要行为

- **SOUL.md 是 Agent 的主要身份。** 它占据系统提示中的插槽 #1，替换硬编码的默认身份。
- 如果尚不存在，Hermes 会自动创建一个入门 `SOUL.md`
- 永远不会覆盖现有的用户 `SOUL.md` 文件
- Hermes 仅从 `HERMES_HOME` 加载 `SOUL.md`
- Hermes 不会在当前工作目录中查找 `SOUL.md`
- 如果 `SOUL.md` 存在但为空，或无法加载，Hermes 会回退到内置的默认身份
- 如果 `SOUL.md` 有内容，则在安全扫描和截断后逐字注入内容
- SOUL.md**不会**在上下文文件部分中重复 —— 它只出现一次，作为身份

这使 `SOUL.md` 成为真正的每用户或每实例身份，而不仅仅是一个附加层。

## 为什么这样设计

这保持了个性的可预测性。

如果 Hermes 从您碰巧启动它的任何目录加载 `SOUL.md`，您的个性可能会在项目之间意外改变。通过仅从 `HERMES_HOME` 加载，个性属于 Hermes 实例本身。

这也使其更容易教用户：
- "编辑 `~/.hermes/SOUL.md` 以更改 Hermes 的默认个性。"

## 在哪里编辑它

对于大多数用户：

```bash
~/.hermes/SOUL.md
```

如果您使用自定义主目录：

```bash
$HERMES_HOME/SOUL.md
```

## SOUL.md 中应该放什么？

将其用于持久的语气和个性指导，例如：
- 语气
- 沟通风格
- 直接程度
- 默认交互风格
- 在风格上应避免什么
- Hermes 应如何处理不确定性、分歧或歧义

较少用于：
- 一次性项目指令
- 文件路径
- 仓库约定
- 临时工作流细节

这些属于 `AGENTS.md`，而不是 `SOUL.md`。

## 好的 SOUL.md 内容

一个好的 SOUL 文件是：
- 跨上下文稳定
- 足够广泛以适用于许多对话
- 足够具体以实质性地塑造声音
- 专注于沟通和身份，而非任务特定指令

### 示例

```markdown
# 个性

您是一位务实的高级工程师，品味独到。
您优化真实、清晰和有用性，而非礼貌的虚礼。

## 风格
- 直接而不冷漠
- 偏好实质而非填充
- 当某个想法不好时提出反对
- 坦率地承认不确定性
- 除非深度有用，否则保持解释简洁

## 应避免什么
- 谄媚
- 炒作语言
- 如果用户的框架错误，不要重复
- 过度解释显而易见的事情

## 技术姿态
- 偏好简单系统而非聪明系统
- 关注运营现实，而非理想化架构
- 将边缘情况视为设计的一部分，而非清理
```

## Hermes 注入提示中的内容

`SOUL.md` 内容直接进入系统提示的插槽 #1 —— Agent 身份位置。其周围不添加包装语言。

内容经过：
- 提示注入扫描
- 如果太大则截断

如果文件为空、仅空白或无法读取，Hermes 会回退到内置的默认身份（"You are Hermes Agent, an intelligent AI assistant created by Nous Research..."）。当设置 `skip_context_files` 时（例如，在子代理/委托上下文中），此回退也适用。

## 安全扫描

`SOUL.md` 在包含之前像其他承载上下文的文件一样被扫描是否存在提示注入模式。

这意味着您仍应将其专注于角色/声音，而非试图偷偷加入奇怪的元指令。

## SOUL.md 与 AGENTS.md 对比

这是最重要的区别。

### SOUL.md
用于：
- 身份
- 语气
- 风格
- 沟通默认值
- 个性级行为

### AGENTS.md
用于：
- 项目架构
- 编码约定
- 工具偏好
- 仓库特定工作流
- 命令、端口、路径、部署说明

一个有用的规则：
- 如果它应该跟随您到处去，它属于 `SOUL.md`
- 如果它属于一个项目，它属于 `AGENTS.md`

## SOUL.md 与 `/personality` 对比

`SOUL.md` 是您持久的默认个性。

`/personality` 是一个会话级覆盖，可更改或补充当前系统提示。

所以：
- `SOUL.md` = 基线声音
- `/personality` = 临时模式切换

示例：
- 保持一个务实的默认 SOUL，然后使用 `/personality teacher` 进行辅导对话
- 保持一个简洁的 SOUL，然后使用 `/personality creative` 进行头脑风暴

## 内置个性

Hermes 附带内置个性，您可以使用 `/personality` 切换到它们。

| 名称 | 描述 |
|------|-------------|
| **helpful** | 友好、通用的助手 |
| **concise** | 简短、切中要害的回应 |
| **technical** | 详细、准确的技术专家 |
| **creative** | 创新、跳出框框的思考 |
| **teacher** | 耐心的教育者，有清晰的例子 |
| **kawaii** | 可爱的表情、闪光和热情 ★ |
| **catgirl** | 带有猫般表达的 Neko-chan，nya~ |
| **pirate** | Captain Hermes，精通技术的海盗 |
| **shakespeare** | 带有戏剧风格的吟游诗人散文 |
| **surfer** | 完全冷静的老兄氛围 |
| **noir** | 硬汉侦探叙述 |
| **uwu** | 带有 uwu 说话方式的最大可爱 |
| **philosopher** | 对每个查询的深思熟虑 |
| **hype** | 最大能量和热情！！！ |

## 使用命令切换个性

### CLI

```text
/personality
/personality concise
/personality technical
```

### 消息平台

```text
/personality teacher
```

这些是方便的覆盖，但除非覆盖有意义地更改它，否则您的全局 `SOUL.md` 仍赋予 Hermes 其持久的默认个性。

## 配置中的自定义个性

您还可以在 `~/.hermes/config.yaml` 中的 `agent.personalities` 下定义命名的自定义个性。

```yaml
agent:
  personalities:
    codereviewer: >
      You are a meticulous code reviewer. Identify bugs, security issues,
      performance concerns, and unclear design choices. Be precise and constructive.
```

然后切换到它：

```text
/personality codereviewer
```

## 推荐的工作流

一个强大的默认设置是：

1. 在 `~/.hermes/SOUL.md` 中保持一个深思熟虑的全局 `SOUL.md`
2. 将项目指令放在 `AGENTS.md` 中
3. 仅在您想要临时模式切换时使用 `/personality`

这为您提供：
- 稳定的声音
- 项目特定的行为在它所属的地方
- 需要时的临时控制

## 个性如何与完整提示交互

在高层次上，提示堆栈包括：
1. **SOUL.md**（Agent 身份 —— 或如果 SOUL.md 不可用则为内置回退）
2. 工具感知行为指导
3. 记忆/用户上下文
4. 技能指导
5. 上下文文件（`AGENTS.md`、`.cursorrules`）
6. 时间戳
7. 平台特定的格式提示
8. 可选的系统提示覆盖，如 `/personality`

`SOUL.md` 是基础 —— 其他所有内容都建立在其之上。

## 相关文档

- [上下文文件](/docs/user-guide/features/context-files)
- [配置](/docs/user-guide/configuration)
- [技巧与最佳实践](/docs/guides/tips)
- [SOUL.md 指南](/docs/guides/use-soul-with-hermes)

## CLI 外观与会话个性对比

会话个性和 CLI 外观是分开的：

- `SOUL.md`、`agent.system_prompt` 和 `/personality` 影响 Hermes 的说话方式
- `display.skin` 和 `/skin` 影响 Hermes 在终端中的外观

对于终端外观，请参阅[皮肤与主题](./skins.md)。
