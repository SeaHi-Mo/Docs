<template>
  <div class="tuya-intro-container">
    <!-- 主标题 -->
   
    
    <div class="tuya-intro-content">
      <!-- 封面图片 -->
   
      
      <!-- 欢迎文本 -->
      <div class="intro-header">
        <span class="welcome-text">{{ welcomeText }}</span>
      </div>
      
      <!-- 简介段落 -->
      <div class="intro-paragraphs">
        <p class="intro-p" v-for="(paragraph, index) in paragraphs" :key="index">
          {{ paragraph }}
        </p>
      </div>
      
      <!-- 特色标签 -->
      <div class="feature-tags">
        <span class="tag" v-for="(tag, index) in tags" :key="index">
          {{ tag.icon }} {{ tag.text }}
        </span>
      </div>
      
      <!-- 行动按钮 -->
      <div class="action-button">
        <a href="/tutorial/tuya/route" class="start-button">
          开始学习之旅 🚀
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 封面图片
const coverImage = '/img/tuya/T2Board.png';

// 欢迎文本
const welcomeText = '致所有涂鸦开发小白 👋';

// 简介段落
const paragraphs = [
  '如果你零基础，对 TuyaOS 好奇却无从下手，担心复杂难懂、不知如何起步，这篇教程就是你的专属启蒙指南。',
  'TuyaOS 是涂鸦智能一站式嵌入式开发平台，无需深厚底层功底，就能快速上手智能设备开发、联网、APP 控制等核心功能，是小白入门智能硬件、落地涂鸦项目的绝佳敲门砖。',
  '本教程以小白视角出发，摒弃冗余术语，用直白语言、清晰步骤，带你从零认识 TuyaOS、搭建环境、完成第一个实操案例，避坑又高效。',
  '不必畏惧零基础，跟着步骤一步步来，你也能解锁涂鸦开发技能，实现自己的智能开发小目标！准备好开启入门之旅吧 ✨～'
];

// 特色标签
const tags = [
  { icon: '🎯', text: '零基础友好' },
  { icon: '📝', text: '清晰步骤' },
  { icon: '💡', text: '避坑指南' },
  { icon: '🚀', text: '快速上手' },
  { icon: '🌟', text: '实战案例' }
];
</script>

<style scoped>
.tuya-intro-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
  box-sizing: border-box;
}

/* 页面标题 */
.page-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  text-align: center;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tuya-intro-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

/* 封面图片样式 */
.tuya-cover {
  display: flex;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 8px;
}

.cover-img {
  width: 100%;
  max-width: 600px;
  height: auto;
  transition: transform 0.3s ease;
  display: block;
}

.cover-img:hover {
  transform: scale(1.02);
}

/* 欢迎文本样式 */
.intro-header {
  text-align: center;
  margin-bottom: 8px;
}

.welcome-text {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  display: inline-block;
  animation: bounceIn 1s ease;
}

/* 简介段落样式 */
.intro-paragraphs {
  text-align: left;
  line-height: 1.8;
  margin-bottom: 8px;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.intro-p {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 10px;
  border-left: 5px solid var(--vp-c-brand-1);
  transition: all 0.3s ease;
  word-break: break-word;
}

.intro-p:hover {
  transform: translateX(6px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* 特色标签样式 */
.feature-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-bottom: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
  flex-shrink: 0;
}

.tag:hover {
  background-color: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.4);
}

/* 行动按钮样式 */
.action-button {
  display: flex;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 24px;
}

.start-button {
  display: inline-block;
  padding: 14px 40px;
  background-color: var(--vp-c-brand-1);
  color: white;
  text-decoration: none;
  border-radius: 35px;
  font-size: 20px;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  min-width: 280px;
  text-align: center;
}

.start-button:hover {
  background-color: var(--vp-c-brand-2);
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.5);
}

/* 动画效果 */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式设计 - 大屏幕优化 */
@media (min-width: 1200px) {
  .tuya-intro-container {
    max-width: 1000px;
  }
  
  .page-title {
    font-size: 36px;
  }
  
  .welcome-text {
    font-size: 32px;
  }
  
  .intro-paragraphs {
    font-size: 17px;
  }
  
  .cover-img {
    max-width: 700px;
  }
}

/* 响应式设计 - 中屏幕优化 */
@media (max-width: 992px) {
  .tuya-intro-container {
    max-width: 800px;
  }
}

/* 响应式设计 - 平板优化 */
@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .welcome-text {
    font-size: 24px;
  }
  
  .intro-paragraphs {
    font-size: 15px;
  }
  
  .start-button {
    padding: 12px 32px;
    font-size: 18px;
  }
  
  .cover-img {
    max-width: 100%;
  }
}

/* 响应式设计 - 小平板/大手机优化 */
@media (max-width: 640px) {
  .page-title {
    font-size: 24px;
  }
  
  .welcome-text {
    font-size: 22px;
  }
  
  .intro-paragraphs {
    font-size: 14px;
  }
  
  .start-button {
    padding: 12px 28px;
    font-size: 17px;
  }
}

/* 响应式设计 - 手机优化 */
@media (max-width: 480px) {
  .tuya-intro-container {
    padding: 16px 12px;
  }
  
  .page-title {
    font-size: 22px;
    margin-bottom: 16px;
  }
  
  .welcome-text {
    font-size: 20px;
  }
  
  .intro-p {
    padding: 12px;
  }
  
  .tag {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .start-button {
    padding: 10px 24px;
    font-size: 16px;
  }
}

/* 响应式设计 - 小屏手机优化 */
@media (max-width: 360px) {
  .page-title {
    font-size: 20px;
  }
  
  .welcome-text {
    font-size: 18px;
  }
  
  .tag {
    font-size: 13px;
    padding: 6px 12px;
  }
}

/* 暗色模式适配 */
html.dark .intro-p {
  background-color: var(--vp-c-bg-mute);
}
</style>
