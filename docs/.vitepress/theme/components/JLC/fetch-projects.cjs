const fs = require('fs');
const path = require('path');

const projects = [
  { name: "BrunTools（WiFi模组烧录架）", uid: "e2a3f561673446439b2d4b6a7ae47cc1" },
  { name: "HomeAssistant 红外遥控器", uid: "9f645a40b47a47b9a87eb08b11ddf62c" },
  { name: "功耗只有16uA的WiFi温湿度计", uid: "6b526c07b7ce458d9b82691ad2913c89" },
  { name: "HomeAssistant WiFi通断器", uid: "eea15134ac154b5d998825db69c55856" },
  { name: "HomeAssistantUSB小夜灯控制器", uid: "c2a381566abd4cc183189785bfd7f4fa" },
  { name: "HomeAssistant红外遥控器——丐版", uid: "e0cc8d01eded494bb613509defdfd365" }
];

async function fetchAllProjects() {
  const results = {};
  
  for (const project of projects) {
    try {
      const response = await fetch(`https://oshwhub.com/api/project/${project.uid}`, {
        headers: {
          'Referer': 'https://oshwhub.com/',
          'Accept': 'application/json'
        }
      });
      const text = await response.text();
      const data = JSON.parse(text);
      
      if (data && data.success && data.count) {
        results[project.uid] = {
          views: data.count.views,
          star: data.count.star,
          fork: data.count.fork,
          watch: data.count.watch
        };
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
  
  const outputPath = path.join(__dirname, 'project-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
}

fetchAllProjects().then(() => {
  const outputPath = path.join(__dirname, 'project-data.json');
  const content = fs.readFileSync(outputPath, 'utf-8');
  process.stdout.write(content);
});
