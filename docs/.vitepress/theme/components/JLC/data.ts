import {
  View,
  good,
  Mark,
  Comment,
} from "./TechIcons";

export const ossProjects = [
  {
    name: "BrunTools（WiFi模组烧录架）",
    desc: "这是一款专门为 WiFi 模组提供免焊接烧录的烧录架，可以把模组安装在烧录架上，然后使用串口进行固件烧录。",
    tag: { name: "React", bg: "#e3edfa", color: "#3976c6" },
    projectsimg: "https://image.lceda.cn/oshwhub/pullImage/0c535ac8ec214c039ebeb62b70983eb5.png",
    View: '32.6k',
    good: '7',
    Mark: '10',
    Comment: '5',
    projectLink: "https://oshwhub.com/seahi/bruntools",
    //使用说明连接
    usageLink:"https://oshwhub.com/seahi/bruntools",
  },
  {
    name: "HomeAssistant 智能红外遥控器",
    desc: "适用于HomeAssistant 的空调红外遥控器，采用WiFi通讯，支持市面上98%的空调控制，支持一键匹配空调码。支持外接I2C传感器！",
    tag: { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
    projectsimg: "https://image.lceda.cn/oshwhub/55aa204882094732a033b10a1e47efeb.png",
    View: '96.8k',
    good: '7',
    Mark: '10',
    Comment: '5',

    projectLink: "https://oshwhub.com/seahi/homeassistant-intelligent-air-re",
    usageLink: "https://oshwhub.com/seahi/homeassistant-intelligent-air-re",
  },
 ];

// 导出开源项目图标用于子组件
export { View, good, Mark, Comment };
