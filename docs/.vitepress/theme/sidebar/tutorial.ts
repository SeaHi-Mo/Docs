import { text } from "mermaid/dist/rendering-util/rendering-elements/shapes/text.js";

export const sidebarTutorial = [

	{
		text: "Linux 开发环境搭建",
		collapsed: true, // 是否折叠
		items: [
			{ text: "快捷导航", link: "/tutorial/Linux/home", },
			{ text: "安装 VM 虚拟机", link: "/tutorial/Linux/vm_install", },
			{ text: "安装 WSL", link: "/tutorial/Linux/wsl_install", },
			{ text: "安装 Ubuntu 系统", link: "/tutorial/Linux/ubuntu_install", },
			{ text: "安装 VSCode", link: "/tutorial/Linux/VScode_install", },
		],
	},
	{
		text: "涂鸦入门教程",
		collapsed: true, // 是否折叠
		items: [
			{ text: "简介", link: "/tutorial/tuya/home", },
			{ text: "学习线路", link: '/tutorial/tuya/route' },
			{ text: "第一步:认识 T2-U 开发板", link: "/tutorial/tuya/t2board" },
			{ text: "第二步:搭建开发环境", link: "/tutorial/tuya/osinstall" },
			{ text: "第三步:输出 Hello, Tuya!", link: "/tutorial/tuya/oneapp" },
			{ text: "第四步:点亮一盏LED灯", link: "/tutorial/tuya/led" },
			// { text: "第五步:连接WiFi", link: "/tutorial/tuya/wifi" },
			// { text: "第六步:连接 Tuya 平台", link: "/tutorial/tuya/connect" },
		],
	},
];
