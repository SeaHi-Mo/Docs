---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Cron 内部机制
description: Hermes 如何存储、调度、编辑、暂停、加载技能和传递 cron 作业
permalink: /hermes/developer-guide/cron-internals
---

# Cron 内部机制

cron 子系统提供计划任务执行 —— 从简单的一次性延迟到具有技能注入和跨平台传递的递归 cron 表达式作业。

## 关键文件

| 文件 | 用途 |
|------|---------|
| `cron/jobs.py` | 作业模型、存储、`jobs.json` 的原子读/写 |
| `cron/scheduler.py` | 调度器循环 —— 到期作业检测、执行、重复跟踪 |
| `tools/cronjob_tools.py` | 面向模型的 `cronjob` 工具注册和处理程序 |
| `gateway/run.py` | 网关集成 —— 长运行循环中的 cron 滴答 |
| `hermes_cli/cron.py` | CLI `hermes cron` 子命令 |

## 调度模型

支持四种调度格式：

| 格式 | 示例 | 行为 |
|--------|---------|----------|
| **相对延迟** | `30m`、`2h`、`1d` | 一次性，在指定持续时间后触发 |
| **间隔** | `every 2h`、`every 30m` | 重复，定期触发 |
| **Cron 表达式** | `0 9 * * *` | 标准 5 字段 cron 语法（分、时、日、月、周） |
| **ISO 时间戳** | `2025-01-15T09:00:00` | 一次性，在确切时间触发 |

面向模型的界面是具有操作式操作的单个 `cronjob` 工具：`create`、`list`、`update`、`pause`、`resume`、`run`、`remove`。

## 作业存储

作业以原子写语义（写入临时文件，然后重命名）存储在 `~/.hermes/cron/jobs.json` 中。每个作业记录包含：

```json
{
  "id": "job_abc123",
  "name": "每日简报",
  "prompt": "总结今天的 AI 新闻和融资轮",
  "schedule": "0 9 * * *",
  "skills": ["ai-funding-daily-report"],
  "deliver": "telegram:-1001234567890",
  "repeat": null,
  "state": "scheduled",
  "next_run": "2025-01-16T09:00:00Z",
  "run_count": 42,
  "created_at": "2025-01-01T00:00:00Z",
  "model": null,
  "provider": null,
  "script": null
}
```

### 作业生命周期状态

| 状态 | 含义 |
|-------|---------|
| `scheduled` | 激活，将在下次计划时间触发 |
| `paused` | 暂停 —— 直到恢复前不会触发 |
| `completed` | 重复次数耗尽或一次性作业已触发 |
| `running` | 当前正在执行（瞬态状态） |

### 向后兼容性

旧作业可能有单个 `skill` 字段而不是 `skills` 数组。调度器在加载时规范化它 —— 单个 `skill` 被提升为 `skills: [skill]`。

## 调度器运行时

### 滴答周期

调度器以周期性滴答运行（默认：每 60 秒）：

```text
tick()
  1. 获取调度器锁（防止重叠滴答）
  2. 从 jobs.json 加载所有作业
  3. 过滤到期作业（next_run <= now AND state == "scheduled"）
  4. 对于每个到期作业：
     a. 将状态设置为 "running"
     b. 创建新的 AIAgent 会话（无对话历史）
     c. 按顺序加载附加技能（作为用户消息注入）
     d. 通过智能体运行作业提示
     e. 将响应传递到配置的目标
     f. 更新 run_count，计算 next_run
     g. 如果重复次数耗尽 → state = "completed"
     h. 否则 → state = "scheduled"
  5. 将更新的作业写回 jobs.json
  6. 释放调度器锁
```

### 网关集成

在网关模式下，调度器滴答集成到网关的主事件循环中。网关在周期性维护周期中调用 `scheduler.tick()`，与消息处理并行运行。

在 CLI 模式下，仅在运行 `hermes cron` 命令或活动 CLI 会话期间触发 cron 作业。

### 全新会话隔离

每个 cron 作业在全新的智能体会话中运行：

- 没有先前运行的对话历史
- 没有先前 cron 执行的记忆（除非持久化到记忆/文件）
- 提示必须是自包含的 —— cron 作业不能提出澄清问题
- `cronjob` 工具集被禁用（递归保护）

## 技能支持作业

cron 作业可以通过 `skills` 字段附加一个或多个技能。执行时：

1. 技能按指定顺序加载
2. 每个技能的 SKILL.md 内容作为上下文注入
3. 作业的提示作为任务指令追加
4. 智能体处理组合的技能上下文 + 提示

这无需将完整指令粘贴到 cron 提示中即可实现可重用、经过测试的工作流程。例如：

```
创建每日融资报告 → 附加 "ai-funding-daily-report" 技能
```

### 脚本支持作业

