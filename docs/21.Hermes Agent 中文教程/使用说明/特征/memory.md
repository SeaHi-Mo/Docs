---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 长记忆
description: Hermes Agent 如何跨会话记忆 —— MEMORY.md、USER.md 和会话搜索
permalink: /hermes/user-guide/features/memory
---

# 长记忆

Hermes Agent 具有有界的、经过策划的记忆，可以跨会话持久化。这让它能够记住您的偏好、您的项目、您的环境以及它学到的东西。

## 工作原理

两个文件构成智能体的记忆：

| 文件 | 目的 | 字符限制 |
|------|---------|------------|
| **MEMORY.md** | 智能体的个人笔记 —— 环境事实、约定、学到的东西 | 2,200 字符（~800 令牌） |
| **USER.md** | 用户配置文件 —— 您的偏好、沟通风格、期望 | 1,375 字符（~500 令牌） |

两者都存储在 `~/.hermes/memories/` 中，并在会话开始时作为冻结快照注入系统提示。智能体通过 `memory` 工具管理自己的记忆 —— 它可以添加、替换或删除条目。

:::info
字符限制保持记忆集中。当记忆满时，智能体会整合或替换条目以腾出空间给新信息。
:::
## 记忆如何出现在系统提示中

在每个会话开始时，记忆条目从磁盘加载并作为冻结块渲染到系统提示中：

```
══════════════════════════════════════════════
MEMORY (your personal notes) [67% — 1,474/2,200 chars]
══════════════════════════════════════════════
User's project is a Rust web service at ~/code/myapi using Axum + SQLx
§
This machine runs Ubuntu 22.04, has Docker and Podman installed
§
User prefers concise responses, dislikes verbose explanations
```

格式包括：
- 一个标题，显示哪个存储（MEMORY 或 USER PROFILE）
- 使用百分比和字符计数，让智能体知道容量
- 由 `§`（章节符号）分隔符分隔的单个条目
- 条目可以是多行的

**冻结快照模式：** 系统提示注入在会话开始时捕获一次，会话中永远不会改变。这是故意的 —— 它保留了 LLM 的前缀缓存以提高性能。当智能体在会话期间添加/删除记忆条目时，更改会立即持久化到磁盘，但在下一个会话开始之前不会出现在系统提示中。工具响应始终显示实时状态。

## 记忆工具操作

智能体使用带有这些操作的 `memory` 工具：

- **add** —— 添加新记忆条目
- **replace** —— 用更新内容替换现有条目（通过 `old_text` 使用子字符串匹配）
- **remove** —— 删除不再相关的条目（通过 `old_text` 使用子字符串匹配）

没有 `read` 操作 —— 记忆内容会在会话开始时自动注入系统提示。智能体将其记忆视为其对话上下文的一部分。

### 子字符串匹配

`replace` 和 `remove` 操作使用短唯一子字符串匹配 —— 您不需要完整的条目文本。`old_text` 参数只需要是一个唯一标识恰好一个条目的子字符串：

```python
# 如果记忆包含 "User prefers dark mode in all editors"
memory(action="replace", target="memory",
       old_text="dark mode",
       content="User prefers light mode in VS Code, dark mode in terminal")
```

如果子字符串匹配多个条目，则返回错误，要求更具体的匹配。

## 两个目标解释

### `memory` —— 智能体的个人笔记

用于智能体需要记住的有关环境、工作流和经验教训的信息：

- 环境事实（操作系统、工具、项目结构）
- 项目约定和配置
- 发现的工具怪癖和解决方法
- 已完成的任务日记条目
- 有效的技能和技术

### `user` —— 用户配置文件

用于有关用户身份、偏好和沟通风格的信息：

- 姓名、角色、时区
- 沟通偏好（简洁与详细、格式偏好）
- 厌恶和要避免的事情
- 工作流习惯
- 技术水平

## 保存与跳过什么

### 保存这些（主动）

智能体会自动保存 —— 您不需要询问。当学到以下内容时它会保存：

- **用户偏好：** "我更喜欢 TypeScript 而不是 JavaScript" → 保存到 `user`
- **环境事实：** "此服务器运行 Debian 12 和 PostgreSQL 16" → 保存到 `memory`
- **更正：** "不要对 Docker 命令使用 `sudo`，用户在 docker 组中" → 保存到 `memory`
- **约定：** "项目使用制表符、120 字符行宽、Google 风格文档字符串" → 保存到 `memory`
- **已完成的工作：** "2026-01-15 从 MySQL 迁移数据库到 PostgreSQL" → 保存到 `memory`
- **明确请求：** "记住我的 API 密钥轮换每月进行" → 保存到 `memory`

### 跳过这些

