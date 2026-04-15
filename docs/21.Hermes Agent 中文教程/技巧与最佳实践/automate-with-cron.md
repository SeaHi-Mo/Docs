---
title: "使用 Cron 自动化"
sidebar_position: 11
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/automate-with-cron
description: "使用 Hermes cron 的实际自动化模式 — 监控、报告、管道和多技能工作流"
---


# 使用 Cron 自动化

[每日简报机器人教程](/docs/guides/daily-briefing-bot)涵盖了基础知识。本指南更进一步 — 五个您可以为自己的工作流调整的实际自动化模式。

有关完整功能参考，请参阅[计划任务 (Cron)](/docs/user-guide/features/cron)。

:::info 关键概念
Cron 作业在全新的代理会话中运行，没有当前聊天的记忆。提示必须**完全独立** — 包含代理需要知道的一切。
:::

---

## 模式 1：网站变更监控

观察 URL 的变化，仅在发生变化时收到通知。

这里的 `script` 参数是秘密武器。一个 Python 脚本在每次执行前运行，其 stdout 成为代理的上下文。脚本处理机械工作（获取、差异）；代理处理推理（这个变化有趣吗？）。

创建监控脚本：

```bash
mkdir -p ~/.hermes/scripts
```

```python title="~/.hermes/scripts/watch-site.py"
import hashlib, json, os, urllib.request

URL = "https://example.com/pricing"
STATE_FILE = os.path.expanduser("~/.hermes/scripts/.watch-site-state.json")

# 获取当前内容
req = urllib.request.Request(URL, headers={"User-Agent": "Hermes-Monitor/1.0"})
content = urllib.request.urlopen(req, timeout=30).read().decode()
current_hash = hashlib.sha256(content.encode()).hexdigest()

# 加载先前状态
prev_hash = None
if os.path.exists(STATE_FILE):
    with open(STATE_FILE) as f:
        prev_hash = json.load(f).get("hash")

# 保存当前状态
with open(STATE_FILE, "w") as f:
    json.dump({"hash": current_hash, "url": URL}, f)

# 输出给代理
if prev_hash and prev_hash != current_hash:
    print(f"{URL} 上检测到变化")
    print(f"先前哈希: {prev_hash}")
    print(f"当前哈希: {current_hash}")
    print(f"\n当前内容（前 2000 个字符）:\n{content[:2000]}")
else:
    print("无变化")
```

设置 cron 作业：

```bash
/cron add "每 1 小时" "如果脚本输出说检测到变化，总结页面上的变化以及为什么它可能重要。如果它说无变化，只用 [静默] 响应。" --script ~/.hermes/scripts/watch-site.py --name "价格监控" --deliver telegram
```

:::tip [静默] 技巧
当代理的最终响应包含 `[静默]` 时，交付被抑制。这意味着您只在实际发生事情时收到通知 — 安静时间不会有垃圾邮件。
:::

---

## 模式 2：每周报告

将来自多个来源的信息编译成格式化的摘要。这每周运行一次并交付到您的主频道。

```bash
/cron add "0 9 * * 1" "生成一份涵盖以下内容的每周报告：

1. 在网络上搜索过去一周的前 5 个 AI 新闻故事
2. 在 GitHub 上搜索 'machine-learning' 主题中的热门仓库
3. 在 Hacker News 上检查讨论最多的 AI/ML 帖子

格式化为每个来源都有部分的简洁摘要。包含链接。
保持在 500 字以内 — 只突出重要的内容。" --name "每周 AI 摘要" --deliver telegram
```

从 CLI：

```bash
hermes cron create "0 9 * * 1" \
  "生成一份涵盖热门 AI 新闻、热门 ML GitHub 仓库和讨论最多的 HN 帖子的每周报告。按部分格式化，包含链接，保持在 500 字以内。" \
  --name "每周 AI 摘要" \
  --deliver telegram
```

`0 9 * * 1` 是一个标准的 cron 表达式：每周一上午 9:00。

---

## 模式 3：智能文件处理

监控目录中的新文件并自动处理它们。结合脚本和代理推理。

```python title="~/.hermes/scripts/check-downloads.py"
import os, json
from pathlib import Path

DOWNLOADS = Path.home() / "Downloads"
STATE_FILE = Path.home() / ".hermes/scripts/.downloads-state.json"

# 加载先前的文件列表
prev_files = set()
if STATE_FILE.exists():
    prev_files = set(json.loads(STATE_FILE.read_text()))

# 获取当前文件（仅限今天，特定模式）
current_files = set()
for f in DOWNLOADS.glob("*.pdf"):
    if f.stat().st_mtime > (time.time() - 86400):  # 过去 24 小时
        current_files.add(str(f))

# 保存当前状态
STATE_FILE.write_text(json.dumps(list(current_files)))

# 找到新文件
new_files = current_files - prev_files

if new_files:
    print("检测到新 PDF 文件：")
    for f in new_files:
        print(f"  - {f}")
else:
    print("无新文件")
```

```bash
/cron add "每 30 分钟" "对于脚本输出的每个新 PDF：

1. 阅读 PDF 并提取主要内容
2. 创建一个 3 句话的摘要
3. 用适当的标签命名文件（例如 YYYY-MM-DD-主题.pdf）
4. 将重命名的文件移动到 ~/Documents/Processed/
5. 向我发送一条消息，包含摘要和新文件名

如果没有新文件，响应 [静默]。" --script ~/.hermes/scripts/check-downloads.py --name "下载处理器" --deliver telegram
```

