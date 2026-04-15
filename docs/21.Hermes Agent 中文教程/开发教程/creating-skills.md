---
inHomePost: false
date: 2026-04-14 02:06:04
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
title: 创建技能
description: 如何为 Hermes Agent 创建技能 —— SKILL.md 格式、指南和发布
permalink: /hermes/developer-guide/creating-skills
---

# 创建技能

技能是向 Hermes Agent 添加新功能的首选方式。它们比工具更容易创建，不需要更改智能体的代码，并且可以与社区共享。

## 应该是技能还是工具？

在以下情况制作成**技能**：
- 能力可以表示为指令 + shell 命令 + 现有工具
- 它包装了智能体可以通过 `terminal` 或 `web_extract` 调用的外部 CLI 或 API
- 它不需要自定义 Python 集成或 API 密钥管理嵌入智能体中
- 示例：arXiv 搜索、git 工作流、Docker 管理、PDF 处理、通过 CLI 工具的电子邮件

在以下情况制作成**工具**：
- 它需要与 API 密钥、认证流或多组件配置的端到端集成
- 它需要每次都必须精确执行的自定义处理逻辑
- 它处理二进制数据、流式传输或实时事件
- 示例：浏览器自动化、TTS、视觉分析

## 技能目录结构

捆绑技能按类别组织在 `skills/` 中。官方可选技能在 `optional-skills/` 中使用相同的结构：

```text
skills/
├── research/
│   └── arxiv/
│       ├── SKILL.md              # 必需：主要说明
│       └── scripts/              # 可选：辅助脚本
│           └── search_arxiv.py
├── productivity/
│   └── ocr-and-documents/
│       ├── SKILL.md
│       ├── scripts/
│       └── references/
└── ...
```

## SKILL.md 格式

```markdown
---
name: my-skill
description: 简要描述（显示在技能搜索结果中）
version: 1.0.0
author: Your Name
license: MIT
platforms: [macos, linux]          # 可选 —— 限制到特定操作系统平台
                                   #   有效值：macos, linux, windows
                                   #   省略以在所有平台上加载（默认）
metadata:
  hermes:
    tags: [Category, Subcategory, Keywords]
    related_skills: [other-skill-name]
    requires_toolsets: [web]            # 可选 —— 仅当这些工具集激活时显示
    requires_tools: [web_search]        # 可选 —— 仅当这些工具可用时显示
    fallback_for_toolsets: [browser]    # 可选 —— 当这些工具集激活时隐藏
    fallback_for_tools: [browser_navigate]  # 可选 —— 当这些工具存在时隐藏
    config:                              # 可选 —— 技能需要的 config.yaml 设置
      - key: my.setting
        description: "此设置控制什么"
        default: "sensible-default"
        prompt: "设置显示提示"
required_environment_variables:          # 可选 —— 技能需要的环境变量
  - name: MY_API_KEY
    prompt: "Enter your API key"
    help: "Get one at https://example.com"
    required_for: "API access"
---

# Skill Title

Brief intro.

## When to Use
触发条件 —— 智能体何时应该加载此技能？

## Quick Reference
常见命令或 API 调用表。

## Procedure
智能体遵循的分步说明。

## Pitfalls
已知故障模式及如何处理。

## Verification
智能体如何确认它有效。
```

### 平台特定技能

技能可以使用 `platforms` 字段将自己限制到特定操作系统：

```yaml
platforms: [macos]            # 仅限 macOS（例如，iMessage、Apple Reminders）
platforms: [macos, linux]     # macOS 和 Linux
platforms: [windows]          # 仅限 Windows
```

设置后，技能在不兼容的平台上会自动从系统提示、`skills_list()` 和斜杠命令中隐藏。如果省略或为空，技能会在所有平台上加载（向后兼容）。

### 条件技能激活

技能可以声明对特定工具或工具集的依赖。这控制技能是否出现在给定会话的系统提示中。

```yaml
metadata:
  hermes:
    requires_toolsets: [web]           # 如果 web 工具集未激活则隐藏
    requires_tools: [web_search]       # 如果 web_search 工具不可用则隐藏
    fallback_for_toolsets: [browser]   # 如果 browser 工具集已激活则隐藏
    fallback_for_tools: [browser_navigate]  # 如果 browser_navigate 可用则隐藏
```

| 字段 | 行为 |
|-------|----------|
| `requires_toolsets` | 当任何列出的工具集**未**可用时，技能**隐藏** |
| `requires_tools` | 当任何列出的工具**未**可用时，技能**隐藏** |
| `fallback_for_toolsets` | 当任何列出的工具集**已**可用时，技能**隐藏** |
| `fallback_for_tools` | 当任何列出的工具**已**可用时，技能**隐藏** |

**`fallback_for_*` 的用例：** 创建当主要工具不可用时作为替代方案的技能。例如，带有 `fallback_for_tools: [web_search]` 的 `duckduckgo-search` 技能仅在 web 搜索工具（需要 API 密钥）未配置时显示。

**`requires_*` 的用例：** 创建仅当某些工具存在时才有意义的技能。例如，带有 `requires_toolsets: [web]` 的 web 抓取工作流技能不会在 web 工具禁用时混乱提示。

### 环境变量要求

技能可以声明它们需要的环境变量。当通过 `skill_view` 加载技能时，其所需变量会自动注册以传递到沙盒执行环境（terminal、execute_code）。

```yaml
required_environment_variables:
  - name: TENOR_API_KEY
    prompt: "Tenor API key"               # 提示用户时显示
    help: "Get your key at https://tenor.com"  # 帮助文本或 URL
    required_for: "GIF search functionality"   # 需要此变量的功能
```

每个条目支持：
- `name`（必需）—— 环境变量名称
- `prompt`（可选）—— 询问用户值时的提示文本
- `help`（可选）—— 获取值的帮助文本或 URL
- `required_for`（可选）—— 描述哪个功能需要此变量

用户还可以在 `config.yaml` 中手动配置传递变量：