- **琐碎/明显信息：** "用户询问了 Python" —— 太模糊而无用
- **容易重新发现的事实：** "Python 3.12 支持 f-string 嵌套" —— 可以网络搜索
- **原始数据转储：** 大代码块、日志文件、数据表 —— 对记忆来说太大
- **会话特定的短暂信息：** 临时文件路径、一次性调试上下文
- **上下文文件中已有的信息：** SOUL.md 和 AGENTS.md 内容

## 容量管理

记忆有严格的字符限制以保持系统提示有界：

| 存储 | 限制 | 典型条目 |
|-------|-------|----------------|
| memory | 2,200 字符 | 8-15 条目 |
| user | 1,375 字符 | 5-10 条目 |

### 记忆满时会发生什么

当您尝试添加会超出限制的条目时，工具返回错误：

```json
{
  "success": false,
  "error": "Memory at 2,100/2,200 chars. Adding this entry (250 chars) would exceed the limit. Replace or remove existing entries first.",
  "current_entries": ["..."],
  "usage": "2,100/2,200"
}
```

然后智能体应该：
1. 读取当前条目（显示在错误响应中）
2. 识别可以删除或整合的条目
3. 使用 `replace` 将相关条目合并为更短的版本
4. 然后 `add` 新条目

**最佳实践：** 当记忆容量超过 80% 时（在系统提示标题中可见），在添加新条目之前整合条目。例如，将三个单独的 "project uses X" 条目合并为一个全面的项目描述条目。

### 良好记忆条目的实际示例

**紧凑、信息密集的条目效果最好：**

```
# 良好：打包多个相关事实
User runs macOS 14 Sonoma, uses Homebrew, has Docker Desktop and Podman. Shell: zsh with oh-my-zsh. Editor: VS Code with Vim keybindings.

# 良好：具体、可操作的约定
Project ~/code/api uses Go 1.22, sqlc for DB queries, chi router. Run tests with 'make test'. CI via GitHub Actions.

# 良好：带有上下文的经验教训
The staging server (10.0.1.50) needs SSH port 2222, not 22. Key is at ~/.ssh/staging_ed25519.

# 糟糕：太模糊
User has a project.

# 糟糕：太冗长
On January 5th, 2026, the user asked me to look at their project which is
located at ~/code/api. I discovered it uses Go version 1.22 and...
```

## 重复预防

记忆系统会自动拒绝完全重复的条目。如果您尝试添加已存在的内容，它会返回成功并带有 "no duplicate added" 消息。

## 安全扫描

记忆条目在被接受之前会扫描注入和渗出模式，因为它们被注入系统提示。匹配威胁模式（提示注入、凭据渗出、SSH 后门）或包含不可见 Unicode 字符的内容会被阻止。

## 会话搜索

除了 MEMORY.md 和 USER.md，智能体可以使用 `session_search` 工具搜索其过去的对话：

- 所有 CLI 和消息会话都存储在 SQLite（`~/.hermes/state.db`）中，带有 FTS5 全文搜索
- 搜索查询返回使用 Gemini Flash 摘要的相关过去对话
- 智能体可以找到几周前讨论的内容，即使它们不在其活跃记忆中

```bash
hermes sessions list    # 浏览过去的会话
```

### session_search vs memory

| 功能 | 持久记忆 | 会话搜索 |
|---------|------------------|----------------|
| **容量** | ~1,300 令牌总计 | 无限制（所有会话） |
| **速度** | 即时（在系统提示中） | 需要搜索 + LLM 摘要 |
| **使用场景** | 始终可用的关键事实 | 查找特定的过去对话 |
| **管理** | 由智能体手动策划 | 自动 —— 所有会话存储 |
| **令牌成本** | 每会话固定（~1,300 令牌） | 按需（需要时搜索） |

**记忆**用于应该始终在上下文中的关键事实。**会话搜索**用于 "我们上周讨论过 X 吗？" 查询，智能体需要回忆过去对话的具体内容。

## 配置

```yaml
# 在 ~/.hermes/config.yaml 中
memory:
  memory_enabled: true
  user_profile_enabled: true
  memory_char_limit: 2200   # ~800 令牌
  user_char_limit: 1375     # ~500 令牌
```

## 外部记忆提供商

对于超越 MEMORY.md 和 USER.md 的更深入、持久记忆，Hermes 附带 8 个外部记忆提供商插件 —— 包括 Honcho、OpenViking、Mem0、Hindsight、Holographic、RetainDB、ByteRover 和 Supermemory。

外部提供商在内置记忆**旁边**运行（从不替换它），并添加知识图谱、语义搜索、自动事实提取和跨会话用户建模等功能。

```bash
hermes memory setup      # 选择提供商并配置它
hermes memory status     # 检查激活的内容
```

有关每个提供商的完整详情、设置说明和比较，请参阅 [记忆提供商](./memory-providers.md) 指南。
