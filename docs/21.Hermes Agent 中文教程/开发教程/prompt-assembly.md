---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 提示组装
description: Hermes 如何构建系统提示、保持缓存稳定性并注入临时层
permalink: /hermes/developer-guide/prompt-assembly
---

# 提示组装

Hermes 刻意区分：

- **缓存的系统提示状态**
- **临时的 API 调用时添加**

这是项目中最重要的设计选择之一，因为它影响：

- 令牌使用
- 提示缓存有效性
- 会话连续性
- 记忆正确性

主要文件：

- `run_agent.py`
- `agent/prompt_builder.py`
- `tools/memory_tool.py`

## 缓存的系统提示层

缓存的系统提示按大致此顺序组装：

1. 智能体身份 —— 来自 `HERMES_HOME` 的 `SOUL.md`（如果可用），否则回退到 `prompt_builder.py` 中的 `DEFAULT_AGENT_IDENTITY`
2. 工具感知行为指导
3. Honcho 静态块（激活时）
4. 可选系统消息
5. 冻结的记忆快照
6. 冻结的用户配置文件快照
7. 技能索引
8. 上下文文件（`AGENTS.md`、`.cursorrules`、`.cursor/rules/*.mdc`）—— 当 SOUL.md 已在步骤 1 中作为身份加载时，**不**包含在此处
9. 时间戳 / 可选会话 ID
10. 平台提示

当设置 `skip_context_files` 时（例如，子代理委托），不加载 SOUL.md，而是使用硬编码的 `DEFAULT_AGENT_IDENTITY`。

### 具体示例：组装的系统提示

以下是当所有层都存在时最终系统提示的简化视图（注释显示每个部分的来源）：

```
# 第 1 层：智能体身份（来自 ~/.hermes/SOUL.md）
你是 Hermes，Nous Research 创建的 AI 助手。
你是专家软件工程师和研究员。
你重视正确性、清晰度和效率。
...

# 第 2 层：工具感知行为指导
你具有跨会话的持久记忆。使用记忆工具保存持久事实：
用户偏好、环境详情、工具怪癖和稳定约定。
记忆注入每次回合，因此保持紧凑并专注于稍后仍然重要的事实。
...
当你从过去对话中引用某事或怀疑存在相关的跨会话上下文时，
在要求他们重复之前使用 session_search 回忆它。

# 仅 GPT/Codex 模型的工具使用强制执行
你必须使用工具采取行动 —— 不要描述你会做什么或计划做什么而不实际去做。
...

# 第 3 层：Honcho 静态块（激活时）
[Honcho 个性/上下文数据]

# 第 4 层：可选系统消息（来自配置或 API）
[用户配置的系统消息覆盖]

# 第 5 层：冻结的记忆快照
## 持久记忆
- 用户偏好 Python 3.12，使用 pyproject.toml
- 默认编辑器是 nvim
- 正在处理 ~/code/atlas 中的 "atlas" 项目
- 时区：US/Pacific

# 第 6 层：冻结的用户配置文件快照
## 用户配置文件
- 姓名：Alice
- GitHub：alice-dev

# 第 7 层：技能索引
## 技能（强制性）
回复前，扫描下面的技能。如果有一个明显匹配
你的任务，用 skill_view(name) 加载它并遵循其说明。
...
<available_skills>
  software-development:
    - code-review: 结构化代码审查工作流程
    - test-driven-development: TDD 方法论
  research:
    - arxiv: 搜索和总结 arXiv 论文
</available_skills>

# 第 8 层：上下文文件（来自项目目录）
# 项目上下文
以下项目上下文文件已加载并应遵循：

## AGENTS.md
这是 atlas 项目。使用 pytest 进行测试。主入口点是 src/atlas/main.py。
提交前始终运行 `make lint`。

# 第 9 层：时间戳 + 会话
当前时间：2026-03-30T14:30:00-07:00
会话：abc123

# 第 10 层：平台提示
你是 CLI AI 代理。尽量不要使用 markdown，而是使用可在终端内渲染的简单文本。
```

## SOUL.md 如何在提示中出现

`SOUL.md` 位于 `~/.hermes/SOUL.md`，作为智能体的身份 —— 系统提示的第一部分。`prompt_builder.py` 中的加载逻辑如下：

```python
# 来自 agent/prompt_builder.py（简化）
def load_soul_md() -> Optional[str]:
    soul_path = get_hermes_home() / "SOUL.md"
    if not soul_path.exists():
        return None
    content = soul_path.read_text(encoding="utf-8").strip()
    content = _scan_context_content(content, "SOUL.md")  # 安全扫描
    content = _truncate_content(content, "SOUL.md")       # 限制在 20k 字符
    return content
```

