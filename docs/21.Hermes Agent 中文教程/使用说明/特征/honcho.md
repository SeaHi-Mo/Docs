---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Honcho 记忆
description: 通过 Honcho 实现 AI 原生持久记忆 —— 辩证推理、多智能体用户建模和深度个性化
permalink: /hermes/user-guide/features/honcho
---

# Honcho 记忆

[Honcho](https://github.com/plastic-labs/honcho) 是一个 AI 原生记忆后端，在 Hermes 内置记忆系统之上添加了辩证推理和深度用户建模。与简单的键值存储不同，Honcho 通过事后推理对话来维护用户画像 —— 他们的偏好、沟通风格、目标和模式。

:::info Honcho 是一个记忆提供商插件
Honcho 集成到[记忆提供商](./memory-providers.md)系统中。下面的所有功能都通过统一的记忆提供商界面提供。
:::
## Honcho 增加了什么

| 功能 | 内置记忆 | Honcho |
|-----------|----------------|--------|
| 跨会话持久化 | ✔ 基于文件的 MEMORY.md/USER.md | ✔ 服务器端 API |
| 用户画像 | ✔ 手动 Agent 整理 | ✔ 自动辩证推理 |
| 多智能体隔离 | — | ✔ 每对等体画像分离 |
| 观察模式 | — | ✔ 统一或定向观察 |
| 结论（派生洞察）| — | ✔ 关于模式的服务器端推理 |
| 跨历史搜索 | ✔ FTS5 会话搜索 | ✔ 结论的语义搜索 |

**辩证推理**：每次对话后，Honcho 分析交流并推导出"结论" —— 关于用户偏好、习惯和目标的洞察。这些结论随时间积累，使 Agent 对用户的理解超越用户明确陈述的内容。

**多智能体画像**：当多个 Hermes 实例与同一用户对话时（例如，编程助手和个人助手），Honcho 维护单独的"对等体"画像。每个对等体只看到它自己的观察和结论，防止上下文交叉污染。

## 设置

```bash
hermes memory setup    # 从提供商列表中选择 "honcho"
```

或手动配置：

```yaml
# ~/.hermes/config.yaml
memory:
  provider: honcho
```

```bash
echo "HONCHO_API_KEY=your-key" >> ~/.hermes/.env
```

在 [honcho.dev](https://honcho.dev) 获取 API 密钥。

## 配置选项

```yaml
# ~/.hermes/config.yaml
honcho:
  observation: directional    # "unified"（新安装的默认）或 "directional"
  peer_name: ""               # 从平台自动检测，或手动设置
```

**观察模式：**
- `unified` —— 所有观察都进入单个池。更简单，适合单智能体设置。
- `directional` —— 观察被标记方向（user→agent、agent→user）。支持更丰富的对话动态分析。

## 工具

当 Honcho 作为记忆提供商激活时，四个额外的工具可用：

| 工具 | 用途 |
|------|---------|
| `honcho_conclude` | 触发最近对话的服务器端辩证推理 |
| `honcho_context` | 从 Honcho 的记忆中检索当前对话的相关上下文 |
| `honcho_profile` | 查看或更新用户的 Honcho 画像 |
| `honcho_search` | 跨所有存储的结论和观察进行语义搜索 |

## CLI 命令

```bash
hermes honcho status          # 显示连接状态和配置
hermes honcho peer            # 为多智能体设置更新对等体名称
```

## 从 `hermes honcho` 迁移

如果您之前使用独立的 `hermes honcho setup`：

1. 您现有的配置（`honcho.json` 或 `~/.honcho/config.json`）被保留
2. 您的服务器端数据（记忆、结论、用户画像）保持不变
3. 在 config.yaml 中设置 `memory.provider: honcho` 以重新激活

无需重新登录或重新设置。运行 `hermes memory setup` 并选择 "honcho" —— 向导会检测您现有的配置。

## 完整文档

有关完整参考，请参阅[记忆提供商 —— Honcho](./memory-providers.md#honcho)。
