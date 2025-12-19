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
  {
    name: "功耗只有16uA的WiFi温湿度计",
    desc: "这是一个低功耗的传感器采集板，采用安信可Ai-M62-CBS模块，以一小时作为周期进行采集，功耗只有16uA左右",
    tag: { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
    projectsimg: "https://image.lceda.cn/oshwhub/35b00add63cb45b49e7b9ec552f36e8d.jpg",
    View: '2.7k',
    good: '4',
    Mark: '32',
    Comment: '4',

    projectLink: "https://oshwhub.com/seahi/ha-sensorget",
    usageLink: "https://oshwhub.com/seahi/ha-sensorget",
  },

  {
    name: "HomeAssistant WiFi通断器",
    desc: "带有带防雷电路的 HomeAssistant 的WiFi通断器，最高能控4000W电器的供电。",
    tag: { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
    projectsimg: "https://image.lceda.cn/oshwhub/e09430f657ab445087a9f55a18dd3a19.png",
    View: '5.4k',
    good: '28',
    Mark: '77',
    Comment: '32',

    projectLink: "https://oshwhub.com/seahi/homeassistant-tong-duan-qi",
    usageLink: "https://oshwhub.com/seahi/homeassistant-tong-duan-qi",
  },
  {
    name: "HomeAssistantUSB小夜灯控制器",
    desc: "WiFi MQTT直连HomeAssistant 的USB小夜灯控制器",
    tag: { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
    projectsimg: "https://image.lceda.cn/oshwhub/ee98381827994809a135d7ad172c0fc8.png",
    View: '3.2k',
    good: '10',
    Mark: '25',
    Comment: '17',

    projectLink: "https://oshwhub.com/seahi/ha-usb-kai-guan",
    usageLink: "https://oshwhub.com/seahi/ha-usb-kai-guan",
  },
  {
    name: "HomeAssistant智能家居红外遥控器——丐版",
    desc: "接入HomeAssitant 的智能红外遥控器，可实现远程控制家里的空调。",
    tag: { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
    projectsimg: "https://image.lceda.cn/oshwhub/0f9c0e99ef914dcbaadbe415c1b0bb33.png",
    View: '5.1k',
    good: '19',
    Mark: '54',
    Comment: '10',

    projectLink: "https://oshwhub.com/seahi/homeassistant-smart-home-infrared-remote-control",
    usageLink: "https://oshwhub.com/seahi/homeassistant-smart-home-infrared-remote-control",
  },
 ];

// 导出开源项目图标用于子组件
export { View, good, Mark, Comment };
