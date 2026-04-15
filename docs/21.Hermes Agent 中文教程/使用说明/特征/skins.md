---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 皮肤与主题
description: 使用内置和用户定义的皮肤自定义 Hermes CLI
permalink: /hermes/user-guide/features/skins
---

# 皮肤与主题

皮肤控制 **Hermes CLI 的视觉呈现**：横幅颜色、旋转器面孔和动词、响应框标签、品牌文本和工具活动前缀。

会话风格和视觉风格是分开的概念：

- **个性**改变 Agent 的语气和措辞。
- **皮肤**改变 CLI 的外观。

## 更改皮肤

```bash
/skin                # 显示当前皮肤并列出可用皮肤
/skin ares           # 切换到内置皮肤
/skin mytheme        # 切换到 ~/.hermes/skins/mytheme.yaml 中的自定义皮肤
```

或在 `~/.hermes/config.yaml` 中设置默认皮肤：

```yaml
display:
  skin: default
```

## 内置皮肤

| 皮肤 | 描述 | Agent 品牌 | 视觉特征 |
|------|-------------|----------------|------------------|
| `default` | 经典 Hermes —— 金色和可爱 | `Hermes Agent` | 温暖的金色边框，玉米丝色文本，旋转器中的可爱面孔。熟悉的双蛇杖横幅。干净且吸引人。|
| `ares` | 战神主题 —— 深红和青铜 | `Ares Agent` | 深红色边框配青铜点缀。激进的旋转器动词（"锻造"、"行军"、"回火"）。自定义剑盾 ASCII 艺术横幅。|
| `mono` | 单色 —— 干净的灰度 | `Hermes Agent` | 全灰色 —— 无颜色。边框是 `#555555`，文本是 `#c9d1d9`。非常适合最小终端设置或屏幕录制。|
| `slate` | 冷蓝色 —— 开发者专注 | `Hermes Agent` | 皇家蓝边框（`#4169e1`），柔和的蓝色文本。平静而专业。无自定义旋转器 —— 使用默认面孔。|
| `poseidon` | 海洋之神主题 —— 深蓝和海沫 | `Poseidon Agent` | 深蓝到海沫渐变。海洋主题旋转器（"绘制海流"、"探测深度"）。三叉戟 ASCII 艺术横幅。|
| `sisyphus` | 西西弗斯主题 —— 严肃的灰度和坚持 | `Sisyphus Agent` | 浅灰色和鲜明对比。巨石主题旋转器（"推上坡"、"重置巨石"、"忍受循环"）。巨石和山 ASCII 艺术横幅。|
| `charizard` | 火山主题 —— 焦橙色和余烬 | `Charizard Agent` | 温暖的焦橙色到余烬渐变。火焰主题旋转器（"倾斜入气流"、"测量燃烧"）。龙轮廓 ASCII 艺术横幅。|

## 可配置键的完整列表

### 颜色 (`colors:`)

控制整个 CLI 中的所有颜色值。值是十六进制颜色字符串。

| 键 | 描述 | 默认（`default` 皮肤）|
|-----|-------------|--------------------------|
| `banner_border` | 启动横幅周围的面板边框 | `#CD7F32` (青铜色) |
| `banner_title` | 横幅中的标题文本颜色 | `#FFD700` (金色) |
| `banner_accent` | 横幅中的部分标题（可用工具等）| `#FFBF00` (琥珀色) |
| `banner_dim` | 横幅中的柔和文本（分隔符、次要标签）| `#B8860B` (深金黄色) |
| `banner_text` | 横幅中的正文文本（工具名称、技能名称）| `#FFF8DC` (玉米丝色) |
| `ui_accent` | 通用 UI 强调色（高亮、活动元素）| `#FFBF00` |
| `ui_label` | UI 标签和标签 | `#4dd0e1` (青色) |
| `ui_ok` | 成功指示器（对勾、完成）| `#4caf50` (绿色) |
| `ui_error` | 错误指示器（失败、阻止）| `#ef5350` (红色) |
| `ui_warn` | 警告指示器（注意、审批提示）| `#ffa726` (橙色) |
| `prompt` | 交互式提示文本颜色 | `#FFF8DC` |
| `input_rule` | 输入区域上方的水平线 | `#CD7F32` |
| `response_border` | Agent 响应框周围的边框（ANSI 转义）| `#FFD700` |
| `session_label` | 会话标签颜色 | `#DAA520` |
| `session_border` | 会话 ID 柔和边框颜色 | `#8B8682` |

