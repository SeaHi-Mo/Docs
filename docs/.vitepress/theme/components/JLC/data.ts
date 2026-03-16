import {
  View,
  good,
  Mark,
  Comment,
} from "./TechIcons";
import { ref } from 'vue';

function formatNumber(num: number): string {
  
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if(num >=1000){
     return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

async function fetchProjectData(uid: string) {
  try {
    const response = await fetch(`https://oshwhub.com/api/project/${uid}`, {
      headers: {
        'Referer': 'https://oshwhub.com/',
        'Accept': 'application/json'
      }
    });
    const text = await response.text();
    const result: any = { success: false };
    
    const countMatch = text.match(/"count":\s*\{[^}]+\}/);
    if (countMatch) {
      const countStr = countMatch[0].replace('"count":', '').trim();
      result.count = JSON.parse(countStr);
      result.success = true;
    }
    
    const thumbMatch = text.match(/"thumb":\s*"([^"]+)"/);
    if (thumbMatch) {
      result.thumb = thumbMatch[1];
    }

    const commentsCountMatch = text.match(/"comments_count":\s*(\d+)/);
    if (commentsCountMatch) {
      result.commentsCount = parseInt(commentsCountMatch[1], 10);
    }
    
    return result;
  } catch (error) {
    console.error(`Error fetching project data for ${uid}:`, error);
    return null;
  }
}

const ossProjectsData = ref([
  {
    name: "STLink343 调试器",
    desc: "STLink343是基于STM32F103CBT6的调试工具，集成ST-Link/V2和USB转TTL串口功能.",
    tag: { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
    projectsimg: "https://image.lceda.cn/oshwhub/pullImage/41c1aa23b305448ea63934784bfb164d.jpg",
    View: '0',
    good: '0',
    Mark: '0',
    Comment: '0',
    projectLink: "https://oshwhub.com/seahi/stlinkv2anserial",
    uid: "e38dca3ab8a24ff3862996b420e796e3",
    usageLink: "https://oshwhub.com/seahi/stlinkv2anserial",
  },
  {
    name: "BrunTools（WiFi模组烧录架）",
    desc: "这是一款专门为 WiFi 模组提供免焊接烧录的烧录架，可以把模组安装在烧录架上，然后使用串口进行固件烧录。",
    tag: { name: "React", bg: "#e3edfa", color: "#3976c6" },
    projectsimg: "https://image.lceda.cn/oshwhub/pullImage/0c535ac8ec214c039ebeb62b70983eb5.png",
    View: '2.3k',
    good: '7',
    Mark: '20',
    Comment: '5',
    projectLink: "https://oshwhub.com/seahi/bruntools",
    uid: "e2a3f561673446439b2d4b6a7ae47cc1",
    usageLink: "/user/bruntools",
  },
  {
    name: "HomeAssistant 红外遥控器",
    desc: "适用于HomeAssistant 的空调红外遥控器，支持市面上98%的空调控制，支持一键匹配空调码。",
    tag: { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
    projectsimg: "https://image.lceda.cn/oshwhub/55aa204882094732a033b10a1e47efeb.png",
    View: '1.0w',
    good: '45',
    Mark: '134',
    Comment: '30',
    projectLink: "https://oshwhub.com/seahi/homeassistant-intelligent-air-re",
    uid: "9f645a40b47a47b9a87eb08b11ddf62c",
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
    uid: "6b526c07b7ce458d9b82691ad2913c89",
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
    uid: "eea15134ac154b5d998825db69c55856",
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
    uid: "c2a381566abd4cc183189785bfd7f4fa",
    usageLink: "https://oshwhub.com/seahi/ha-usb-kai-guan",
  },
  {
    name: "HomeAssistant红外遥控器——丐版",
    desc: "接入HomeAssitant 的智能红外遥控器，可实现远程控制家里的空调。",
    tag: { name: "JavaScript", bg: "#fffbe6", color: "#e4ae3a" },
    projectsimg: "https://image.lceda.cn/oshwhub/0f9c0e99ef914dcbaadbe415c1b0bb33.png",
    View: '5.1k',
    good: '19',
    Mark: '54',
    Comment: '10',
    projectLink: "https://oshwhub.com/seahi/homeassistant-smart-home-infrared-remote-control",
    uid: "e0cc8d01eded494bb613509defdfd365",
    usageLink: "https://oshwhub.com/seahi/homeassistant-smart-home-infrared-remote-control",
  },
  
]);

export const ossProjects = ossProjectsData.value;

export async function updateProjectData() {
  const fetchPromises = ossProjectsData.value.map(async (project) => {
    const data = await fetchProjectData(project.uid);
    
    if (data && data.success && data.count) {
      project.View = formatNumber(data.count.views);
      project.good = data.count.like.toString();
      project.Mark = data.count.star.toString();
      if (data.thumb) {
        project.projectsimg = data.thumb;
      }
    }
    if (data && data.commentsCount > 0) {
      project.Comment = data.commentsCount.toString();
    }
  });
  
  await Promise.all(fetchPromises);
}

export { View, good, Mark, Comment };
