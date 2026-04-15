---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 记忆提供商
description: >-
  外部记忆提供商插件 ——
  Honcho、OpenViking、Mem0、Hindsight、Holographic、RetainDB、ByteRover、Supermemory
permalink: /hermes/user-guide/features/memory-providers
---

# 记忆提供商

Hermes Agent 附带 8 个外部记忆提供商插件，为 Agent 提供内置 MEMORY.md 和 USER.md 之外的持久、跨会话知识。一次只能激活**一个**外部提供商 —— 内置记忆始终与其一起激活。

## 快速开始

```bash
hermes memory setup      # 交互式选择器 + 配置
hermes memory status     # 检查激活状态
hermes memory off        # 禁用外部提供商
```

您也可以通过 `hermes plugins` → 提供商插件 → 记忆提供商选择激活的记忆提供商。

或在 `~/.hermes/config.yaml` 中手动设置：

```yaml
memory:
  provider: openviking   # 或 honcho、mem0、hindsight、holographic、retaindb、byterover、supermemory
```

## 工作原理

当记忆提供商激活时，Hermes 自动：

1. **将提供商上下文注入系统提示**（提供商知道的内容）
2. **在每轮之前预取相关记忆**（后台、非阻塞）
3. **在每轮响应后同步对话轮次**到提供商
4. **在会话结束时提取记忆**（对于支持的提供商）
5. **将内置记忆写入镜像**到外部提供商
6. **添加提供商特定工具**，以便 Agent 可以搜索、存储和管理记忆

内置记忆（MEMORY.md / USER.md）完全像以前一样继续工作。外部提供商是附加的。

## 可用提供商

### Honcho

AI 原生跨会话用户建模，具有辩证问答、语义搜索和持久结论。