### 旋转器 (`spinner:`)

控制等待 API 响应时显示的动画旋转器。

| 键 | 类型 | 描述 | 示例 |
|-----|------|-------------|---------|
| `waiting_faces` | 字符串列表 | 等待 API 响应时循环的面孔 | `["(⚔)", "(⛨)", "(▲)"]` |
| `thinking_faces` | 字符串列表 | 模型推理期间循环的面孔 | `["(⚔)", "(⌁)", "(<>)"]` |
| `thinking_verbs` | 字符串列表 | 旋转器消息中显示的动词 | `["锻造", "策划", "锤炼计划"]` |
| `wings` | [左, 右] 对列表 | 旋转器周围的装饰括号 | `[["⟪⚔", "⚔⟫"], ["⟪▲", "▲⟫"]]` |

当旋转器值为空时（如 `default` 和 `mono`），使用 `display.py` 中的硬编码默认值。

### 品牌 (`branding:`)

整个 CLI 界面中使用的文本字符串。

| 键 | 描述 | 默认 |
|-----|-------------|---------|
| `agent_name` | 横幅标题和状态显示中显示的名称 | `Hermes Agent` |
| `welcome` | CLI 启动时显示的欢迎消息 | `Welcome to Hermes Agent! Type your message or /help for commands.` |
| `goodbye` | 退出时显示的消息 | `Goodbye! ⚕` |
| `response_label` | 响应框标题上的标签 | ` ⚕ Hermes ` |
| `prompt_symbol` | 用户输入提示前的符号 | `❯ ` |
| `help_header` | `/help` 命令输出的标题文本 | `(^_^)? Available Commands` |

### 其他顶级键

| 键 | 类型 | 描述 | 默认 |
|-----|------|-------------|---------|
| `tool_prefix` | 字符串 | CLI 中工具输出行前缀的字符 | `┊` |
| `tool_emojis` | 字典 | 旋转器和进度的每工具表情符号覆盖（`{tool_name: emoji}`）| `{}` |
| `banner_logo` | 字符串 | Rich 标记 ASCII 艺术标志（替换默认 HERMES_AGENT 横幅）| `""` |
| `banner_hero` | 字符串 | Rich 标记主图艺术（替换默认双蛇杖艺术）| `""` |

## 自定义皮肤

在 `~/.hermes/skins/` 下创建 YAML 文件。用户皮肤从内置 `default` 皮肤继承缺失值，因此您只需要指定要更改的键。

### 完整自定义皮肤 YAML 模板

```yaml
# ~/.hermes/skins/mytheme.yaml
# 完整皮肤模板 —— 显示所有键。删除任何您不需要的；
# 缺失值自动从 'default' 皮肤继承。

name: mytheme
description: My custom theme

colors:
  banner_border: "#CD7F32"
  banner_title: "#FFD700"
  banner_accent: "#FFBF00"
  banner_dim: "#B8860B"
  banner_text: "#FFF8DC"
  ui_accent: "#FFBF00"
  ui_label: "#4dd0e1"
  ui_ok: "#4caf50"
  ui_error: "#ef5350"
  ui_warn: "#ffa726"
  prompt: "#FFF8DC"
  input_rule: "#CD7F32"
  response_border: "#FFD700"
  session_label: "#DAA520"
  session_border: "#8B8682"

spinner:
  waiting_faces:
    - "(⚔)"
    - "(⛨)"
    - "(▲)"
  thinking_faces:
    - "(⚔)"
    - "(⌁)"
    - "(<>)"
  thinking_verbs:
    - "处理中"
    - "分析中"
    - "计算中"
    - "评估中"
  wings:
    - ["⟪⚡", "⚡⟫"]
    - ["⟪●", "●⟫"]

branding:
  agent_name: "My Agent"
  welcome: "Welcome to My Agent! Type your message or /help for commands."
  goodbye: "See you later! ⚡"
  response_label: " ⚡ My Agent "
  prompt_symbol: "⚡ ❯ "
  help_header: "(⚡) Available Commands"

tool_prefix: "┊"

# 每工具表情符号覆盖（可选）
tool_emojis:
  terminal: "⚔"
  web_search: "🔮"
  read_file: "📄"

# 自定义 ASCII 艺术横幅（可选，支持 Rich 标记）
# banner_logo: |
#   [bold #FFD700] MY AGENT [/]
# banner_hero: |
#   [#FFD700]  Custom art here  [/]
```

