<template>
  <div class="my-links-container">
    <!-- 页面主标题区域 -->
    <div class="my-links-title">
      <h1>{{ title }}</h1>
    </div>
    <!-- 顶部Banner区域 -->
    <div v-if="bannerShow" class="flink-banner" id="banners">
      <!-- 左上角smallTitle -->
      <div class="icon-heartbeat1 banners-small-title">
        {{ smallTitle }}
      </div>

      <!-- 右上角功能按钮组 -->
      <div v-if="bannerButtonGroupShow" class="banner-button-group">
        <!-- 随机访问按钮 -->
        <button class="banner-button secondary" @click="handleRandomVisit" :disabled="allLinks.length === 0"
          aria-label="随机访问友链">
          <i class="icon-paper-plane" style="font-size: 18px;"></i>
          <span class="banner-button-text">随机访问</span>
        </button>

        <!-- 申请友链按钮 -->
        <a class="banner-button primary" href="#post-comment" :disabled="!shouldShow" aria-label="申请友链">
          <i class="icon-link" style="font-size: 18px;"></i>
          <span class="banner-button-text">申请友链</span>
        </a>
      </div>

      <!-- 两行头像横向无限滚动区域（错位排列） - 白木新增样式 -->
      <div class="tags-group-all">
        <!-- 星爆效果容器 - 白木新增样式 -->
        <div class="global-stars" ref="starsContainer">
          <svg v-for="(style, index) in starStyles" :key="index" 
            class="star-item" 
            :class="`gstar-${index + 1}`" 
            :style="style" 
            viewBox="0 0 24 24">
            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
          </svg>
        </div>
        <div class="tags-group-wrapper">
          <!-- 第一行 -->
          <div class="tags-group-row" :class="{ 'offset-start': index % 2 === 0 }" v-for="(row, index) in avatarRows"
            :key="index">
            <div class="tags-group-content">
              <!-- 白木新增样式 -->
              <a 
                v-for="(link, linkIndex) in row" 
                :key="linkIndex" 
                class="tags-group-icon" 
                target="_blank"
                :href="link.link" 
                :title="link.name" 
                rel="external nofollow noopener"
                @mouseenter="handleAvatarMouseEnter($event, link)"
                @mouseleave="handleAvatarMouseLeave"
              >
                <img :src="link.avatar" :alt="link.name" loading="lazy" :class="{ irregular: link.irregular }">
                <!-- 毛玻璃半透明背景 - 白木新增样式 -->
                <div 
                  v-if="activeLink && activeLink.link === link.link" 
                  class="avatar-overlay"
                >
                  <span class="avatar-text">{{ activeLink.name }}</span>
                </div>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!-- 友链分组列表，每个分组包含标题、描述和友链列表 -->
    <div v-for="(group, index) in linksData" :key="index" class="my-links-group">
      <!-- 分组标题容器 -->
      <div class="title-wrapper">
        <h3>{{ group.title }}</h3>
      </div>

      <!-- 分组描述文本 -->
      <p class="group-desc">{{ group.desc }}</p>

      <!-- 友链列表容器 -->
      <div class="links-grid">
        <!-- 每个友链项使用LinkItem子组件展示，通过:data传递友链信息 -->
        <div v-for="link in group.list" :key="link.link" class="links-grid__item">
          <LinkItem :data="link" />
        </div>
      </div>
    </div>

    <!-- 留言/评论区域，默认显示，可通过frontmatter隐藏 -->
    <div v-if="commentShow" class="my-message-section" id="post-comment">
      <div class="title-wrapper">
        <h3>申请友链</h3>
      </div>
      <p>想要和我交换友链？请在评论区按以下格式留言 💞</p>

      <!-- 留言卡片容器 -->
      <div class="message-card">
        <!-- 复制按钮区域 -->
        <div class="copy-button-container">
          <button class="copy-button" @click="copyMessageFormat" :aria-label="copyButtonText">
            <i class="icon-copy" style="font-size: 16px;"></i>
            <span class="copy-button-text">{{ copyButtonText }}</span>
          </button>
        </div>
        
        <p>留言格式：</p>
        <!-- 示例格式 -->
        <pre ref="messageFormat">
名称: SeaHi
链接: https://docs.c-hi.cn
头像: https://img.onedayxyy.cn/images/Teek/Teekwebsite/xyy-logo.webp
描述: 言念君子，温其如玉</pre>
        <!-- 评论区插槽 -->
        <!-- 默认为Twikoo评论组件，可通过插槽自定义其他评论系统 -->
        <slot name="comments">
          <Twikoo />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from "vitepress";
import LinkItem from "./LinkItem.vue";
// 导入Twikoo评论组件
import Twikoo from "../Twikoo.vue";
import { computed, ref, onMounted } from "vue";
// 引入顶部区域头像星爆效果+毛玻璃背景功能  - 白木新增样式
import { useStarBurst } from "./DiySlinkShiroki.ts";

