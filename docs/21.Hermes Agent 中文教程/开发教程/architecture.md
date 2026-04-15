---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 架构
description: Hermes Agent 内部结构 —— 主要子系统、执行路径、数据流和下一步阅读内容
permalink: /hermes/developer-guide/architecture
---

# 架构

本页面是 Hermes Agent 内部结构的顶层地图。使用它在代码库中定位自己，然后深入了解特定子系统的文档以获取实现细节。

## 系统概述

```text
┌─────────────────────────────────────────────────────────────────────┐
│                        入口点                                  │
│                                                                      │
│  CLI (cli.py)    网关 (gateway/run.py)    ACP (acp_adapter/)     │
│  批处理运行器    API 服务器                  Python 库          │
└──────────┬──────────────┬───────────────────────┬───────────────────┘
           │              │                       │
           ▼              ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     AIAgent (run_agent.py)                           │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                │
│  │ 提示          │ │ 提供商       │ │ 工具         │                │
│  │ 构建器        │ │ 解析         │ │ 调度         │                │
│  │ (prompt_      │ │ (runtime_    │ │ (model_      │                │
│  │  builder.py)  │ │  provider.py)│ │  tools.py)   │                │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘                │
│         │                │                │                          │
│  ┌──────┴───────┐ ┌──────┴───────┐ ┌──────┴───────┐                │
│  │ 压缩         │ │ 3 种 API 模式│ │ 工具注册表   │                │
│  │ 与缓存       │ │ 聊天完成     │ │ (registry.py)│                │
│  │              │ │ 代码响应     │ │ 48 个工具    │                │
│  │              │ │ Anthropic    │ │ 40 个工具集  │                │
│  └──────────────┘ └──────────────┘ └──────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
           │                                    │
           ▼                                    ▼
┌───────────────────┐              ┌──────────────────────┐
│ 会话存储          │              │ 工具后端              │
│ (SQLite + FTS5)   │              │ 终端 (6 个后端)       │
│ hermes_state.py   │              │ 浏览器 (5 个后端)     │
│ gateway/session.py│              │ Web (4 个后端)        │
└───────────────────┘              │ MCP (动态)            │
                                   │ 文件、视觉等          │
                                   └──────────────────────┘
```

## 目录结构

```text
hermes-agent/
├── run_agent.py              # AIAgent —— 核心对话循环（~9,200 行）
├── cli.py                    # HermesCLI —— 交互式终端 UI（~8,500 行）
├── model_tools.py            # 工具发现、模式收集、调度
├── toolsets.py               # 工具分组和平台预设
├── hermes_state.py           # 带 FTS5 的 SQLite 会话/状态数据库
├── hermes_constants.py       # HERMES_HOME、配置文件感知路径
├── batch_runner.py           # 批量轨迹生成
│
├── agent/                    # 智能体内部
│   ├── prompt_builder.py     # 系统提示组装
│   ├── context_engine.py     # ContextEngine ABC（可插拔）
│   ├── context_compressor.py # 默认引擎 —— 有损摘要
│   ├── prompt_caching.py     # Anthropic 提示缓存
│   ├── auxiliary_client.py   # 用于辅助任务的辅助 LLM（视觉、摘要）
│   ├── model_metadata.py     # 模型上下文长度、令牌估算
│   ├── models_dev.py         # models.dev 注册表集成
│   ├── anthropic_adapter.py  # Anthropic Messages API 格式转换
│   ├── display.py            # KawaiiSpinner、工具预览格式化
│   ├── skill_commands.py     # 技能斜杠命令
│   ├── memory_manager.py     # 记忆管理器编排
│   ├── memory_provider.py    # 记忆提供商 ABC
│   └── trajectory.py         # 轨迹保存辅助函数
│
├── hermes_cli/               # CLI 子命令和设置
│   ├── main.py               # 入口点 —— 所有 `hermes` 子命令（~5,500 行）
│   ├── config.py             # DEFAULT_CONFIG、OPTIONAL_ENV_VARS、迁移
│   ├── commands.py           # COMMAND_REGISTRY —— 中央斜杠命令定义
│   ├── auth.py               # PROVIDER_REGISTRY、凭据解析
│   ├── runtime_provider.py   # 提供商 → api_mode + 凭据
│   ├── models.py             # 模型目录、提供商模型列表
│   ├── model_switch.py       # /model 命令逻辑（CLI + 网关共享）
│   ├── setup.py              # 交互式设置向导（~3,100 行）
│   ├── skin_engine.py        # CLI 主题引擎
│   ├── skills_config.py      # hermes 技能 —— 按平台启用/禁用
│   ├── skills_hub.py         # /skills 斜杠命令
│   ├── tools_config.py       # hermes 工具 —— 按平台启用/禁用
│   ├── plugins.py            # PluginManager —— 发现、加载、钩子
│   ├── callbacks.py          # 终端回调（澄清、sudo、批准）
│   └── gateway.py            # hermes 网关 启动/停止
│
├── tools/                    # 工具实现（每个工具一个文件）
│   ├── registry.py           # 中央工具注册表
│   ├── approval.py           # 危险命令检测
│   ├── terminal_tool.py      # 终端编排
│   ├── process_registry.py   # 后台进程管理
│   ├── file_tools.py         # read_file、write_file、patch、search_files
│   ├── web_tools.py          # web_search、web_extract
│   ├── browser_tool.py       # 11 个浏览器自动化工具
│   ├── code_execution_tool.py # execute_code 沙盒
│   ├── delegate_tool.py      # 子智能体委托
│   ├── mcp_tool.py           # MCP 客户端（~2,200 行）
│   ├── credential_files.py   # 基于文件的凭据传递
│   ├── env_passthrough.py    # 沙盒的环境变量传递
│   ├── ansi_strip.py         # ANSI 转义剥离
│   └── environments/         # 终端后端（本地、docker、ssh、modal、daytona、singularity）
│
├── gateway/                  # 消息平台网关
│   ├── run.py                # GatewayRunner —— 消息调度（~7,500 行）
│   ├── session.py            # SessionStore —— 对话持久化
│   ├── delivery.py           # 出站消息传递
│   ├── pairing.py            # DM 配对授权
│   ├── hooks.py              # 钩子发现和生命周期事件
│   ├── mirror.py             # 跨会话消息镜像
│   ├── status.py             # 令牌锁、配置文件范围进程跟踪
│   ├── builtin_hooks/        # 始终注册的钩子
│   └── platforms/            # 15 个适配器：telegram、discord、slack、whatsapp、
│                             #   signal、matrix、mattermost、email、sms、
│                             #   dingtalk、feishu、wecom、weixin、bluebubbles、homeassistant、webhook
│
├── acp_adapter/              # ACP 服务器（VS Code / Zed / JetBrains）
├── cron/                     # 调度器（jobs.py、scheduler.py）
├── plugins/memory/           # 记忆提供商插件
├── plugins/context_engine/   # 上下文引擎插件
├── environments/             # RL 训练环境（Atropos）
├── skills/                   # 捆绑技能（始终可用）
├── optional-skills/          # 官方可选技能（显式安装）
├── website/                  # Docusaurus 文档站点
└── tests/                    # Pytest 套件（~3,000+ 测试）
```

## 数据流

### CLI 会话

```text
用户输入 → HermesCLI.process_input()
  → AIAgent.run_conversation()
    → prompt_builder.build_system_prompt()
    → runtime_provider.resolve_runtime_provider()
    → API 调用（chat_completions / codex_responses / anthropic_messages）
    → tool_calls? → model_tools.handle_function_call() → 循环
    → 最终响应 → 显示 → 保存到 SessionDB
```

### 网关消息