### 最小自定义皮肤示例

由于所有内容都从 `default` 继承，最小皮肤只需要更改不同的内容：

```yaml
name: cyberpunk
description: Neon terminal theme

colors:
  banner_border: "#FF00FF"
  banner_title: "#00FFFF"
  banner_accent: "#FF1493"

spinner:
  thinking_verbs: ["接入中", "解密中", "上传中"]
  wings:
    - ["⟨⚡", "⚡⟩"]

branding:
  agent_name: "Cyber Agent"
  response_label: " ⚡ Cyber "

tool_prefix: "▏"
```

## Hermes Mod —— 视觉皮肤编辑器

[Hermes Mod](https://github.com/cocktailpeanut/hermes-mod) 是一个社区构建的 Web UI，用于可视化创建和管理皮肤。您可以获得一个点击编辑器，带有实时预览，而不是手动编写 YAML。

![Hermes Mod skin editor](https://raw.githubusercontent.com/cocktailpeanut/hermes-mod/master/nous.png)

**功能：**

- 列出所有内置和自定义皮肤
- 将所有 Hermes 皮肤字段（颜色、旋转器、品牌、工具前缀、工具表情符号）打开到可视化编辑器中
- 从文本提示生成 `banner_logo` 文本艺术
- 将上传的图像（PNG、JPG、GIF、WEBP）转换为 `banner_hero` ASCII 艺术，具有多种渲染风格（盲文、ASCII 斜坡、块、点）
- 直接保存到 `~/.hermes/skins/`
- 通过更新 `~/.hermes/config.yaml` 激活皮肤
- 显示生成的 YAML 和实时预览

### 安装

**选项 1 —— Pinokio（一键）：**

在 [pinokio.computer](https://pinokio.computer) 上找到它并一键安装。

**选项 2 —— npx（从终端最快）：**

```bash
npx -y hermes-mod
```

**选项 3 —— 手动：**

```bash
git clone https://github.com/cocktailpeanut/hermes-mod.git
cd hermes-mod/app
npm install
npm start
```

### 使用

1. 启动应用（通过 Pinokio 或终端）。
2. 打开 **皮肤工作室**。
3. 选择要编辑的内置或自定义皮肤。
4. 从文本生成标志和/或上传图像作为主图艺术。选择渲染样式和宽度。
5. 编辑颜色、旋转器、品牌和其他字段。
6. 点击 **保存** 将皮肤 YAML 写入 `~/.hermes/skins/`。
7. 点击 **激活** 将其设置为当前皮肤（更新 `config.yaml` 中的 `display.skin`）。

Hermes Mod 尊重 `HERMES_HOME` 环境变量，因此它也适用于[配置文件](/docs/user-guide/profiles)。

## 操作说明

- 内置皮肤从 `hermes_cli/skin_engine.py` 加载。
- 未知皮肤自动回退到 `default`。
- `/skin` 立即为当前会话更新活动 CLI 主题。
- `~/.hermes/skins/` 中的用户皮肤优先于同名内置皮肤。
- 通过 `/skin` 的皮肤更改仅会话有效。要将皮肤设为永久默认，请在 `config.yaml` 中设置。
- `banner_logo` 和 `banner_hero` 字段支持 Rich 控制台标记（例如 `[bold #FF0000]text[/]`）用于彩色 ASCII 艺术。