| | |
|---|---|
| **最适合** | 具有跨会话上下文的多智能体系统、用户-Agent 对齐 |
| **需要** | `pip install honcho-ai` + [API 密钥](https://app.honcho.dev) 或自托管实例 |
| **数据存储** | Honcho Cloud 或自托管 |
| **成本** | Honcho 定价（云）/ 免费（自托管）|

**工具：** `honcho_profile`（对等卡片）、`honcho_search`（语义搜索）、`honcho_context`（LLM 合成）、`honcho_conclude`（存储事实）

**设置向导：**
```bash
hermes honcho setup        #（传统命令）
# 或
hermes memory setup        # 选择 "honcho"
```

**配置：** `$HERMES_HOME/honcho.json`（配置文件本地）或 `~/.honcho/config.json`（全局）。解析顺序：`$HERMES_HOME/honcho.json` > `~/.hermes/honcho.json` > `~/.honcho/config.json`。

**多智能体 / 配置文件：**

每个 Hermes 配置文件获得自己的 Honcho AI 对等体，同时共享相同的工作区 —— 所有配置文件看到相同的用户表示，但每个 Agent 构建自己的身份和观察。

```bash
hermes profile create coder --clone   # 创建 honcho 对等体 "coder"，从默认继承配置
```

### OpenViking

Volcengine（ByteDance）的上下文数据库，具有文件系统风格的知识层次结构、分层检索和自动记忆提取到 6 个类别。

| | |
|---|---|
| **最适合** | 具有结构化浏览的自托管知识管理 |
| **需要** | `pip install openviking` + 运行服务器 |
| **数据存储** | 自托管（本地或云）|
| **成本** | 免费（开源，AGPL-3.0）|

**工具：** `viking_search`（语义搜索）、`viking_read`（分层：摘要/概览/完整）、`viking_browse`（文件系统导航）、`viking_remember`（存储事实）、`viking_add_resource`（摄取 URL/文档）

**设置：**
```bash
# 首先启动 OpenViking 服务器
pip install openviking
openviking-server

# 然后配置 Hermes
hermes memory setup    # 选择 "openviking"
```

### Mem0

具有语义搜索、重新排名和自动去重功能的服务器端 LLM 事实提取。

| | |
|---|---|
| **最适合** | 免提记忆管理 —— Mem0 自动处理提取 |
| **需要** | `pip install mem0ai` + API 密钥 |
| **数据存储** | Mem0 Cloud |
| **成本** | Mem0 定价 |

**工具：** `mem0_profile`（所有存储的记忆）、`mem0_search`（语义搜索 + 重新排名）、`mem0_conclude`（存储逐字事实）

**设置：**
```bash
hermes memory setup    # 选择 "mem0"
echo "MEM0_API_KEY=your-key" >> ~/.hermes/.env
```

### Hindsight

具有知识图谱、实体解析和多策略检索的长期记忆。`hindsight_reflect` 工具提供其他提供商没有的跨记忆综合。自动保留完整对话轮次（包括工具调用）并带有会话级文档跟踪。

| | |
|---|---|
| **最适合** | 基于知识图谱的召回与实体关系 |
| **需要** | 云端：[ui.hindsight.vectorize.io](https://ui.hindsight.vectorize.io) 的 API 密钥。本地：LLM API 密钥（OpenAI、Groq、OpenRouter 等）|
| **数据存储** | Hindsight Cloud 或本地嵌入式 PostgreSQL |
| **成本** | Hindsight 定价（云）或免费（本地）|

**工具：** `hindsight_retain`（带实体提取的存储）、`hindsight_recall`（多策略搜索）、`hindsight_reflect`（跨记忆综合）

### Holographic

具有 FTS5 全文搜索、信任评分和 HRR（全息减少表示）的本地 SQLite 事实存储，用于组合代数查询。

| | |
|---|---|
| **最适合** | 仅本地记忆与高级检索，无外部依赖 |
| **需要** | 无需（SQLite 始终可用）。NumPy 可选用于 HRR 代数。|
| **数据存储** | 本地 SQLite |
| **成本** | 免费 |

**工具：** `fact_store`（9 个操作：添加、搜索、探测、相关、推理、矛盾、更新、移除、列表）、`fact_feedback`（有用/无用评分训练信任评分）

**独特能力：**
- `probe` —— 特定实体的代数召回（关于人/物的所有事实）
- `reason` —— 跨多个实体的组合 AND 查询
- `contradict` —— 冲突事实的自动检测
- 非对称反馈的信任评分（+0.05 有用 / -0.10 无用）

### RetainDB

具有混合搜索（Vector + BM25 + Reranking）、7 种记忆类型和增量压缩的云端记忆 API。

| | |
|---|---|
| **最适合** | 已使用 RetainDB 基础设施的团队 |
| **需要** | RetainDB 账户 + API 密钥 |
| **数据存储** | RetainDB Cloud |
| **成本** | $20/月 |

**工具：** `retaindb_profile`（用户画像）、`retaindb_search`（语义搜索）、`retaindb_context`（任务相关上下文）、`retaindb_remember`（带类型 + 重要性的存储）、`retaindb_forget`（删除记忆）

### ByteRover

通过 `brv` CLI 的持久记忆 —— 具有分层检索（模糊文本 → LLM 驱动搜索）的分层知识树。本地优先，可选云同步。

| | |
|---|---|
| **最适合** | 想要可移植、本地优先记忆与 CLI 的开发者 |
| **需要** | ByteRover CLI（`npm install -g byterover-cli` 或[安装脚本](https://byterover.dev)）|
| **数据存储** | 本地（默认）或 ByteRover Cloud（可选同步）|
| **成本** | 免费（本地）或 ByteRover 定价（云）|

**工具：** `brv_query`（搜索知识树）、`brv_curate`（存储事实/决策/模式）、`brv_status`（CLI 版本 + 树统计）

### Supermemory

具有画像召回、语义搜索、显式记忆工具和会话结束对话摄取的语义长期记忆，通过 Supermemory 图谱 API。

| | |
|---|---|
| **最适合** | 具有用户画像和会话级图谱构建的语义召回 |
| **需要** | `pip install supermemory` + [API 密钥](https://supermemory.ai) |
| **数据存储** | Supermemory Cloud |
| **成本** | Supermemory 定价 |

**工具：** `supermemory_store`（保存显式记忆）、`supermemory_search`（语义相似性搜索）、`supermemory_forget`（按 ID 或最佳匹配查询忘记）、`supermemory_profile`（持久画像 + 最近上下文）
