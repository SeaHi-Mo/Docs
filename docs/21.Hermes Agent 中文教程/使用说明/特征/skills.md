---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 技能（Skills）
description: 按需知识文档 —— 渐进式披露、智能体管理的技能和技能中心
permalink: /hermes/user-guide/features/skills
---

# 技能（Skills）

技能是智能体可以在需要时加载的按需知识文档。它们遵循**渐进式披露**模式以最小化令牌使用，并与 [agentskills.io](https://agentskills.io/specification) 开放标准兼容。

所有技能都位于 **`~/.hermes/skills/`** —— 主要目录和真相来源。全新安装时，捆绑的技能从仓库复制。中心安装和智能体创建的技能也放在这里。智能体可以修改或删除任何技能。

您还可以将 Hermes 指向**外部技能目录** —— 与本地目录一起扫描的附加文件夹。请参阅下面的 [外部技能目录](#external-skill-directories)。

另请参阅：

- [捆绑技能目录](/docs/reference/skills-catalog)
- [官方可选技能目录](/docs/reference/optional-skills-catalog)

## 使用技能

每个已安装的技能都会自动作为斜杠命令可用：

```bash
# 在 CLI 或任何消息平台中：
/gif-search funny cats
/axolotl help me fine-tune Llama 3 on my dataset
/github-pr-workflow create a PR for the auth refactor
/plan design a rollout for migrating our auth provider

# 仅输入技能名称即可加载它并让智能体询问您需要什么：
/excalidraw
```

捆绑的 `plan` 技能是具有自定义行为的技能支持斜杠命令的一个好例子。运行 `/plan [request]` 告诉 Hermes 在需要时检查上下文，编写 markdown 实现计划而不是执行任务，并将结果保存到活动工作区/后端工作目录下的 `.hermes/plans/`。

您还可以通过自然对话与技能交互：

```bash
hermes chat --toolsets skills -q "你有什么技能？"
hermes chat --toolsets skills -q "Show me the axolotl skill"
```

## 渐进式披露

技能使用令牌高效的加载模式：

```
Level 0: skills_list()           → [{name, description, category}, ...]   (~3k tokens)
Level 1: skill_view(name)        → Full content + metadata       (varies)
Level 2: skill_view(name, path)  → Specific reference file       (varies)
```

智能体仅在实际需要时才加载完整的技能内容。

## SKILL.md 格式

```markdown
---
name: my-skill
description: Brief description of what this skill does
version: 1.0.0
platforms: [macos, linux]     # Optional — restrict to specific OS platforms
metadata:
  hermes:
    tags: [python, automation]
    category: devops
    fallback_for_toolsets: [web]    # Optional — conditional activation (see below)
    requires_toolsets: [terminal]   # Optional — conditional activation (see below)
    config:                          # Optional — config.yaml settings
      - key: my.setting
        description: "What this controls"
        default: "value"
        prompt: "Prompt for setup"
---

# Skill Title

## When to Use
Trigger conditions for this skill.

## Procedure
1. Step one
2. Step two

## Pitfalls
- Known failure modes and fixes

## Verification
How to confirm it worked.
```

### 平台特定技能

技能可以使用 `platforms` 字段将自己限制到特定操作系统：

| 值 | 匹配 |
|-------|---------|
| `macos` | macOS (Darwin) |
| `linux` | Linux |
| `windows` | Windows |

```yaml
platforms: [macos]            # 仅限 macOS（例如，iMessage、Apple Reminders、FindMy）
platforms: [macos, linux]     # macOS 和 Linux
```

设置后，技能在不兼容的平台上会自动从系统提示、`skills_list()` 和斜杠命令中隐藏。如果省略，技能会在所有平台上加载。

### 条件激活（回退技能）

技能可以根据当前会话中可用的工具自动显示或隐藏自己。这对**回退技能**最有用 —— 当高级工具不可用时应该出现的免费或本地替代方案。

```yaml
metadata:
  hermes:
    fallback_for_toolsets: [web]      # 仅当这些工具集不可用时显示
    requires_toolsets: [terminal]     # 仅当这些工具集可用时显示
    fallback_for_tools: [web_search]  # 仅当这些特定工具不可用时显示
    requires_tools: [terminal]        # 仅当这些特定工具可用时显示
```

| 字段 | 行为 |
|-------|----------|
| `fallback_for_toolsets` | 当列出的工具集可用时，技能**隐藏**。当它们缺失时显示。 |
| `fallback_for_tools` | 相同，但检查单个工具而不是工具集。 |
| `requires_toolsets` | 当列出的工具集不可用时，技能**隐藏**。当它们存在时显示。 |
| `requires_tools` | 相同，但检查单个工具。 |

**示例：** 内置的 `duckduckgo-search` 技能使用 `fallback_for_toolsets: [web]`。当您设置了 `FIRECRAWL_API_KEY` 时，web 工具集可用，智能体使用 `web_search` —— DuckDuckGo 技能保持隐藏。如果 API 密钥缺失，web 工具集不可用，DuckDuckGo 技能会自动作为回退出现。

没有任何条件字段的技能行为与之前完全相同 —— 它们始终显示。

## 加载时的安全设置

技能可以声明所需的环境变量而不会从发现中消失：

```yaml
required_environment_variables:
  - name: TENOR_API_KEY
    prompt: Tenor API key
    help: Get a key from https://developers.google.com/tenor
    required_for: full functionality
```

当遇到缺失值时，Hermes 仅在本地 CLI 中实际加载技能时安全地询问它。您可以跳过设置并继续使用技能。消息界面永远不会在聊天中询问秘密 —— 它们告诉您改为在本地使用 `hermes setup` 或 `~/.hermes/.env`。

设置后，声明的 env 变量会**自动传递**给 `execute_code` 和 `terminal` 沙盒 —— 技能的脚本可以直接使用 `$TENOR_API_KEY`。对于非技能 env 变量，请使用 `terminal.env_passthrough` 配置选项。详情请参阅 [环境变量传递](/docs/user-guide/security#environment-variable-passthrough)。

### 技能配置设置
