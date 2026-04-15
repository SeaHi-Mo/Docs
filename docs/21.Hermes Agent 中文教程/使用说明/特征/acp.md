---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: ACP 编辑器集成
description: 在支持 ACP 的编辑器中使用 Hermes Agent，如 VS Code、Zed 和 JetBrains
permalink: /hermes/user-guide/features/acp
---

# ACP 编辑器集成

Hermes Agent 可以作为 ACP 服务器运行，让兼容 ACP 的编辑器通过 stdio 与 Hermes 通信并渲染：

- 聊天消息
- 工具活动
- 文件差异
- 终端命令
- 审批提示
- 流式思考 / 响应块

当您希望 Hermes 表现得像编辑器原生的编程助手，而非独立的 CLI 或消息机器人时，ACP 是一个很好的选择。

## Hermes 在 ACP 模式下暴露的内容

Hermes 运行一个精选的 `hermes-acp` 工具集，专为编辑器工作流设计。它包括：

- 文件工具：`read_file`、`write_file`、`patch`、`search_files`
- 终端工具：`terminal`、`process`
- 网络/浏览器工具
- 记忆、待办事项、会话搜索
- 技能
- execute_code 和 delegate_task
- 视觉

它有意排除了不适合典型编辑器用户体验的功能，如消息传递和 cronjob 管理。

## 安装

正常安装 Hermes，然后添加 ACP 额外组件：

```bash
pip install -e '.[acp]'
```

这将安装 `agent-client-protocol` 依赖并启用：

- `hermes acp`
- `hermes-acp`
- `python -m acp_adapter`

## 启动 ACP 服务器

以下任一命令都会在 ACP 模式下启动 Hermes：

```bash
hermes acp
```

```bash
hermes-acp
```

```bash
python -m acp_adapter
```

Hermes 将日志输出到 stderr，因此 stdout 保留给 ACP JSON-RPC 通信。

## 编辑器设置

### VS Code

安装 ACP 客户端扩展，然后将其指向仓库的 `acp_registry/` 目录。

示例设置片段：

```json
{
  "acpClient.agents": [
    {
      "name": "hermes-agent",
      "registryDir": "/path/to/hermes-agent/acp_registry"
    }
  ]
}
```

### Zed

示例设置片段：

```json
{
  "agent_servers": {
    "hermes-agent": {
      "type": "custom",
      "command": "hermes",
      "args": ["acp"],
    },
  },
}
```

### JetBrains

使用兼容 ACP 的插件并将其指向：

```text
/path/to/hermes-agent/acp_registry
```

## 注册表清单

ACP 注册表清单位于：

```text
acp_registry/agent.json
```

它通告一个基于命令的 Agent，其启动命令为：

```text
hermes acp
```

## 配置和凭证

ACP 模式使用与 CLI 相同的 Hermes 配置：

- `~/.hermes/.env`
- `~/.hermes/config.yaml`
- `~/.hermes/skills/`
- `~/.hermes/state.db`

提供商解析使用 Hermes 的正常运行时解析器，因此 ACP 继承当前配置的提供商和凭证。

## 会话行为

ACP 会话由 ACP 适配器的内存会话管理器在服务器运行时跟踪。

每个会话存储：

- 会话 ID
- 工作目录
- 选定的模型
- 当前对话历史
- 取消事件

底层的 `AIAgent` 仍然使用 Hermes 的常规持久化/日志路径，但 ACP 的 `list/load/resume/fork` 作用域为当前运行的 ACP 服务器进程。

## 工作目录行为

ACP 会话将编辑器的 cwd 绑定到 Hermes 任务 ID，因此文件和终端工具相对于编辑器工作区运行，而非服务器进程 cwd。

## 审批

危险的终端命令可以作为审批提示路由回编辑器。ACP 审批选项比 CLI 流程更简单：

- 允许一次
- 始终允许
- 拒绝

超时或错误时，审批桥会拒绝请求。

## 故障排除

### ACP Agent 未出现在编辑器中

检查：

- 编辑器指向正确的 `acp_registry/` 路径
- Hermes 已安装并在您的 PATH 上
- ACP 额外组件已安装 (`pip install -e '.[acp]'`)

### ACP 启动但立即报错

尝试以下检查：

```bash
hermes doctor
hermes status
hermes acp
```

### 缺少凭证

ACP 模式没有自己的登录流程。它使用 Hermes 现有的提供商设置。使用以下命令配置凭证：

```bash
hermes model
```

或通过编辑 `~/.hermes/.env`。

## 另请参阅

- [ACP 内部机制](../../developer-guide/acp-internals.md)
- [提供商运行时解析](../../developer-guide/provider-runtime.md)
- [工具运行时](../../developer-guide/tools-runtime.md)
