---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: MCP (模型上下文协议)
description: 通过 MCP 将 Hermes Agent 连接到外部工具服务器 —— 并精确控制 Hermes 加载哪些 MCP 工具
permalink: /hermes/user-guide/features/mcp
---

# MCP (模型上下文协议)

MCP 让 Hermes Agent 连接到外部工具服务器，因此智能体可以使用存在于 Hermes 本身之外的工具 —— GitHub、数据库、文件系统、浏览器堆栈、内部 API 等等。

如果您曾经希望 Hermes 使用一个已经存在于别处的工具，MCP 通常是最干净的方式。

## MCP 为您提供什么

- 无需先编写原生 Hermes 工具即可访问外部工具生态系统
- 同一配置中的本地 stdio 服务器和远程 HTTP MCP 服务器
- 启动时自动工具发现和注册
- 服务器支持时用于 MCP 资源和提示的实用包装器
- 每个服务器的过滤，因此您可以只暴露您实际希望 Hermes 看到的 MCP 工具

## 快速开始

1. 安装 MCP 支持（如果使用标准安装脚本已包含）：

```bash
cd ~/.hermes/hermes-agent
uv pip install -e ".[mcp]"
```

2. 将 MCP 服务器添加到 `~/.hermes/config.yaml`：

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
```

3. 启动 Hermes：

```bash
hermes chat
```

4. 让 Hermes 使用 MCP 支持的功能。

例如：

```text
列出 /home/user/projects 中的文件并总结仓库结构。
```

Hermes 将发现 MCP 服务器的工具并像使用任何其他工具一样使用它们。

## 两种 MCP 服务器

### Stdio 服务器

Stdio 服务器作为本地子进程运行，通过 stdin/stdout 通信。

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "***"
```

在以下情况使用 stdio 服务器：
- 服务器本地安装
- 您想要对本地资源的低延迟访问
- 您正在遵循显示 `command`, `args`, 和 `env` 的 MCP 服务器文档

### HTTP 服务器

HTTP MCP 服务器是 Hermes 直接连接的远程端点。

```yaml
mcp_servers:
  remote_api:
    url: "https://mcp.example.com/mcp"
    headers:
      Authorization: "Bearer ***"
```

在以下情况使用 HTTP 服务器：
- MCP 服务器托管在其他地方
- 您的组织暴露内部 MCP 端点
- 您不希望 Hermes 为该集成生成本地子进程

## 基本配置参考

Hermes 从 `~/.hermes/config.yaml` 下的 `mcp_servers` 读取 MCP 配置。

### 通用键

| 键 | 类型 | 含义 |
|---|---|---|
| `command` | 字符串 | stdio MCP 服务器的可执行文件 |
| `args` | 列表 | stdio 服务器的参数 |
| `env` | 映射 | 传递给 stdio 服务器的环境变量 |
| `url` | 字符串 | HTTP MCP 端点 |
| `headers` | 映射 | 远程服务器的 HTTP 头 |
| `timeout` | 数字 | 工具调用超时 |
| `connect_timeout` | 数字 | 初始连接超时 |
| `enabled` | 布尔值 | 如果为 `false`，Hermes 完全跳过该服务器 |
| `tools` | 映射 | 每个服务器的工具过滤和实用策略 |

### 最小 stdio 示例

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
```

### 最小 HTTP 示例

```yaml
mcp_servers:
  company_api:
    url: "https://mcp.internal.example.com"
    headers:
      Authorization: "Bearer ***"
```

## Hermes 如何注册 MCP 工具

Hermes 为 MCP 工具添加前缀，使它们不会与内置名称冲突：

```text
mcp_<server_name>_<tool_name>
```

示例：

| 服务器 | MCP 工具 | 注册名称 |
|---|---|---|
| `filesystem` | `read_file` | `mcp_filesystem_read_file` |
| `github` | `create-issue` | `mcp_github_create_issue` |
| `my-api` | `query.data` | `mcp_my_api_query_data` |

在实践中，您通常不需要手动调用带前缀的名称 —— Hermes 看到工具并在正常推理期间选择它。

## MCP 实用工具

支持时，Hermes 还注册围绕 MCP 资源和提示的实用工具：
