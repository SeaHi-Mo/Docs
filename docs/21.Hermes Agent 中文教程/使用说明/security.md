---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 安全
description: 安全模型、危险命令批准、用户授权、容器隔离和生产部署最佳实践
permalink: /hermes/user-guide/security
---

# 安全

Hermes Agent 采用纵深防御安全模型设计。本页面涵盖每个安全边界 —— 从命令批准到容器隔离再到消息平台上的用户授权。

## 概述

安全模型有七层：

1. **用户授权** —— 谁可以与智能体对话（允许列表、DM 配对）
2. **危险命令批准** —— 破坏性操作的人工介入
3. **容器隔离** —— Docker/Singularity/Modal 沙盒化及加固设置
4. **MCP 凭据过滤** —— MCP 子进程的环境变量隔离
5. **上下文文件扫描** —— 项目文件中的提示注入检测
6. **跨会话隔离** —— 会话无法访问彼此的数据或状态；cron 作业存储路径加固以防止路径遍历攻击
7. **输入清理** —— 终端工具后端中的工作目录参数根据允许列表进行验证以防止 shell 注入

## 危险命令批准

在执行任何命令之前，Hermes 会针对精心策划的危险模式列表进行检查。如果发现匹配，用户必须明确批准。

### 批准模式

批准系统支持三种模式，通过 `~/.hermes/config.yaml` 中的 `approvals.mode` 配置：

```yaml
approvals:
  mode: manual    # manual | smart | off
  timeout: 60     # 等待用户响应的秒数（默认：60）
```

| 模式 | 行为 |
|------|----------|
| **manual**（默认） | 始终提示用户批准危险命令 |
| **smart** | 使用辅助 LLM 评估风险。低风险命令（例如 `python -c "print('hello')"`）自动批准。真正危险的命令自动拒绝。不确定的情况升级为手动提示。 |
| **off** | 禁用所有批准检查 —— 等同于使用 `--yolo` 运行。所有命令无需提示即可执行。 |

:::warning
设置 `approvals.mode: off` 会禁用所有安全提示。仅在受信任的环境（CI/CD、容器等）中使用。
:::

### YOLO 模式

YOLO 模式绕过当前会话的**所有**危险命令批准提示。可以通过三种方式激活：

1. **CLI 标志**：使用 `hermes --yolo` 或 `hermes chat --yolo` 启动会话
2. **斜杠命令**：在会话期间键入 `/yolo` 以切换开/关
3. **环境变量**：设置 `HERMES_YOLO_MODE=1`

`/yolo` 命令是一个**切换** —— 每次使用都会切换模式：

```
> /yolo
  ⚡ YOLO 模式开启 —— 所有命令自动批准。谨慎使用。

> /yolo
  ⚠ YOLO 模式关闭 —— 危险命令将需要批准。
```

YOLO 模式在 CLI 和网关会话中都可用。在内部，它设置 `HERMES_YOLO_MODE` 环境变量，在每次命令执行前进行检查。

:::danger
YOLO 模式禁用会话的**所有**危险命令安全检查。仅在您完全信任生成的命令时使用（例如，一次性环境中的经过测试的自动化脚本）。
:::

### 批准超时

当出现危险命令提示时，用户有配置的时间量来响应。如果在超时内没有响应，命令默认**拒绝**（故障关闭）。

在 `~/.hermes/config.yaml` 中配置超时：

```yaml
approvals:
  timeout: 60  # 秒（默认：60）
```

### 触发批准的内容

以下模式会触发批准提示（在 `tools/approval.py` 中定义）：

| 模式 | 描述 |
|---------|-------------|
| `rm -r` / `rm --recursive` | 递归删除 |
| `rm ... /` | 在根路径中删除 |
| `chmod 777/666` / `o+w` / `a+w` | 全局/其他可写权限 |
| `chmod --recursive` 带有不安全权限 | 递归全局/其他可写（长标志） |
| `chown -R root` / `chown --recursive root` | 递归 chown 到 root |
| `mkfs` | 格式化文件系统 |
| `dd if=` | 磁盘复制 |
| `> /dev/sd` | 写入块设备 |
| `DROP TABLE/DATABASE` | SQL DROP |
| `DELETE FROM`（不带 WHERE） | 不带 WHERE 的 SQL DELETE |
| `TRUNCATE TABLE` | SQL TRUNCATE |
| `> /etc/` | 覆盖系统配置 |
| `systemctl stop/disable/mask` | 停止/禁用系统服务 |
| `kill -9 -1` | 终止所有进程 |
| `pkill -9` | 强制终止进程 |
| Fork 炸弹模式 | Fork 炸弹 |
| `bash -c` / `sh -c` / `zsh -c` / `ksh -c` | 通过 `-c` 标志执行 shell 命令（包括组合标志如 `-lc`） |
| `python -e` / `perl -e` / `ruby -e` / `node -c` | 通过 `-e`/`-c` 标志执行脚本 |
| `curl ... \| sh` / `wget ... \| sh` | 将远程内容管道到 shell |
| `bash <(curl ...)` / `sh <(wget ...)` | 通过进程替换执行远程脚本 |
| `tee` 到 `/etc/`, `~/.ssh/`, `~/.hermes/.env` | 通过 tee 覆盖敏感文件 |
| `>` / `>>` 到 `/etc/`, `~/.ssh/`, `~/.hermes/.env` | 通过重定向覆盖敏感文件 |
| `xargs rm` | 带 rm 的 xargs |
| `find -exec rm` / `find -delete` | 带破坏性操作的 find |
| `cp`/`mv`/`install` 到 `/etc/` | 复制/移动文件到系统配置 |
| `sed -i` / `sed --in-place` 在 `/etc/` 上 | 系统配置的就地编辑 |
| `pkill`/`killall` hermes/gateway | 自终止预防 |
| `gateway run` 带有 `&`/`disown`/`nohup`/`setsid` | 防止在服务管理器外启动网关 |

:::info
**容器绕过**：在 `docker`, `singularity`, `modal`, 或 `daytona` 后端中运行时，危险命令检查被**跳过**，因为容器本身就是安全边界。容器内的破坏性命令无法损害主机。
:::

### 批准流程（CLI）

在交互式 CLI 中，危险命令显示内联批准提示：

```
  ⚠️  危险命令：递归删除
      rm -rf /tmp/old-project

      [o]nce  |  [s]ession  |  [a]lways  |  [d]eny

      Choice [o/s/a/D]:
```

四个选项：

- **once** —— 允许此单次执行
- **session** —— 允许本会话的其余部分使用此模式
- **always** —— 添加到永久允许列表（保存到 `config.yaml`）
- **deny**（默认）—— 阻止命令

### 批准流程（网关/消息）

在消息平台上，智能体将危险命令详细信息发送到聊天并等待用户回复：

- 回复 **yes**, **y**, **approve**, **ok**, 或 **go** 以批准
- 回复 **no**, **n**, **deny**, 或 **cancel** 以拒绝

运行网关时自动设置 `HERMES_EXEC_ASK=1` 环境变量。

### 永久允许列表
