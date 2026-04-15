---
title: "MCP 配置参考"
sidebar_position: 8
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/reference/mcp-config-reference
description: "Hermes Agent MCP 配置键、过滤语义和实用工具策略的参考"
---


# MCP 配置参考

此页面是主要 MCP 文档的紧凑参考配套。

有关概念指导，请参阅：
- [MCP（模型上下文协议）](/docs/user-guide/features/mcp)
- [在 Hermes 中使用 MCP](/docs/guides/use-mcp-with-hermes)

## 根配置结构

```yaml
mcp_servers:
  <server_name>:
    command: "..."      # stdio 服务器
    args: []
    env: {}

    # 或
    url: "..."          # HTTP 服务器
    headers: {}

    enabled: true
    timeout: 120
    connect_timeout: 60
    tools:
      include: []
      exclude: []
      resources: true
      prompts: true
```

## 服务器键

| 键 | 类型 | 适用于 | 含义 |
|---|---|---|---|
| `command` | string | stdio | 启动的可执行文件 |
| `args` | list | stdio | 子进程的参数 |
| `env` | mapping | stdio | 传递给子进程的环境 |
| `url` | string | HTTP | 远程 MCP 端点 |
| `headers` | mapping | HTTP | 远程服务器请求的标头 |
| `enabled` | bool | 两者 | 为 false 时完全跳过服务器 |
| `timeout` | number | 两者 | 工具调用超时 |
| `connect_timeout` | number | 两者 | 初始连接超时 |
| `tools` | mapping | 两者 | 过滤和实用工具策略 |
| `auth` | string | HTTP | 认证方法。设置为 `oauth` 以启用带 PKCE 的 OAuth 2.1 |
| `sampling` | mapping | 两者 | 服务器发起的 LLM 请求策略（请参阅 MCP 指南） |

## `tools` 策略键

| 键 | 类型 | 含义 |
|---|---|---|
| `include` | string 或 list | 白名单服务器原生 MCP 工具 |
| `exclude` | string 或 list | 黑名单服务器原生 MCP 工具 |
| `resources` | bool-like | 启用/禁用 `list_resources` + `read_resource` |
| `prompts` | bool-like | 启用/禁用 `list_prompts` + `get_prompt` |

## 过滤语义

### `include`

如果设置了 `include`，则仅注册那些服务器原生 MCP 工具。

```yaml
tools:
  include: [create_issue, list_issues]
```

### `exclude`

如果设置了 `exclude` 且未设置 `include`，则注册除这些名称外的每个服务器原生 MCP 工具。

```yaml
tools:
  exclude: [delete_customer]
```

### 优先级

如果两者都设置，`include` 获胜。

```yaml
tools:
  include: [create_issue]
  exclude: [create_issue, delete_issue]
```

结果：
- `create_issue` 仍然允许
- `delete_issue` 被忽略，因为 `include` 优先

## 实用工具策略

Hermes 可能会为每个 MCP 服务器注册这些实用包装器：

| 实用工具 | 何时注册 | 控制方式 |
|----------|--------------|---------|
| `mcp__list_resources` | `tools.resources` 为真或 `resources: true` | `tools.resources: false` 禁用 |
| `mcp__read_resource` | `tools.resources` 为真或 `resources: true` | `tools.resources: false` 禁用 |
| `mcp__list_prompts` | `tools.prompts` 为真或 `prompts: true` | `tools.prompts: false` 禁用 |
| `mcp__get_prompt` | `tools.prompts` 为真或 `prompts: true` | `tools.prompts: false` 禁用 |

默认情况下，如果省略 `tools.resources` 和 `tools.prompts`，两者都启用。

## 示例配置

### 具有过滤的基本 stdio 服务器

```yaml
mcp_servers:
  github:
    command: npx
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: ${GITHUB_TOKEN}
    tools:
      include: [search_repositories, list_issues, create_issue]
```

### 具有资源/提示禁用的 HTTP 服务器

```yaml
mcp_servers:
  internal_api:
    url: https://api.internal.com/mcp
    headers:
      Authorization: Bearer ${INTERNAL_API_TOKEN}
    tools:
      resources: false
      prompts: false
```

### 仅特定工具的严格白名单

```yaml
mcp_servers:
  database:
    command: ./db-mcp-server
    tools:
      include: [query, describe_table]
      resources: false
      prompts: false
```

### 已禁用服务器

```yaml
mcp_servers:
  deprecated_server:
    command: ./old-server
    enabled: false
```

## 环境变量扩展

配置支持 `${VAR}` 和 `${VAR:-default}` 语法：

```yaml
mcp_servers:
  github:
    command: npx
    env:
      GITHUB_TOKEN: ${GITHUB_PERSONAL_ACCESS_TOKEN}
      FALLBACK_KEY: ${BACKUP_TOKEN:-default_token_here}
```

## 重新加载配置

更改 `config.yaml` 后，重新加载 MCP 服务器：

```bash
/reload-mcp
```

或从 CLI：

```bash
hermes mcp reload
```

## 故障排除

### 服务器未显示

1. 检查 `enabled: true`（默认）
2. 验证命令/URL 可访问
3. 检查环境变量是否设置
4. 查看网关日志中的连接错误

### 工具缺失

1. 检查 `include` / `exclude` 过滤器
2. 验证服务器实际暴露的工具（检查服务器日志）
3. 确保 `tools` 策略未禁用所有内容

### 超时问题

```yaml
mcp_servers:
  slow_server:
    command: ./slow-tool
    timeout: 300        # 增加工具调用超时
    connect_timeout: 120 # 增加初始连接超时
```

## 完整模式

```yaml
mcp_servers:
  <name>:
    # 传输（选择一个）
    command: string          # stdio：可执行路径
    args: [string]           # stdio：参数
    env: {key: value}        # stdio：环境变量
    
    # 或
    url: string              # HTTP：端点 URL
    headers: {key: value}    # HTTP：请求标头
    auth: oauth              # HTTP：启用 OAuth 2.1 + PKCE
    
    # 通用
    enabled: bool            # 默认：true
    timeout: number          # 秒，默认：120
    connect_timeout: number  # 秒，默认：60
    
    # 工具和实用工具策略
    tools:
      include: string|list   # 白名单工具
      exclude: string|list   # 黑名单工具
      resources: bool        # 默认：true
      prompts: bool          # 默认：true
    
    # 服务器发起的 LLM 请求
    sampling:
      enabled: bool          # 默认：false
```
