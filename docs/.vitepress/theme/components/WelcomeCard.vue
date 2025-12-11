<template>
  <TkPageCard :title="noticeContent.title">
    <div class="announcement-card">
      <!-- 公告内容 -->
      <div class="announcement-content">
        <span class="announcement-title">
          {{ noticeContent.subtitle }}
        </span>

        <span class="announcement-text">
          {{ noticeContent.content }}
        </span>
        <span class="announcement-text">
          {{ noticeContent.error }}
        </span>
        <span class="announcement-text" v-html="noticeContent.email"> </span>
      </div>

      <!-- IP位置信息 -->
      <div class="ip-section" v-if="ipData">
        <div class="ip-header">
          <span class="ip-location"
            >欢迎来自<span class="red-text"> {{ getLocationText() }} </span
            >的朋友💖</span
          >
        </div>
        <div class="ip-info">
          <div class="ip-details">
            您的IP地址:
            <span class="ip-address" :title="ipData.ip">{{ ipData.ip }}</span>
          </div>
          <div class="distance-info" v-if="distance">
            当前位置距博主约<span class="distance-value">{{ distance }}</span
            >公里
          </div>
          <div class="greeting-section" v-if="ipData">
            <span class="greeting-text">{{ getGreetingText() }}</span>
            <span class="greeting-tip">Tip：带我去你的城市逛逛吧！ 🍂</span>
          </div>
        </div>
      </div>

      <!-- 天气信息 -->
      <div class="weather-section" v-if="weatherData">
        <div class="weather-header">
          <span class="weather-icon">🌤️</span>
          <span class="weather-location"
            >{{ weatherData.province }} {{ weatherData.city }}
            {{ weatherData.district }}</span
          >
        </div>
        <div class="weather-info">
          <div class="weather-main">
            <span class="weather-temp">{{ weatherData.temperature }}°C</span>
            <span class="weather-desc">{{ weatherData.weather }}</span>
          </div>
          <div class="weather-details">
            <span
              >{{ weatherData.wind_direction }}
              {{ weatherData.wind_power }}</span
            >
            <span>湿度 {{ weatherData.humidity }}%</span>
          </div>
        </div>
        <div class="weather-update">
          最后更新: {{ weatherData.update_time }}
        </div>
      </div>
    </div>
  </TkPageCard>
</template>

<script setup lang="ts">
import { TkPageCard } from "vitepress-theme-teek";
import { ref, onMounted } from "vue";

// IP数据类型
interface IPData {
  ip: string;
  country: string;
  prov: string;
  city: string;
  district: string;
  adcode: number;
  lat: number;
  lng: number;
}

// 天气数据类型
interface WeatherData {
  province: string;
  city: string;
  district: string;
  update_time: string;
  weather: string;
  temperature: number;
  wind_direction: string;
  wind_power: string;
  humidity: number;
}

// 公告内容类型
interface NoticeContent {
  title: string;
  // subtitle: string;
  content: string;
  error: string;
  email: string;
}

// 响应式数据
const ipData = ref<IPData | null>(null);
const weatherData = ref<WeatherData | null>(null);
const distance = ref<string>("");

// 公告内容
const noticeContent: NoticeContent = {
  title: "🎉我是SeaHi，欢迎您来到我的博客",
  // subtitle: "👋🏻你好，我是SeaHi，欢迎您！",
  content: "❓ 如有问题欢迎评论区交流！",
  error: "😫 页面异常？尝试Ctrl+F5",
  email:
    '📧 如需联系我：<a href="mailto:seahi-mo@foxmail.com" style="color: var(--vp-c-brand-1);">发送邮件🚀</a>',
};

// 获取IP数据
const fetchIPData = async (): Promise<void> => {
  try {
    const API_URL =
      //修改点1:
      "https://api.nsmao.net/api/ip/query?key=td0O2FhnA8278CARZT8KlRHgKi";  //替换实际自己的API_KEY

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.code === 200 && result.data) {
      ipData.value = result.data;
      // 计算距离
      distance.value = calculateDistance();
    } else {
      throw new Error(result.msg || "IP数据获取失败");
    }
  } catch (error) {
    console.error("获取IP数据失败:", error);
    ipData.value = null;
  }
};

// 获取天气数据
const fetchWeatherData = async (): Promise<void> => {
  try {
    const API_URL =
      //修改点2:
      "https://api.nsmao.net/api/weather/query?key=td0O2FhnA8278CARZT8KlRHgKi";  //替换实际自己的API_KEY

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.code === 200 && result.data) {
      weatherData.value = result.data;
    } else {
      throw new Error(result.msg || "天气数据获取失败");
    }
  } catch (error) {
    console.error("获取天气数据失败:", error);
    weatherData.value = null;
  }
};