/**
 * 单个友链的数据结构定义
 * @typedef {Object} Link
 * @property {string} name - 友链网站名称
 * @property {string} link - 友链网站URL地址
 * @property {string} avatar - 友链网站头像/Logo的图片URL
 * @property {string} descr - 友链网站的简短描述
 * @property {boolean} [irregular] - 可选参数，默认值为false，为false时将把头像处理为圆形
 */

/**
 * 友链分组的数据结构定义
 * @typedef {Object} LinkGroup
 * @property {string} title - 分组标题
 * @property {string} desc - 分组描述文字
 * @property {Link[]} list - 该分组下的友链列表数组
 */

// 从页面frontmatter中获取配置数据
const { frontmatter } = useData();

// 从frontmatter中读取links字段，如果未定义则使用空数组
const linksData = computed(() => frontmatter.value.links || []);

// 从frontmatter中读取title字段，默认值为"我的友链"
const title = computed(() => frontmatter.value.title || "我的友链");

// 当frontmatter中comments为false时隐藏，默认显示
const commentShow = computed(() => frontmatter.value.comments !== false);
// 当frontmatter中banner为false时隐藏，默认显示
const bannerShow = computed(() => frontmatter.value.banner !== false);
// 当frontmatter中bannerButtonGroup为false时隐藏，默认显示
const bannerButtonGroupShow = computed(() => frontmatter.value.bannerButtonGroup !== false);
// 可自定义frontmatter中的smallTitle，作为banner的小标题，默认值为"与各位博主一起成长进步"
const smallTitle = computed(() => frontmatter.value.smallTitle || "与各位博主一起成长进步");

const allLinks = computed(() => {
  return linksData.value.reduce((acc, group) => {
    const processedLinks = group.list.map(link => ({
      ...link,
      avatar: link.avatar
    }));
    acc.push(...processedLinks);
    return acc;
  }, []);
});

// 将头像平均分成两行，并复制内容以实现无缝滚动
const avatarRows = computed(() => {
  const avatars = allLinks.value;
  if (avatars.length === 0) return [[], []];

  const mid = Math.ceil(avatars.length / 2);
  const row1 = avatars.slice(0, mid);
  const row2 = avatars.slice(mid);

  // 复制内容以实现无缝滚动
  return [
    [...row1, ...row1], // 第一行复制一份
    [...row2, ...row2]  // 第二行复制一份
  ];
});

const handleRandomVisit = () => {
  if (allLinks.value.length === 0) return;
  const randomIndex = Math.floor(Math.random() * allLinks.value.length);
  const randomLink = allLinks.value[randomIndex];
  window.open(randomLink.link, "_blank");
};

// 星爆效果相关 - 白木新增样式
const { gStarStyle, setWrap, onAvatarEnter, onAvatarLeave } = useStarBurst();
const starStyles = ref(gStarStyle);
const activeLink = ref(null);
const starsContainer = ref(null);

// 处理头像鼠标进入事件 - 白木新增样式
const handleAvatarMouseEnter = (event, link) => {
  // 调用星爆效果函数 - 白木新增样式
  onAvatarEnter(event);
  
  // 设置当前激活的链接 - 白木新增样式
  activeLink.value = link;
};

// 处理头像鼠标离开事件 - 白木新增样式
const handleAvatarMouseLeave = () => {
  // 调用星爆效果函数 - 白木新增样式
  onAvatarLeave();
  
  // 清除激活的链接 - 白木新增样式
  activeLink.value = null;
};

// 组件挂载后设置星星容器 - 白木新增样式
onMounted(() => {
  if (starsContainer.value) {
    setWrap(starsContainer.value);
  }
});

// 复制功能相关
const messageFormat = ref(null);
const copyButtonText = ref('复制格式');
const copyMessageFormat = async () => {
  if (!messageFormat.value) return;
    const text = messageFormat.value.textContent;
    await navigator.clipboard.writeText(text);
    // 复制成功反馈
    copyButtonText.value = '已复制 !';
    // 2秒后恢复原文本
    setTimeout(() => {
      copyButtonText.value = '复制格式';
    }, 2000);
};
</script>

<style scoped>
/* 字体图标 */
@import url("https://cdn.ksah.cn/fonts/icomoon/font.css");
/* 导入自定义样式 - 包含白木新增样式 */
@import "./DiySlinkShiroki.scss";

/* 主容器样式 */
.my-links-container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 40px 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* 标题区域样式 */
.my-links-title {
  margin-bottom: 50px;
  padding: 0 10px;
}

