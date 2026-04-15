---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 图像生成
description: 使用 FAL.ai 的 FLUX 2 Pro 和通过 Clarity Upscaler 的自动放大功能生成高质量图像。
sidebar_label: 图像生成
permalink: /hermes/user-guide/features/image-generation
---

# 图像生成

Hermes Agent 可以使用 FAL.ai 的 **FLUX 2 Pro** 模型从文本提示生成图像，并通过 **Clarity Upscaler** 自动进行 2 倍放大以增强质量。

## 设置

### 获取 FAL API 密钥

1. 在 [fal.ai](https://fal.ai/) 注册
2. 从您的仪表板生成 API 密钥

### 配置密钥

```bash
# 添加到 ~/.hermes/.env
FAL_KEY=your-fal-api-key-here
```

### 安装客户端库

```bash
pip install fal-client
```

:::info
当设置了 `FAL_KEY` 时，图像生成工具自动可用。无需额外的工具集配置。
:::
## 工作原理

当您要求 Hermes 生成图像时：

1. **生成** —— 您的提示被发送到 FLUX 2 Pro 模型 (`fal-ai/flux-2-pro`)
2. **放大** —— 生成的图像使用 Clarity Upscaler (`fal-ai/clarity-upscaler`) 自动放大 2 倍
3. **交付** —— 返回放大后的图像 URL

如果放大因任何原因失败，将返回原始图像作为回退。

## 用法

只需让 Hermes 创建图像：

```
生成一张宁静的山景图，有樱花盛开
```

```
创建一只智慧的老猫头鹰栖息在古老树枝上的肖像
```

```
为我制作一个未来主义的城市景观，有飞行汽车和霓虹灯
```

## 参数

`image_generate_tool` 接受这些参数：

| 参数 | 默认值 | 范围 | 描述 |
|-----------|---------|-------|-------------|
| `prompt` | *(必需)* | — | 所需图像的文本描述 |
| `aspect_ratio` | `"landscape"` | `landscape`, `square`, `portrait` | 图像宽高比 |
| `num_inference_steps` | `50` | 1–100 | 去噪步数（越多 = 质量越高，越慢）|
| `guidance_scale` | `4.5` | 0.1–20.0 | 遵循提示的紧密程度 |
| `num_images` | `1` | 1–4 | 要生成的图像数量 |
| `output_format` | `"png"` | `png`, `jpeg` | 图像文件格式 |
| `seed` | *(随机)* | 任意整数 | 用于可复现结果的随机种子 |

## 宽高比

该工具使用简化的宽高比名称映射到 FLUX 2 Pro 图像尺寸：

| 宽高比 | 映射到 | 最适合 |
|-------------|---------|----------|
| `landscape` | `landscape_16_9` | 壁纸、横幅、场景 |
| `square` | `square_hd` | 头像、社交媒体帖子 |
| `portrait` | `portrait_16_9` | 角色艺术、手机壁纸 |

:::tip
您也可以直接使用原始 FLUX 2 Pro 尺寸预设：`square_hd`、`square`、`portrait_4_3`、`portrait_16_9`、`landscape_4_3`、`landscape_16_9`。还支持最大 2048x2048 的自定义尺寸。
:::
## 自动放大

每个生成的图像都使用 FAL.ai 的 Clarity Upscaler 自动放大 2 倍，使用这些设置：

| 设置 | 值 |
|---------|-------|
| 放大因子 | 2x |
| 创意度 | 0.35 |
| 相似度 | 0.6 |
| 引导比例 | 4 |
| 推理步数 | 18 |
| 正向提示 | `"masterpiece, best quality, highres"` + 您的原始提示 |
| 负向提示 | `"(worst quality, low quality, normal quality:2)"` |

放大器增强细节和分辨率，同时保留原始构图。如果放大器失败（网络问题、速率限制），将自动返回原始分辨率图像。

## 示例提示

以下是一些可以尝试的有效提示：

```
一张粉色波波头和粗眼线的女性的街头抓拍照片
```

```
现代建筑玻璃幕墙，日落光线
```

```
抽象艺术，充满活力的色彩和几何图案
```

```
一只智慧的老猫头鹰栖息在古老树枝上的肖像
```

```
未来主义城市景观，有飞行汽车和霓虹灯
```

## 调试

启用图像生成的调试日志：

```bash
export IMAGE_TOOLS_DEBUG=true
```

调试日志保存到 `./logs/image_tools_debug_<session_id>.json`，包含每次生成请求的详细信息、参数、时间和任何错误。

## 安全设置

图像生成工具默认运行并禁用安全检查（`safety_tolerance: 5`，最宽松的设置）。这在代码级别配置，用户不可调整。

## 平台交付

生成的图像根据平台不同方式交付：

| 平台 | 交付方式 |
|----------|----------------|
| **CLI** | 图像 URL 以 markdown `![description](url)` 打印 —— 点击在浏览器中打开 |
| **Telegram** | 图像作为照片消息发送，提示作为标题 |
| **Discord** | 图像嵌入在消息中 |
| **Slack** | 消息中的图像 URL（Slack 会展开它）|
| **WhatsApp** | 图像作为媒体消息发送 |
| **其他平台** | 纯文本中的图像 URL |

Agent 在其响应中使用 `MEDIA:<url>` 语法，平台适配器将其转换为适当的格式。

## 限制

- **需要 FAL API 密钥** —— 图像生成会在您的 FAL.ai 账户上产生 API 费用
- **无图像编辑** —— 这仅是文本到图像，没有修复或 img2img
- **基于 URL 的交付** —— 图像作为临时 FAL.ai URL 返回，而非本地保存。URL 在一段时间后过期（通常为数小时）
- **放大增加延迟** —— 自动 2 倍放大步骤增加处理时间
- **每次请求最多 4 张图像** —— `num_images` 上限为 4