作业还可以通过 `script` 字段附加 Python 脚本。脚本在每次智能体回合之前运行，其标准输出作为上下文注入到提示中。这支持数据收集和变更检测模式：

```python
# ~/.hermes/scripts/check_competitors.py
import requests, json
# 获取竞争对手发布说明，与上次运行比较
# 将摘要打印到标准输出 —— 智能体分析并报告
```

脚本超时默认为 120 秒。`_get_script_timeout()` 通过三层链解析限制：

1. **模块级覆盖** —— `_SCRIPT_TIMEOUT`（用于测试/猴子补丁）。仅在与默认值不同时使用。
2. **环境变量** —— `HERMES_CRON_SCRIPT_TIMEOUT`
3. **配置** —— `config.yaml` 中的 `cron.script_timeout_seconds`（通过 `load_config()` 读取）
4. **默认值** —— 120 秒

### 提供商恢复

`run_job()` 将用户配置的回退提供商和凭证池传递到 `AIAgent` 实例：

- **回退提供商** —— 从 `config.yaml` 读取 `fallback_providers`（列表）或 `fallback_model`（旧字典），匹配网关的 `_load_fallback_model()` 模式。作为 `fallback_model=` 传递给 `AIAgent.__init__`，将两种格式规范化为回退链。
- **凭证池** —— 使用解析的运行时提供商名称从 `agent.credential_pool` 通过 `load_pool(provider)` 加载。仅在池有凭证时传递 (`pool.has_credentials()`)。启用 429/速率限制错误时的同提供商密钥轮换。

这反映了网关的行为 —— 没有它，cron 智能体将在速率限制时失败而无需尝试恢复。

## 传递模型

cron 作业结果可以传递到任何支持的平台：

| 目标 | 语法 | 示例 |
|--------|--------|---------|
| 来源聊天 | `origin` | 传递到创建作业的聊天 |
| 本地文件 | `local` | 保存到 `~/.hermes/cron/output/` |
| Telegram | `telegram` 或 `telegram:<chat_id>` | `telegram:-1001234567890` |
| Discord | `discord` 或 `discord:#channel` | `discord:#engineering` |
| Slack | `slack` | 传递到 Slack 主页频道 |
| WhatsApp | `whatsapp` | 传递到 WhatsApp 主页 |
| Signal | `signal` | 传递到 Signal |
| Matrix | `matrix` | 传递到 Matrix 主页房间 |
| Mattermost | `mattermost` | 传递到 Mattermost 主页 |
| 电子邮件 | `email` | 通过电子邮件传递 |
| 短信 | `sms` | 通过短信传递 |
| Home Assistant | `homeassistant` | 传递到 HA 对话 |
| 钉钉 | `dingtalk` | 传递到钉钉 |
| 飞书 | `feishu` | 传递到飞书 |
| 企业微信 | `wecom` | 传递到企业微信 |
| 微信 | `weixin` | 传递到微信 |
| BlueBubbles | `bluebubbles` | 通过 BlueBubbles 传递到 iMessage |

对于 Telegram 话题，使用格式 `telegram:<chat_id>:<thread_id>`（例如，`telegram:-1001234567890:17585`）。

### 响应包装

默认情况下 (`cron.wrap_response: true`)，cron 传递会包装：
- 标识 cron 作业名称和任务的标题
- 注意智能体在对话中看不到传递消息的页脚

cron 响应中的 `[SILENT]` 前缀完全抑制传递 —— 适用于只需要写入文件或执行副作用的作业。

### 会话隔离

cron 传递不会镜像到网关会话对话历史。它们仅存在于 cron 作业自己的会话中。这防止目标聊天对话中的消息交替违规。

## 递归保护

cron 运行会话禁用了 `cronjob` 工具集。这防止：
- 计划作业创建新的 cron 作业
- 可能爆炸令牌使用的递归调度
- 从作业内部意外修改作业计划

## 锁定

调度器使用基于文件的锁定来防止重叠滴答执行相同的到期作业批次两次。这在网关中很重要，因为多个维护周期可能重叠（如果之前的滴答耗时超过滴答间隔）。

## CLI 界面

`hermes cron` CLI 提供直接作业管理：

```bash
hermes cron list                    # 显示所有作业
hermes cron create                  # 交互式作业创建（别名：add）
hermes cron edit <job_id>           # 编辑作业配置
hermes cron pause <job_id>          # 暂停运行中的作业
hermes cron resume <job_id>         # 恢复暂停的作业
hermes cron run <job_id>            # 立即触发执行
hermes cron remove <job_id>         # 删除作业
```

## 相关文档

- [Cron 功能指南](/docs/user-guide/features/cron)
- [网关内部机制](./gateway-internals.md)
- [智能体循环内部机制](./agent-loop.md)