// 组件挂载时获取IP和天气数据
onMounted(() => {
  fetchIPData();
  fetchWeatherData();
});

// 获取位置显示文本
const getLocationText = (): string => {
  if (!ipData.value) return "";

  const { country, prov, city, district } = ipData.value;

  // 优先显示城市和区县
  if (city && district) {
    return `${city} ${district}`;
  } else if (city) {
    return city;
  } else if (district) {
    return district;
  } else if (prov) {
    return prov;
  } else if (country) {
    return country;
  }

  return "未知地区";
};

// 计算距离（广州经纬度：23.1216, 113.3372）
const calculateDistance = (): string => {
  if (!ipData.value || !ipData.value.lat || !ipData.value.lng) return "";

  //修改点3：定位下自己所处位置的经纬度，然后写到这里。可以通过  https://www.lddgo.net/convert/position 百度地图来定位自己的位置
  const guangzhouLat = 31.14; //维度
  const guangzhouLng = 121.54; //经度

  const userLat = ipData.value.lat;
  const userLng = ipData.value.lng;

  // 使用Haversine公式计算距离
  const R = 6371; // 地球半径（公里）
  const dLat = ((userLat - guangzhouLat) * Math.PI) / 180;
  const dLng = ((userLng - guangzhouLng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((guangzhouLat * Math.PI) / 180) *
      Math.cos((userLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance).toString();
};

// 获取问候语文本
const getGreetingText = (): string => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 6 && hour < 9) {
    return "🌅 早安，开启美好的一天！";
  } else if (hour >= 9 && hour < 12) {
    return "☀️ 上午好，工作学习加油！";
  } else if (hour >= 12 && hour < 14) {
    return "🍽️ 中午好，记得好好吃饭哦~";
  } else if (hour >= 14 && hour < 18) {
    return "☕ 下午好，来杯咖啡提提神吧！";
  } else if (hour >= 18 && hour < 22) {
    return "🌇 晚上好，放松一下享受时光~";
  } else if (hour >= 22 && hour < 24) {
    return "🌙 夜深了，早点休息哦~";
  } else {
    return "🌌 凌晨好，注意身体别熬夜~";
  }
};
</script>

<style scoped>
.announcement-card {
  --link-color: #888;
  --link-hover: #6366f1;
}

html.dark .announcement-card {
  --link-color: #aaa;
  --link-hover: #818cf8;
}

/* IP位置信息样式 */
.ip-section {
  background-color: #f0f2f5;
  border-radius: 8px 8px 0 0;
  padding: 8px;
  text-align: center;
  line-height: 1.8;
  margin-top: 10px;
}

html.dark .ip-section {
  background-color: #2a2d31;
}

.ip-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ip-location {
  font-size: 15px;
}

.ip-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ip-details {
  font-size: 14px;
}

.red-text {
  color: var(--vp-c-brand-1);
  font-weight: bold;
}

.ip-address {
  color: var(--vp-c-brand-1);
  font-weight: bold;
  filter: blur(3px);
  transition: filter 0.3s ease;
  cursor: pointer;
}

.ip-address:hover {
  filter: none;
}

.distance-info {
  font-size: 14px;
}

.distance-value {
  color: var(--vp-c-brand-1);
  font-weight: bold;
  margin: 0 4px;
}

/* 问候语样式 */
.greeting-section {
  border-radius: 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.greeting-text {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.greeting-tip {
  font-size: 12px;
  color: #425aef;
  font-style: italic;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .greeting-section {
    gap: 6px;
  }

  .greeting-text {
    font-size: 13px;
  }

  .greeting-tip {
    font-size: 11px;
  }
}

/* 天气信息样式 */
.weather-section {
  background-color: #f0f2f5;
  border-radius: 0 0 8px 8px;
  padding: 8px;
  text-align: center;
}

html.dark .weather-section {
  background-color: #2a2d31;
}

.weather-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  gap: 6px;
}

.weather-icon {
  font-size: 20px;
}

.weather-location {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
}

.weather-info {
  margin-bottom: 6px;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  margin-bottom: 6px;
}

.weather-temp {
  font-size: 24px;
  font-weight: 700;
}

.weather-desc {
  font-size: 14px;
  font-weight: 600;
}

.weather-details {
  display: flex;
  justify-content: center;
  gap: 50px;
  font-size: 12px;
  opacity: 0.8;
}

.weather-update {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
}

.announcement-title {
  display: flex;
  align-items: center;
  font-weight: 700;
  color: var(--text-color);
  gap: 8px;
}

.announcement-text {
  color: var(--text-color);
  line-height: 1.7;
  font-size: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
