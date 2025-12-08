import {
  VscodeDark,
  WebstormDark,
  Postman,
  Html,
  Css,
  Javascript,
  Typescript,
  Sass,
  LessDark,
  TailwindcssDark,
  VuejsDark,
  ViteDark,
  PiniaDark,
  Electron,
  LinuxDark,
  Nginx,
  NodejsDark,
  MysqlDark,
  PnpmDark,
  ReactDark,
  Git,
  GithubDark,
  GitlabDark,
  Docker,
  JAVA,
  IDEA,
  DataGrip,
  RedisDark,
  RabbitMqDark,
  SpringDark,
  SpringBootDark,
  NpmDark,
  Android,
  MavenDark,
  Star,
  Fork,
  View,
} from "./TechIcons";

export const profile = {
  title: '你好，我是',
  name: 'SeaHi',
  desc: '明心静性，爱自己',
  avatar: '/img/xyy.webp',//头像
  buttons: [
    { text: '联系我', link: 'mailto:your@email.com', type: 'primary' },
    { text: '查看项目', link: '/teek', type: 'default' }
  ],
};

export const majorSkills = [
  {
    name: "后端与数据库",
    percent: 95,
    color: "#f25e62",
    tags: [
      { name: "Java", bg: "#ffeaea", color: "#f25e62" },
      { name: "Spring", bg: "#f3eaff", color: "#88619a" },
      { name: "Maven", bg: "#eaf6ff", color: "#4298b4" },
      { name: "MySQL", bg: "#eafff3", color: "#33a474" },
      { name: "MongoDB", bg: "#eafff3", color: "#33a474" },
      { name: "Oracle", bg: "#fff7ea", color: "#e4ae3a" },
      { name: "Node.js", bg: "#f3ffe9", color: "#96b466" },
    ],
  },
  {
    name: "前端开发",
    percent: 98,
    color: "#33a474",
    tags: [
      { name: "HTML5", bg: "#eaf6ff", color: "#4298b4" },
      { name: "CSS3", bg: "#e3edfa", color: "#3976c6" },
      { name: "Sass", bg: "#ffeaf6", color: "#d72660" },
      { name: "Less", bg: "#f3eaff", color: "#88619a" },
      { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
      { name: "TypeScript", bg: "#e3edfa", color: "#3976c6" },
    ],
  },
  {
    name: "前端框架",
    percent: 95,
    color: "#4298b4",
    tags: [
      { name: "Vue", bg: "#eaf6ff", color: "#4298b4" },
      { name: "React", bg: "#e3edfa", color: "#3976c6" },
      { name: "Angular", bg: "#ffeaea", color: "#f25e62" },
      { name: "Next.js", bg: "#f3ffe9", color: "#96b466" },
    ],
  },
  {
    name: "工程化与工具",
    percent: 93,
    color: "#e4ae3a",
    tags: [
      { name: "Vite", bg: "#fffbe6", color: "#e4ae3a" },
      { name: "Webpack", bg: "#e3edfa", color: "#3976c6" },
      { name: "Git", bg: "#f3eaff", color: "#88619a" },
      { name: "Docker", bg: "#eafff3", color: "#33a474" },
    ],
  },
  {
    name: "运维与Linux",
    percent: 86,
    color: "#96b466",
    tags: [
      { name: "Nginx", bg: "#e3edfa", color: "#3976c6" },
      { name: "HAProxy", bg: "#ffeaea", color: "#f25e62" },
      { name: "Kubernetes", bg: "#eafff3", color: "#33a474" },
      { name: "Wireshark", bg: "#f3eaff", color: "#88619a" },
      { name: "Fail2Ban", bg: "#fffbe6", color: "#e4ae3a" },
    ],
  },
];

export const techStackIcons = [
  // 第一行，首尾空
  {},
  { name: "JAVA", icon: JAVA },
  { name: "IDEA", icon: IDEA },
  { name: "Webstorm", icon: WebstormDark },
  { name: "DataGrip", icon: DataGrip },
  { name: "Spring", icon: SpringDark },
  { name: "SpringBoot", icon: SpringBootDark },
  {},
  // 第二行
  { name: "Mysql", icon: MysqlDark },
  { name: "Redis", icon: RedisDark },
  { name: "RabbitMq", icon: RabbitMqDark },
  { name: "Html", icon: Html },
  { name: "Css", icon: Css },
  { name: "Javascript", icon: Javascript },
  { name: "Typescript", icon: Typescript },
  { name: "VscodeDark", icon: VscodeDark },
  // 第三行
  { name: "Vuejs", icon: VuejsDark },
  { name: "Vite", icon: ViteDark },
  { name: "Pinia", icon: PiniaDark },
  { name: "Linux", icon: LinuxDark },
  { name: "Nginx", icon: Nginx },
  { name: "Nodejs", icon: NodejsDark },
  { name: "ReactDark", icon: ReactDark },
  { name: "Tailwindcss", icon: TailwindcssDark },
  // 第四行，首尾空
  {},
  { name: "Npm", icon: NpmDark },
  { name: "Git", icon: Git },
  { name: "Github", icon: GithubDark },
  { name: "Postman", icon: Postman },
  { name: "Docker", icon: Docker },
  { name: "Maven", icon: MavenDark },
  {},
  // 第五行，缩小行
  {},
  { name: "Android", icon: Android, small: true },
  { name: "Pnpm", icon: PnpmDark, small: true },
  { name: "Electron", icon: Electron, small: true },
  { name: "Sass", icon: Sass, small: true },
  { name: "LessDark", icon: LessDark, small: true },
  { name: "GitlabDark", icon: GitlabDark, small: true },
  {},
];

export const ossProjects = [
  {
    name: "Teek-One",
    desc: "🎉 Teek~一款简约、唯美、丝滑且强大的VitePress主题博客",
    tag: { name: "React", bg: "#e3edfa", color: "#3976c6" },
    projectsimg: "https://img.onedayxyy.cn/images/image-20250502073710566.png",
    Star: '35.0k',
    Fork: '12.6k',
    View: '32.6k',
    github: "https://onedayxyy.cn/teek",
  },
  {
    name: "Typora-One",
    desc: "Teek 是一个轻量、简洁高效、灵活配置、易于扩展的 VitePress 主题 ✨",
    tag: { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
    projectsimg: "https://img.onedayxyy.cn/images/image-20240911120905085.png",
    Star: '96.8k',
    Fork: '46.2k',
    View: '79.3k',
    github: "https://onedayxyy.cn/typora-theme-one",
  },
];

// 导出开源项目图标用于子组件
export { Star, Fork, View };
