import { text } from "mermaid/dist/rendering-util/rendering-elements/shapes/text.js";

export const sidebarUser = [
	{
		text: "WiFi模组烧录架",
		collapsed: true, // 是否折叠
		items: [
			{ text: "首页", link: "/user/bruntools", },
			{ text: "快速使用", link:"/user/bruntools/get-start"},
			{ text: "驱动安装", link:"/user/bruntools/driver"}
		],
	},
	{
		text: "STLink343 调试器",
		collapsed: true, // 是否折叠
		items: [
			{ text: "首页", link: "/user/minijlink", },

		],
	},
];
