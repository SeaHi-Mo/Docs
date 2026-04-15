---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/user-guide/docker
title: "Docker"
description: "在 Docker 中运行 Hermes Agent 并使用 Docker 作为终端后端"
---

# Hermes Agent — Docker

Docker 与 Hermes Agent 有两种不同的交互方式：

1. **在 Docker 中运行 Hermes** —— 代理本身在容器内运行（本页主要焦点）
2. **使用 Docker 作为终端后端** —— 代理在主机上运行，但在 Docker 沙箱中执行命令（请参阅 [配置 → terminal.backend](./configuration.md)）

本页介绍选项 1。容器将所有用户数据（配置、API 密钥、会话、技能、记忆）存储在从主机挂载的 `/opt/data` 的单个目录中。镜像本身是无状态的，可以通过拉取新版本进行升级而不会丢失任何配置。

## 快速开始

如果这是您第一次运行 Hermes Agent，请在主机上创建数据目录并交互式启动容器以运行设置向导：

```sh
mkdir -p ~/.hermes
docker run -it --rm \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent setup
```

这将进入设置向导，提示您输入 API 密钥并将其写入 `~/.hermes/.env`。您只需要执行一次。强烈建议此时设置一个聊天系统以便网关使用。

## 在网关模式下运行

配置完成后，将容器作为持久网关在后台运行（Telegram、Discord、Slack、WhatsApp 等）：

```sh
docker run -d \
  --name hermes \
  --restart unless-stopped \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent gateway run
```

## 交互式运行（CLI 聊天）

针对正在运行的数据目录打开交互式聊天会话：

```sh
docker run -it --rm \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent
```

## 持久化卷

`/opt/data` 卷是所有 Hermes 状态的单一事实来源。它映射到主机的 `~/.hermes/` 目录并包含：

| 路径 | 内容 |
|------|----------|
| `.env` | API 密钥和机密 |
| `config.yaml` | 所有 Hermes 配置 |
| `SOUL.md` | 代理个性/身份 |
| `sessions/` | 对话历史 |
| `memories/` | 持久化记忆存储 |
| `skills/` | 已安装的技能 |
| `cron/` | 定时任务定义 |
| `hooks/` | 事件钩子 |
| `logs/` | 运行时日志 |
| `skins/` | 自定义 CLI 皮肤 |

:::warning
切勿同时针对同一数据目录运行两个 Hermes 容器 —— 会话文件和记忆存储不是为并发访问设计的。
:::
## 环境变量转发

API 密钥从容器内的 `/opt/data/.env` 读取。您也可以直接传递环境变量：

```sh
docker run -it --rm \
  -v ~/.hermes:/opt/data \
  -e ANTHROPIC_API_KEY="sk-ant-..." \
  -e OPENAI_API_KEY="sk-..." \
  nousresearch/hermes-agent
```

直接 `-e` 标志会覆盖 `.env` 中的值。这对 CI/CD 或密钥管理器集成很有用，因为您不希望将密钥存储在磁盘上。

## Docker Compose 示例

对于持久化网关部署，`docker-compose.yaml` 很方便：

```yaml
version: "3.8"
services:
  hermes:
    image: nousresearch/hermes-agent:latest
    container_name: hermes
    restart: unless-stopped
    command: gateway run
    volumes:
      - ~/.hermes:/opt/data
    # 取消注释以转发特定环境变量而不是使用 .env 文件：
    # environment:
    #   - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    #   - OPENAI_API_KEY=${OPENAI_API_KEY}
    #   - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: "2.0"
```

使用 `docker compose up -d` 启动并使用 `docker compose logs -f hermes` 查看日志。

## 资源限制

Hermes 容器需要适度的资源。推荐最低配置：

| 资源 | 最低 | 推荐 |
|----------|---------|-------------|
| 内存 | 1 GB | 2–4 GB |
| CPU | 1 核 | 2 核 |
| 磁盘（数据卷） | 500 MB | 2+ GB（随会话/技能增长） |

浏览器自动化（Playwright/Chromium）是最耗费内存的功能。如果您不需要浏览器工具，1 GB 就足够了。使用浏览器工具时，至少分配 2 GB。

在 Docker 中设置限制：

```sh
docker run -d \
  --name hermes \
  --restart unless-stopped \
  --memory=4g --cpus=2 \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent gateway run
```

## Dockerfile 做了什么

官方镜像基于 `debian:13.4`，包括：

- 带有所有 Hermes 依赖的 Python 3（`pip install -e ".[all]"`）
- Node.js + npm（用于浏览器自动化和 WhatsApp 桥接）
- Playwright 和 Chromium（`npx playwright install --with-deps chromium`）
- ripgrep 和 ffmpeg 作为系统实用程序
- WhatsApp 桥接（`scripts/whatsapp-bridge/`）

入口脚本（`docker/entrypoint.sh`）在首次运行时引导数据卷：
- 创建目录结构（`sessions/`、`memories/`、`skills/` 等）
- 如果不存在 `.env`，复制 `.env.example` → `.env`
- 如果缺少默认 `config.yaml`，复制它
- 如果缺少默认 `SOUL.md`，复制它
- 使用基于清单的方法同步捆绑技能（保留用户编辑）
- 然后运行您传递的任何参数的 `hermes`

## 升级

拉取最新镜像并重新创建容器。您的数据目录不受影响。

```sh
docker pull nousresearch/hermes-agent:latest
docker rm -f hermes
docker run -d \
  --name hermes \
  --restart unless-stopped \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent gateway run
```

或使用 Docker Compose：

```sh
docker compose pull
docker compose up -d
```

## 技能和凭证文件

当使用 Docker 作为执行环境时（不是上面的方法，而是当代理在 Docker 沙箱内运行命令时），Hermes 会自动将技能目录（`~/.hermes/skills/`）和技能声明的任何凭证文件作为只读卷绑定挂载到容器中。这意味着技能脚本、模板和引用无需手动配置即可在沙箱中使用。

SSH 和 Modal 后端也会发生相同的同步 —— 技能和凭证文件在每次命令之前通过 rsync 或 Modal 挂载 API 上传。

## 故障排除

### 容器立即退出

检查日志：`docker logs hermes`。常见原因：
- 缺少或无效的 `.env` 文件 —— 首先交互式运行以完成设置
- 如果使用暴露端口，端口冲突

### "Permission denied" 错误

容器默认以 root 身份运行。如果您的主机 `~/.hermes/` 是由非 root 用户创建的，权限应该可以工作。如果遇到错误，请确保数据目录可写：

```sh
chmod -R 755 ~/.hermes
```

### 浏览器工具不工作

Playwright 需要共享内存。将 `--shm-size=1g` 添加到您的 Docker 运行命令：

```sh
docker run -d \
  --name hermes \
  --shm-size=1g \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent gateway run
```

### 网关在网络问题后未重新连接

`--restart unless-stopped` 标志处理大多数瞬时故障。如果网关卡住，重启容器：

```sh
docker restart hermes
```

### 检查容器健康

```sh
docker logs --tail 50 hermes          # 最近的日志
docker exec hermes hermes version     # 验证版本
docker stats hermes                    # 资源使用情况
```