/* 主标题样式 */
.my-links-title h1 {
  font-size: 2rem;
  font-weight: 600;
  background: -webkit-linear-gradient(10deg, #bd34fe 5%, #e43498 15%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  line-height: 1.2;
  display: inline-block;
}

/* Banner区域 */
.flink-banner {
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  border-radius: 12px;
  padding: 50px 20px 30px;
  margin-bottom: 60px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

/* 左上角图标 */
.icon-heartbeat1::before {
  margin-right: 8px;
}

/* 左上角smallTitle */
.banners-small-title {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  z-index: 2;
}

/* 右上角按钮组 */
.banner-button-group {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
  z-index: 2;
}

.banner-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
}

.banner-button.secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.banner-button.primary {
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}

/* 两行头像横向滚动区域 */
.tags-group-all {
  width: 100%;
  overflow: hidden;
  padding: 40px 0 10px;
  position: relative;
}

/* 滚动包装器 */
.tags-group-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 每一行 */
.tags-group-row {
  display: flex;
  width: max-content;
  /* 原动画定义已注释，详情见DiySlinkShiroki.scss中的scrollRow无缝动画 */
  /* animation: scrollRow 60s linear infinite;
  will-change: transform;
  backface-visibility: hidden; */
}

/* 原本的悬停时停止滚动动画样式，
已移至DiySlinkShiroki.scss
- 白木新增样式
*/

/* 内容组 */
.tags-group-content {
  display: flex;
  gap: 20px;
  padding: 0 10px;
}

/* 上下行错位排列 */
.offset-start {
  margin-left: 60px;
  /* 错开半个头像 */
}

/* 滚动动画 */
@keyframes scrollRow {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-40%);
  }
}

/* 头像样式样式
已移至DiySlinkShiroki.scss
- 白木新增样式
*/

/* 头像覆盖层样式
已移至DiySlinkShiroki.scss
- 白木新增样式
*/
  
  /* 确保内容在banner内部 - 白木新增样式后，修复一个bug */
  .tags-group-all {
    position: relative;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }
  
  /* 星星相关样式
  已移至DiySlinkShiroki.scss
  - 白木新增样式
  */

.my-links-group {
  margin-bottom: 40px;
}

/* 分组标题装饰线样式 */
.title-wrapper {
  position: relative;
  margin: 40px 0;
  height: 1px;
  background: #ddd;
  transition: 0.3s;
}

/* 分组标题文字样式 */
.title-wrapper h3 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: var(--vp-c-bg);
  padding: 0 20px;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  z-index: 1;
}

/* 分组描述文字样式 */
.group-desc {
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin-bottom: 30px;
  padding: 0 10px;
}

/* 友链网格布局 - 核心响应式实现 */
.links-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* 让所有行的内容居中对齐 */
  gap: 24px;
  margin-bottom: 60px;
  padding: 0 8px;
}

/* 每个友链项的样式，设置基础宽度 */
.links-grid__item {
  flex: 0 0 calc(100% - 24px);
  /* 移动设备：每行1个 */
  break-inside: avoid;
}

/* 平板设备：每行2个 */
@media (min-width: 768px) {
  .links-grid__item {
    flex: 0 0 calc(50% - 24px);
  }
}

/* 桌面设备：每行最多4个 */
@media (min-width: 1024px) {
  .links-grid__item {
    flex: 0 0 calc(25% - 24px);
  }
}

/* 留言区样式 */
.my-message-section {
  text-align: center;
  margin-top: 20px;
}

/* 留言卡片样式 */
.message-card {
  width: 100%;
  max-width: 1500px;
  margin: 30px auto;
  padding: 32px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--vp-c-divider);
  text-align: left;
  position: relative;
}

/* 复制按钮容器 */
.copy-button-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
}

/* 复制按钮样式 */
.copy-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  border: none;
}

.copy-button:hover {
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.copy-button:active {
  transform: translateY(0);
}

/* 示例格式代码块样式 */
.message-card pre {
  background: var(--vp-code-block-bg);
  padding: 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  line-height: 1.5;
  position: relative;
}

/* 移动端留言卡片适配 */
@media (max-width: 768px) {
  .message-card {
    padding: 24px;
    margin: 24px auto;
  }

  .copy-button-container {
    position: static;
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
  }
  
  .copy-button {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  .tags-group-icon {
    flex: 0 0 80px;
    width: 80px;
    height: 80px;
  }

  .tags-group-content {
    gap: 15px;
  }

  .offset-start {
    margin-left: 40px;
    /* 移动端适配 */
  }

  .flink-banner {
    padding: 30px 15px 20px;
  }

  .banner-button {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  /* 两个按钮 */
  .banner-button-group {
    display: none;
  }

  /* 移动端滚动速度调整 */
  .tags-group-row {
    animation-duration: 40s;
  }
}

/* 减少动画对性能的影响 */
@media (prefers-reduced-motion: reduce) {
  .tags-group-row {
    animation: none;
  }
}
</style>