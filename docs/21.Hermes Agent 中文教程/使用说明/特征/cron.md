---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 定时任务 (Cron)
description: 使用自然语言或 cron 表达式安排自动任务，用一个 cron 工具管理它们，并附加一个或多个技能
permalink: /hermes/user-guide/features/cron
---

# 定时任务 (Cron)

使用自然语言或 cron 表达式自动安排任务。Hermes 通过单个 `cronjob` 工具公开 cron 管理，使用操作式操作而不是单独的 schedule/list/remove 工具。

## Cron 现在能做什么

Cron 作业可以：

- 安排一次性或重复任务
- 暂停、恢复、编辑、触发和删除作业
- 为零个、一个或多个技能附加到作业
- 将结果传递回来源聊天、本地文件或配置的平台目标
- 在具有正常静态工具列表的全新智能体会话中运行

:::warning
Cron 运行的会话不能递归创建更多 cron 作业。Hermes 在 cron 执行中禁用 cron 管理工具以防止失控的调度循环。
:::
## 创建定时任务

### 在聊天中使用 `/cron`

```bash
/cron add 30m "提醒我检查构建"
/cron add "每 2 小时" "检查服务器状态"
/cron add "每 1 小时" "总结新订阅源项目" --skill blogwatcher
/cron add "每 1 小时" "使用两个技能并组合结果" --skill blogwatcher --skill find-nearby
```

### 从独立 CLI

```bash
hermes cron create "每 2 小时" "检查服务器状态"
hermes cron create "每 1 小时" "总结新订阅源项目" --skill blogwatcher
hermes cron create "每 1 小时" "使用两个技能并组合结果" \
  --skill blogwatcher \
  --skill find-nearby \
  --name "技能组合"
```

### 通过自然对话

正常询问 Hermes：

```text
每天早上 9 点，查看 Hacker News 上的 AI 新闻并通过 Telegram 发送摘要给我。
```

Hermes 将在内部使用统一的 `cronjob` 工具。

## 技能支持的 Cron 作业

Cron 作业可以在运行提示之前加载一个或多个技能。

### 单个技能

```python
cronjob(
    action="create",
    skill="blogwatcher",
    prompt="检查配置的订阅源并总结任何新内容。",
    schedule="0 9 * * *",
    name="早晨订阅源",
)
```

### 多个技能

技能按顺序加载。提示成为叠加在这些技能之上的任务指令。

```python
cronjob(
    action="create",
    skills=["blogwatcher", "find-nearby"],
    prompt="查找新的本地活动和附近有趣的地方，然后将它们组合成一份简短简报。",
    schedule="每 6 小时",
    name="本地简报",
)
```

当您希望定时智能体继承可重用工作流而不将完整技能文本塞进 cron 提示本身时，这很有用。

## 编辑作业

您不需要删除并重新创建作业来更改它们。

### 聊天

```bash
/cron edit <job_id> --schedule "每 4 小时"
/cron edit <job_id> --prompt "使用修订后的任务"
/cron edit <job_id> --skill blogwatcher --skill find-nearby
/cron edit <job_id> --remove-skill blogwatcher
/cron edit <job_id> --clear-skills
```

### 独立 CLI

```bash
hermes cron edit <job_id> --schedule "每 4 小时"
hermes cron edit <job_id> --prompt "使用修订后的任务"
hermes cron edit <job_id> --skill blogwatcher --skill find-nearby
hermes cron edit <job_id> --add-skill find-nearby
hermes cron edit <job_id> --remove-skill blogwatcher
hermes cron edit <job_id> --clear-skills
```

注意：

- 重复的 `--skill` 替换作业的附加技能列表
- `--add-skill` 追加到现有列表而不替换它
- `--remove-skill` 删除特定的附加技能
- `--clear-skills` 删除所有附加技能

## 生命周期操作

Cron 作业现在拥有比仅仅创建/删除更完整的生命周期。

### 聊天

```bash
/cron list
/cron pause <job_id>
/cron resume <job_id>
/cron run <job_id>
/cron remove <job_id>
```

### 独立 CLI

```bash
hermes cron list
hermes cron pause <job_id>
hermes cron resume <job_id>
hermes cron run <job_id>
hermes cron remove <job_id>
hermes cron status
hermes cron tick
```

它们的作用：

- `pause` —— 保留作业但停止调度它
- `resume` —— 重新启用作业并计算下一个未来运行