当 `load_soul_md()` 返回内容时，它会替换硬编码的 `DEFAULT_AGENT_IDENTITY`。然后使用 `skip_soul=True` 调用 `build_context_files_prompt()` 函数，以防止 SOUL.md 出现两次（一次作为身份，一次作为上下文文件）。

如果 `SOUL.md` 不存在，系统回退到：

```
你是 Hermes Agent，Nous Research 创建的智能 AI 助手。
你乐于助人、知识渊博且直接。你协助用户完成广泛
的任务，包括回答问题、编写和编辑代码、分析信息、
创意工作以及通过工具执行操作。
你沟通清晰，在适当的时候承认不确定性，并优先考虑
真正有用而不是冗长，除非下面另有指示。
在探索和调查中要有针对性和效率。
```

## 上下文文件如何注入

`build_context_files_prompt()` 使用**优先级系统** —— 只加载一种项目上下文类型（首个匹配胜出）：

```python
# 来自 agent/prompt_builder.py（简化）
def build_context_files_prompt(cwd=None, skip_soul=False):
    cwd_path = Path(cwd).resolve()

    # 优先级：首个匹配胜出 —— 只加载一种项目上下文
    project_context = (
        _load_hermes_md(cwd_path)       # 1. .hermes.md / HERMES.md（遍历到 git 根目录）
        or _load_agents_md(cwd_path)    # 2. AGENTS.md（仅 CWD）
        or _load_claude_md(cwd_path)    # 3. CLAUDE.md（仅 CWD）
        or _load_cursorrules(cwd_path)  # 4. .cursorrules / .cursor/rules/*.mdc
    )

    sections = []
    if project_context:
        sections.append(project_context)

    # 来自 HERMES_HOME 的 SOUL.md（独立于项目上下文）
    if not skip_soul:
        soul_content = load_soul_md()
        if soul_content:
            sections.append(soul_content)

    if not sections:
        return ""

    return (
        "# 项目上下文\n\n"
        "以下项目上下文文件已加载 "
        "应遵循：\n\n"
        + "\n".join(sections)
    )
```

### 上下文文件发现详情

| 优先级 | 文件 | 搜索范围 | 说明 |
|----------|-------|-------------|-------|
| 1 | `.hermes.md`, `HERMES.md` | CWD 到 git 根目录 | Hermes 原生项目配置 |
| 2 | `AGENTS.md` | 仅 CWD | 常见智能体指令文件 |
| 3 | `CLAUDE.md` | 仅 CWD | Claude Code 兼容性 |
| 4 | `.cursorrules`, `.cursor/rules/*.mdc` | 仅 CWD | Cursor 兼容性 |

所有上下文文件都：
- **安全扫描** —— 检查提示注入模式（不可见 unicode、"忽略之前的指令"、凭证外泄尝试）
- **截断** —— 使用 70/20 头/尾比例和截断标记限制在 20,000 字符
- **剥离 YAML frontmatter** —— 移除 `.hermes.md` frontmatter（保留给未来的配置覆盖）

## 仅 API 调用时层

这些有意*不*作为缓存系统提示的一部分持久化：

- `ephemeral_system_prompt`
- 预填充消息
- 网关派生的会话上下文覆盖
- 注入当前回合用户消息的后期 Honcho 回忆

这种分离保持稳定前缀以进行缓存。

## 记忆快照

本地记忆和用户配置文件数据在会话开始时作为冻结快照注入。中期会话写入更新磁盘状态，但在新会话或强制重建发生之前不会变异已构建的系统提示。

## 上下文文件

`agent/prompt_builder.py` 使用**优先级系统**扫描和清理项目上下文文件 —— 只加载一种类型（首个匹配胜出）：

1. `.hermes.md` / `HERMES.md`（遍历到 git 根目录）
2. `AGENTS.md`（启动时的 CWD；会话期间通过 `agent/subdirectory_hints.py` 渐进发现子目录）
3. `CLAUDE.md`（仅 CWD）
4. `.cursorrules` / `.cursor/rules/*.mdc`（仅 CWD）

`SOUL.md` 通过 `load_soul_md()` 单独加载到身份槽。当它成功加载时，`build_context_files_prompt(skip_soul=True)` 防止它出现两次。

长文件在注入前被截断。

## 技能索引

当技能工具可用时，技能系统向提示贡献一个紧凑的技能索引。

## 为什么提示组装要这样拆分

架构被有意优化以：

- 保留提供商端的提示缓存
- 避免不必要地变异历史
- 保持记忆语义可理解
- 让网关/ACP/CLI 添加上下文而不污染持久提示状态

## 相关文档

- [上下文压缩与提示缓存](./context-compression-and-caching.md)
- [会话存储](./session-storage.md)
- [网关内部机制](./gateway-internals.md)
