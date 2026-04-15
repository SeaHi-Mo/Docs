---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 会话存储
description: Hermes 如何使用 SQLite 持久化会话元数据、消息历史和模型配置
permalink: /hermes/developer-guide/session-storage
---

# 会话存储

Hermes Agent 使用 SQLite 数据库 (`~/.hermes/state.db`) 来持久化会话元数据、完整消息历史和模型配置，跨越 CLI 和网关会话。这取代了早期的每个会话 JSONL 文件方法。

源文件：`hermes_state.py`

## 架构概述

```
~/.hermes/state.db (SQLite, WAL 模式)
├── sessions          —— 会话元数据、令牌计数、计费
├── messages          —— 每个会话的完整消息历史
├── messages_fts      —— 用于全文搜索的 FTS5 虚拟表
└── schema_version    —— 单列表跟踪迁移状态
```

关键设计决策：
- **WAL 模式** 用于并发读取器 + 一个写入器（网关多平台）
- **FTS5 虚拟表** 用于跨所有会话消息的 fast 文本搜索
- **会话谱系** 通过 `parent_session_id` 链（压缩触发的分割）
- **源标记** (`cli`, `telegram`, `discord` 等) 用于平台过滤
- 批处理运行器和 RL 轨迹不存储在这里（单独的系统）

## SQLite 模式

### 会话表

```sql
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    user_id TEXT,
    model TEXT,
    model_config TEXT,
    system_prompt TEXT,
    parent_session_id TEXT,
    started_at REAL NOT NULL,
    ended_at REAL,
    end_reason TEXT,
    message_count INTEGER DEFAULT 0,
    tool_call_count INTEGER DEFAULT 0,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    cache_read_tokens INTEGER DEFAULT 0,
    cache_write_tokens INTEGER DEFAULT 0,
    reasoning_tokens INTEGER DEFAULT 0,
    billing_provider TEXT,
    billing_base_url TEXT,
    billing_mode TEXT,
    estimated_cost_usd REAL,
    actual_cost_usd REAL,
    cost_status TEXT,
    cost_source TEXT,
    pricing_version TEXT,
    title TEXT,
    FOREIGN KEY (parent_session_id) REFERENCES sessions(id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_source ON sessions(source);
CREATE INDEX IF NOT EXISTS idx_sessions_parent ON sessions(parent_session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_title_unique
    ON sessions(title) WHERE title IS NOT NULL;
```

### 消息表

```sql
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    role TEXT NOT NULL,
    content TEXT,
    tool_call_id TEXT,
    tool_calls TEXT,
    tool_name TEXT,
    timestamp REAL NOT NULL,
    token_count INTEGER,
    finish_reason TEXT,
    reasoning TEXT,
    reasoning_details TEXT,
    codex_reasoning_items TEXT
);

CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, timestamp);
```

注意：
- `tool_calls` 存储为 JSON 字符串（工具调用对象序列化列表）
- `reasoning_details` 和 `codex_reasoning_items` 存储为 JSON 字符串
- `reasoning` 存储提供商暴露的原始推理文本
- 时间戳是 Unix 纪元浮点数 (`time.time()`)

### FTS5 全文搜索

```sql
CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
    content,
    content=messages,
    content_rowid=id
);
```

FTS5 表通过三个触发器与 `messages` 表的 INSERT、UPDATE 和 DELETE 保持同步：

```sql
CREATE TRIGGER IF NOT EXISTS messages_fts_insert AFTER INSERT ON messages BEGIN
    INSERT INTO messages_fts(rowid, content) VALUES (new.id, new.content);
END;

CREATE TRIGGER IF NOT EXISTS messages_fts_delete AFTER DELETE ON messages BEGIN
    INSERT INTO messages_fts(messages_fts, rowid, content)
        VALUES('delete', old.id, old.content);
END;

CREATE TRIGGER IF NOT EXISTS messages_fts_update AFTER UPDATE ON messages BEGIN
    INSERT INTO messages_fts(messages_fts, rowid, content)
        VALUES('delete', old.id, old.content);
    INSERT INTO messages_fts(rowid, content) VALUES (new.id, new.content);
END;
```

## 模式版本和迁移

当前模式版本：**6**

`schema_version` 表存储单个整数。初始化时，
`_init_schema()` 检查当前版本并顺序应用迁移：

| 版本 | 更改 |
|---------|--------|
| 1 | 初始模式（会话、消息、FTS5） |
| 2 | 向消息添加 `finish_reason` 列 |
| 3 | 向会话添加 `title` 列 |
| 4 | 在 `title` 上添加唯一索引（允许 NULL，非 NULL 必须唯一） |
| 5 | 添加计费列：`cache_read_tokens`、`cache_write_tokens`、`reasoning_tokens`、`billing_provider`、`billing_base_url`、`billing_mode`、`estimated_cost_usd`、`actual_cost_usd`、`cost_status`、`cost_source`、`pricing_version` |
| 6 | 向消息添加推理列：`reasoning`、`reasoning_details`、`codex_reasoning_items` |

每个迁移使用 try/except 包装 `ALTER TABLE ADD COLUMN` 以处理列已存在的情况（幂等）。版本号在每个成功的迁移块后递增。

## 写入争用处理

Hermes 使用 SQLite 的 WAL（预写日志）模式，它允许：
- 多个并发读取器
- 一个写入器不会阻塞读取器
- 自动检查点

对于高并发场景（网关处理多个平台），写入操作使用简短的超时和重试逻辑。

## 相关文档

- [网关内部机制](./gateway-internals.md)
- [上下文压缩与提示缓存](./context-compression-and-caching.md)