---

## 模式 4：数据管道监控

检查数据管道健康状况并在出现问题时收到警报。

```python title="~/.hermes/scripts/check-pipeline.py"
import requests, json, sys

API_ENDPOINT = "https://api.your-service.com/health"
API_KEY = os.getenv("SERVICE_API_KEY")

try:
    resp = requests.get(API_ENDPOINT, headers={"Authorization": f"Bearer {API_KEY}"}, timeout=10)
    data = resp.json()
    
    issues = []
    if data.get("queue_depth", 0) > 1000:
        issues.append(f"队列深度高: {data['queue_depth']}")
    if data.get("error_rate", 0) > 0.01:
        issues.append(f"错误率高: {data['error_rate']:.2%}")
    if not data.get("healthy", True):
        issues.append("服务报告不健康")
    
    if issues:
        print("ALERT: 检测到管道问题")
        for issue in issues:
            print(f"  - {issue}")
        print(f"\n完整响应: {json.dumps(data, indent=2)}")
    else:
        print("HEALTHY: 所有指标正常")
        
except Exception as e:
    print(f"ERROR: 无法检查管道: {e}")
```

```bash
/cron add "每 5 分钟" "分析脚本输出：

- 如果它以 'ALERT' 开头，总结问题并通过 Telegram 发送紧急通知
- 如果它以 'ERROR' 开头，报告连接问题
- 如果它以 'HEALTHY' 开头，响应 [静默]

对于 ALERT 情况，包括建议的操作。" --script ~/.hermes/scripts/check-pipeline.py --name "管道监控" --deliver telegram
```

---

## 模式 5：多技能工作流

使用单个 cron 作业协调多个技能的序列。

```bash
/cron add "0 8 * * 1-5" "这是一个多步骤的早晨工作流：

步骤 1 - 收集：
- 检查我的 Gmail 中来自重要发件人的未读邮件
- 查看我的 Google 日历中的今天日程
- 从 Hacker News 获取热门科技故事

步骤 2 - 分析：
- 识别任何需要我立即关注的紧急邮件
- 找出日程中的任何冲突或空档
- 标记与我的工作相关的 HN 故事

步骤 3 - 交付：
创建一份格式化的早报，包含：
- 紧急事项（如果有）
- 今天的日程概览
- 3 个相关的科技故事及其链接
- 建议的优先级

直接写入 ~/Documents/Briefings/daily-{today}.md 并通过 Telegram 发送摘要。" --name "早晨工作流" --deliver telegram
```

---

## 管理您的 Cron 作业

### 列出所有作业

```bash
/cron list
```

### 暂停/恢复作业

```bash
/cron pause 1    # 按 ID 暂停
/cron resume 1   # 按 ID 恢复
```

### 手动运行作业

```bash
/cron run 1      # 立即执行作业 1
```

### 删除作业

```bash
/cron delete 1
```

### 编辑作业

```bash
/cron edit 1 --prompt "新提示文本" --schedule "0 10 * * *"
```

---

## 最佳实践

### 1. 始终处理静默情况

当无事可做时使用 `[静默]` 技巧抑制通知：

```
如果没有任何变化，响应 [静默]。
```

### 2. 使用脚本进行状态管理

脚本非常适合：
- 跟踪先前状态（哈希、文件列表、计数器）
- 调用 API 和解析响应
- 过滤数据以仅将相关内容发送给代理

### 3. 保持提示具体

Cron 提示应该包含代理需要知道的一切：

✅ **好：** "检查 GitHub 中我的仓库的前 5 个未解决问题。对于每个问题，总结标题、标签和最后活动。如果任何问题的标签为 'urgent'，请在响应中标记它。"

❌ **坏：** "检查我的 GitHub 问题。"

### 4. 使用有意义的名称

名称出现在日志和通知中：

```bash
--name "server-health-monitor"  # 良好：清晰
--name "job-1"                  # 差：含糊
```

### 5. 测试您的脚本

在将其放入 cron 作业之前，手动运行脚本：

```bash
python ~/.hermes/scripts/watch-site.py
```

### 6. 从宽松的调度开始

当您正在调试时，使用频繁的间隔：

```bash
/cron add "每 5 分钟" "..." --name "测试"
```

验证它工作后，切换到生产间隔：

```bash
/cron edit <id> --schedule "0 9 * * 1"
```

---

## 故障排除

### 作业不运行

检查网关是否正在运行：

```bash
hermes gateway status
```

### 脚本失败

在隔离环境中手动测试：

```bash
cd ~/.hermes/scripts
python your-script.py
```

### 代理响应意外

使用详细模式检查代理实际看到的内容：

```bash
/cron run <id> --verbose
```

### 交付失败

验证 `--deliver` 平台是否已配置：

```bash
/hermes config show | grep -A5 telegram
```

---

## 下一步

- [Cron 功能参考](/docs/user-guide/features/cron) — 完整文档
- [Cron 故障排除](/docs/guides/cron-troubleshooting) — 常见问题
- [每日简报机器人](/docs/guides/daily-briefing-bot) — 入门教程
- [自动化模板](/docs/guides/automation-templates) — 预构建模板
