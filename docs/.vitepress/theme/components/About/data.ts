import {
  VscodeDark,
  LinuxDark,
  Git,
  GithubDark,
  Star,
  Fork,
  View,
  JLCEDA,
  STM32Cube,
  Arduino,
  Ubuntu,
  MarkDown,
  MQTT,
  BLE,
  WiFi,
  c,
  LoRa,
  tcpip,
  cloudflare,
  HomeAssistant,
} from "./TechIcons";

export const profile = {
  title: '你好，我是',
  name: 'SeaHi',
  desc: '言念君子，温其如玉',
  avatar: '/Seahi-Logo.png',//头像
  buttons: [
    { text: '联系我', link: 'mailto:Seahi-Mo@foxmail.com', type: 'primary' },
    { text: '查看项目', link: '/teek', type: 'default' }
  ],
};

export const majorSkills = [
  {
    name: "电子DIY",
    percent: 95,
    color: "#f25e62",
    tags: [
      { name: "立创EDA", bg: "#ffeaea", color: "#f25e62" },
      { name: "原理图设计", bg: "#f3eaff", color: "#88619a" },
      { name: "PCB绘制", bg: "#eaf6ff", color: "#4298b4" },
      { name: "3D外壳设计", bg: "#eafff3", color: "#33a474" },
      { name: "KeyShot", bg: "#eafff3", color: "#33a474" },
      { name: "焊武小帝", bg: "#fff7ea", color: "#e4ae3a" },
      // { name: "Node.js", bg: "#f3ffe9", color: "#96b466" },
    ],
  },
  {
    name: "单片机开发",
    percent: 98,
    color: "#33a474",
    tags: [
      { name: "STC51/Ai8051", bg: "#eaf6ff", color: "#4298b4" },
      { name: "STM32", bg: "#e3edfa", color: "#3976c6" },
      { name: "Arduino", bg: "#ffeaf6", color: "#d72660" },
      { name: "GD32", bg: "#f3eaff", color: "#88619a" },
      // { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
      // { name: "TypeScript", bg: "#e3edfa", color: "#3976c6" },
    ],
  },
  {
    name: "网络协议",
    percent: 95,
    color: "#4298b4",
    tags: [
      { name: "TCP/UDP", bg: "#eaf6ff", color: "#4298b4" },
      { name: "HTTP/S", bg: "#e3edfa", color: "#3976c6" },
      { name: "MQTT", bg: "#ffeaea", color: "#f25e62" },
      { name: "WebSocket", bg: "#f3ffe9", color: "#96b466" },
    ],
  },
  {
    name: "无线模块",
    percent: 93,
    color: "#e4ae3a",
    tags: [
      { name: "ESP8266", bg: "#fffbe6", color: "#e4ae3a" },
      { name: "ESP32", bg: "#e3edfa", color: "#3976c6" },
      { name: "BL602", bg: "#f3eaff", color: "#88619a" },
      { name: "BL616/618", bg: "#eafff3", color: "#33a474" },
      { name: "RTL8720/8711", bg: "#eafff3", color: "#33a474" },
    ],
    
  },
  {
    name: "其他技能",
    percent: 97,
    color: "#33a474",
    tags: [
      { name: "I2C", bg: "#eaf6ff", color: "#4298b4" },
      { name: "SPI", bg: "#e3edfa", color: "#3976c6" },
      { name: "WS2812", bg: "#ffeaf6", color: "#d72660" },
      { name: "OLED", bg: "#f3eaff", color: "#88619a" },
      { name: "TFT 彩屏", bg: "#fffbe6", color: "#e4ae3a" },
      { name: "HomeAssistant", bg: "#e3edfa", color: "#3976c6" },
      { name: "MarkDown", bg: "#f3eaff", color: "#88619a" },
      { name: "电路图渲染", bg: "#fffbe6", color: "#e4ae3a" },
      { name: "项目管理", bg: "#ffeaf6", color: "#d72660" },
    ],
  },
];

export const techStackIcons = [
  // 第一行，首尾空
  {},
  { name: "VSCode", icon: VscodeDark },
  { name: "立创EDA", icon: JLCEDA },
  { name: "Arduino", icon: Arduino },
  { name: "STM32CudeMX", icon: STM32Cube },
  { name: "C语言", icon: c },
  { name: "MarkDown", icon: MarkDown },
  {},
  // 第二行
  
  { name: "WiFi", icon: WiFi },
  { name: "BLE", icon: BLE },
  { name: "MQTT", icon: MQTT },
  { name: "LoRa", icon: LoRa },
  { name: "TCP/IP", icon: tcpip },
  { name: "HomeAssistant", icon: HomeAssistant },
  // 第三行
 
  { name: "Linux", icon: LinuxDark },
  { name: "Ubuntu", icon: Ubuntu },
  { name: "Cloudflare", icon: cloudflare },
  // 第四行，首尾空
  {},

  { name: "Git", icon: Git },
  { name: "Github", icon: GithubDark },

  {},
  // 第五行，缩小行
  {},

  {},
];

export const ossProjects = [
  // {
  //   name: "Teek-One",
  //   desc: "🎉 Teek~一款简约、唯美、丝滑且强大的VitePress主题博客",
  //   tag: { name: "React", bg: "#e3edfa", color: "#3976c6" },
  //   projectsimg: "https://img.onedayxyy.cn/images/image-20250502073710566.png",
  //   Star: '35.0k',
  //   Fork: '12.6k',
  //   View: '32.6k',
  //   github: "https://onedayxyy.cn/teek",
  // },
  // {
  //   name: "Typora-One",
  //   desc: "Teek 是一个轻量、简洁高效、灵活配置、易于扩展的 VitePress 主题 ✨",
  //   tag: { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
  //   projectsimg: "https://img.onedayxyy.cn/images/image-20240911120905085.png",
  //   Star: '96.8k',
  //   Fork: '46.2k',
  //   View: '79.3k',
  //   github: "https://onedayxyy.cn/typora-theme-one",
  // },
 ];

// 导出开源项目图标用于子组件
export { Star, Fork, View };
