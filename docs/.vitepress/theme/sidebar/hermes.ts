import { text } from "mermaid/dist/rendering-util/rendering-elements/shapes/text.js";

export const sidebarHermes = [
	{
		text: "首页",
		collapsed: true, // 是否折叠
		link: "/hermes/home"
	},
	{
		text: "入门",
		collapsed: true, // 是否折叠
		items: [
			{ text: "快速入门", link: "/hermes/getting-started/quickstart", },
			{ text: "安装Hermes", link: "/hermes/getting-started/installation", },
			{ text: "Android/Termux", link: "/hermes/getting-started/termux", },
			{ text: "Nix和NixOS设置", link: " /hermes/getting-started/nix-setup", },
			{ text: "更新与卸载", link: "/hermes/getting-started/updating", },
			{text:"学习路径",link:"/hermes/getting-started/learning-path"},
		],
	},
	{
		text: "使用Hermes",
		collapsed: true, // 是否折叠
		items: [
			{ text: "命令行界面", link: "/hermes/user-guide/cli", },
			{ text: "配置", link: "/hermes/user-guide/configuration", },
			{ text: "会话", link: "/hermes/user-guide/sessions", },
			{ text: "配置文件：运行多个代理", link: "/hermes/user-guide/profiles", },
			{ text: "Git 工作树", link: "/hermes/user-guide/git-worktrees", },
			{ text: "Dorker", link: "/hermes/user-guide/docker", },
			{text:"安全",link:"/hermes/user-guide/security"},
			{text:"检查点和回滚",link:"/hermes/user-guide/checkpoints-and-rollback"},
		],
	},
	{
		text: "功能",
		collapsed: true, // 是否折叠
		items: [
			{ text: "浏览器控制", link: "/hermes/user-guide/features/browser", },
			{ text: "内核", collapsed: true, items:[
				{text:"工具与工具集",link:"/hermes/user-guide/features/tools"},
				{text:"技能系统(skills)",link:"/hermes/user-guide/features/skills"},
				{text:"长记忆",link:"/hermes/user-guide/features/memory"},
				{text:"记忆提供商",link:"/hermes/user-guide/features/memory-providers"},
				{text:"上下文文件",link:"/hermes/user-guide/features/context-files"},
				{text:"上下文引用",link:"/hermes/user-guide/features/context-references"},
				{text:"个性与 SOUL.md",link:"/hermes/user-guide/features/personality"},
				{text:"皮肤和主题",link:"/hermes/user-guide/features/skins"},
				{text:"插件",link:"/hermes/user-guide/features/plugins"},
			] },
			{ text: "自动化", collapsed: true, items:[
				{text:"定时任务(Cron)",link:"/hermes/user-guide/features/cron"},
				{text:"子代理委托",link:"/hermes/user-guide/features/delegation"},
				{text:"代码执行",link:"/hermes/user-guide/features/code-execution"},
				{text:"事件钩子",link:"/hermes/user-guide/features/hooks"},
				{text:"批处理",link:"/hermes/user-guide/features/batch-processing"},
			] },
			{ text: "媒体和网络", collapsed: true, items:[
				{text:"语音模式",link:"/hermes/user-guide/features/voice-mode"},
				{text:"浏览器",link:"/hermes/user-guide/features/browser"},
				{text:"视觉与图像粘贴",link:"/hermes/user-guide/features/vision"},
				{text:"图像生成",link:"/hermes/user-guide/features/image-generation"},
				{text:"语音和TTS",link:"/hermes/user-guide/features/tts"},
			] },
			{ text: "管理", collapsed: true, items:[
				{text:"Web仪表盘",link:"/hermes/user-guide/features/web-dashboard"},
			] },
			{text:"高级用法",collapsed: true, items:[
				{text:"强化学习训练",link:"/hermes/user-guide/features/rl-training"},
			]},
			{text:"技能",collapsed: true, items:[
				{text:"Godmode(上帝模式)",link:"/hermes/user-guide/godmode"},
				{text:"Google Workspace",link:"/hermes/user-guide/skills/google-workspace"},
			]},
		],
	},
	{
		text: "通讯平台",
		collapsed: true, // 是否折叠
		items: [
			{text:"消息网关",link:"/hermes/user-guide/messaging/index"},
			{text:"Telegram",link:"/hermes/user-guide/messaging/telegram"},
			{text:"Discord",link:"/hermes/user-guide/messaging/discord"},
			{text:"Slack",link:"/hermes/user-guide/messaging/slack"},
			{text:"WhatsApp",link:"/hermes/user-guide/messaging/whatsapp"},
			{text:"Signal",link:"/hermes/user-guide/messaging/signal"},
			{text:"Email(邮箱)",link:"/hermes/user-guide/messaging/email"},
			{text:"SMS(Twilio)",link:"/hermes/user-guide/messaging/sms"},
			{text:"HomeAssistant",link:"/hermes/user-guide/messaging/homeassistant"},
			{text:"Mattermost",link:"/hermes/user-guide/messaging/mattermost"},
			{text:"Matrix",link:"/hermes/user-guide/messaging/matrix"},
			{text:"钉钉",link:"/hermes/user-guide/messaging/dingtalk"},
			{text:"飞书/云雀",link:"/hermes/user-guide/messaging/feishu"},
			{text:"企业微信",link:"/hermes/user-guide/messaging/wecom"},
			{text:"企业微信自建应用",link:"/hermes/user-guide/messaging/wecom-callback"},
			{text:"微信(个人)",link:"/hermes/user-guide/messaging/weixin"},
			{text:"BlueBubbles(iMessage)",link:"/hermes/user-guide/messaging/bluebubbles"},
			{text:"Open WebUI",link:"/hermes/user-guide/messaging/open-webui"},
			{text:"Webhooks(网络钩子)",link:"/hermes/user-guide/messaging/webhooks"},
		],
	},
	{
		text: "集成",
		collapsed: true, // 是否折叠
		items: [
			{text:"概述",link:"/hermes/integrations/index"},
			{text:"AI 模型",link:"/hermes/integrations/providers"},
			{text:"MCP(上下文协议)",link:"/hermes/user-guide/features/mcp"},
			{text:"ACP 编辑器",link:"/hermes/user-guide/features/acp"},
			{text:"API 服务器",link:"/hermes/user-guide/features/api-server"},
			{text:"主控记忆系统",link:"/hermes/user-guide/features/honcho"},
			{text:"提供商路由",link:"/hermes/user-guide/features/provider-routing"},
		],
	},
	{
		text: "教程和指南",
		collapsed: true, // 是否折叠
		items: [
			{text:"技巧与最佳实践",link:"/hermes/guides/tips"},
			{text:"在 Mac 上运行本地 LLM",link:"/hermes/guides/local-llm-on-mac"},
			{text:"教程：每日简报机器人",link:"/hermes/guides/daily-briefing-bot"},
			{text:"教程：Telegram 软对助手",link:"/hermes/guides/team-telegram-assistant"},
			{text:"使用 Hermes 作为 Python 库",link:"/hermes/guides/python-library"},
			{text:"将 MCP 与 Hermes 结合使用",link:"/hermes/guides/use-mcp-with-hermes"},
			{text:"将 SOUL.md 与 Hermes 配合使用",link:"/hermes/guides/use-soul-with-hermes"},
			{text:"使用 Hermes 的语音模式",link:"/hermes/guides/use-voice-mode-with-hermes"},
			{text:"构建 Hermes 插件",link:"/hermes/guides/build-a-hermes-plugin"},
			{text:"使用 Cron 实现一切自动化",link:"/hermes/guides/automate-with-cron"},
			{text:"Cron故障排除",link:"/hermes/guides/cron-troubleshooting"},
			{text:"运用技能",link:"/hermes/guides/work-with-skills"},
			{text:"授权与并行工作",link:"/hermes/guides/delegation-patterns"},
			{text:"从 OpenClaw 迁移",link:"/hermes/guides/migrate-from-openclaw"},

		],
	},
	{
		text: "开发者指南",
		collapsed: true,
		items: [
			{ text: "贡献指南", link: "/hermes/developer-guide/contributing" },
			{
				text: "系统架构",
				collapsed: true,
				items: [
					{ text: "架构总览", link: "/hermes/developer-guide/architecture" },
					{ text: "Agent (智能体)循环机制", link: "/hermes/developer-guide/agent-loop" },
					{ text: "提示词组装", link: "/hermes/developer-guide/prompt-assembly" },
					{ text: "上下文压缩与缓存", link: "/hermes/developer-guide/context-compression-and-caching" },
					{ text: "网关内部机制", link: "/hermes/developer-guide/gateway-internals" },
					{ text: "会话存储", link: "/hermes/developer-guide/session-storage" },
					{ text: "提供商运行时解析", link: "/hermes/developer-guide/provider-runtime" },
				]
			},
			{
				text: "扩展开发",
				collapsed: true,
				items: [
					{ text: "扩展命令行界面", link: "/hermes/developer-guide/extending-the-cli" },
					{ text: "添加工具", link: "/hermes/developer-guide/adding-tools" },
					{ text: "添加模型提供商", link: "/hermes/developer-guide/adding-providers" },
					{ text: "添加平台适配器", link: "/hermes/developer-guide/adding-platform-adapters" },
					{ text: "创建技能", link: "/hermes/developer-guide/creating-skills" },
				]
			},
			{
				text: "内部实现",
				collapsed: true,
				items: [
					{ text: "ACP 内部实现", link: "/hermes/developer-guide/acp-internals" },
					{ text: "Cron 内部实现", link: "/hermes/developer-guide/cron-internals" },
					{ text: "工具运行时", link: "/hermes/developer-guide/tools-runtime" },
					{ text: "上下文引擎插件", link: "/hermes/developer-guide/context-engine-plugin" },
					{ text: "记忆提供商插件", link: "/hermes/developer-guide/memory-provider-plugin" },
					{ text: "轨迹格式", link: "/hermes/developer-guide/trajectory-format" },
					{ text: "环境配置", link: "/hermes/developer-guide/environments" },
				]
			},
		]
	},
	{
		text: "参考",
		collapsed: true,
		items: [
			{ text: "CLI 命令参考", link: "/hermes/reference/cli-commands" },
			{ text: "斜杠命令参考", link: "/hermes/reference/slash-commands" },
			{ text: "配置文件命令参考", link: "/hermes/reference/profile-commands" },
			{ text: "环境变量", link: "/hermes/reference/environment-variables" },
			{ text: "内置工具参考", link: "/hermes/reference/tools-reference" },
			{ text: "工具集参考", link: "/hermes/reference/toolsets-reference" },
			{ text: "MCP 配置参考", link: "/hermes/reference/mcp-config-reference" },
			{ text: "内置技能目录", link: "/hermes/reference/skills-catalog" },
			{ text: "可选技能目录", link: "/hermes/reference/optional-skills-catalog" },
			{ text: "常见问题与故障排除", link: "/hermes/reference/faq" },
		]
	},
];
