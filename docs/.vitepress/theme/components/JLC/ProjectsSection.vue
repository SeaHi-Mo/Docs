<template>
  <div class="oss-section" :class="{ visible: isVisible }">
    <h2 class="oss-title">开源项目</h2>
    <div class="oss-list">
      <div class="oss-card" v-for="(item, idx) in ossProjects" :key="item.name" :ref="setOssCardRef(idx)"
        :class="{ visible: !isMobile || ossCardVisible[idx] }" v-memo="[item, ossCardVisible[idx]]">
        <div class="oss-img-wrap">
          <img :src="item.projectsimg" class="oss-img" :alt="item.name" />
        </div>
        <div class="oss-content">
          <div class="oss-name">{{ item.name }}</div>
          <!-- <div class="oss-desc">{{ item.desc }}</div> -->
          <div class="oss-data">
            <span>
              <TkIcon :icon="View" icon-type="svg" size="16px" />
              {{ item.View }}
            </span>
            <span>
              <TkIcon :icon="good" icon-type="svg" size="16px" />
              {{ item.good }}
            </span>
            <span>
              <TkIcon :icon="Mark" icon-type="svg" size="16px" />
              {{ item.Mark }}
            </span>
             <span>
              <TkIcon :icon="Comment" icon-type="svg" size="16px" />
              {{ item.Comment }}
            </span>
          </div>
          <!-- 美化后的按钮组 -->
          <div class="oss-btn-group">
            <a class="oss-btn":href="item.projectLink" target="_blank" rel="noopener noreferrer" >
              查看项目
            </a>
            <a 
              class="oss-btn" :href="item.usageLink" target="_blank" rel="noopener noreferrer">
              使用说明
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { TkIcon } from "vitepress-theme-teek";
import { useMultipleIntersectionObserver } from '../About/useIntersectionObserver';
import { ossProjects, View,good, Mark ,Comment} from './data';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  }
});

// 使用多元素观察器组合函数
const {
  elementsVisible: ossCardVisible,
  setElementRef: setOssCardRef,
  setupObserver,
  cleanup
} = useMultipleIntersectionObserver(0.2, true);

// 监听移动端状态变化，重新设置观察器
watch([() => props.isMobile, ossProjects], () => {
  if (props.isMobile) {
    nextTick(() => setupObserver(ossProjects.length));
  } else {
    cleanup();
  }
});

onMounted(() => {
  if (props.isMobile) {
    nextTick(() => setupObserver(ossProjects.length));
  }
});

onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.oss-section {
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px;
  opacity: 0;
  transform: scale(0.8);
  transition: box-shadow 0.22s, transform 0.18s, border 0.18s, opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.oss-section.visible {
  opacity: 1;
  transform: scale(1);
}

.oss-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 48px;
}

.oss-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 默认4列 */
  gap: 32px;
  justify-content: center;
}

/* 超大屏幕：5列 */
@media (min-width: 1920px) {
  .oss-section {
    max-width: 1800px;
    padding: 56px 32px;
  }
  
  .oss-list {
    grid-template-columns: repeat(5, 1fr);
    gap: 36px;
  }
  
  .oss-title {
    font-size: 3rem;
    margin-bottom: 56px;
  }
}

/* 大屏幕：4列 */
@media (min-width: 1440px) and (max-width: 1919px) {
  .oss-section {
    max-width: 1400px;
    padding: 48px 32px;
  }
  
  .oss-list {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}

/* 中等屏幕：3列 */
@media (min-width: 1200px) and (max-width: 1439px) {
  .oss-section {
    max-width: 1200px;
    padding: 40px 24px;
  }
  
  .oss-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  
  .oss-title {
    font-size: 2.25rem;
    margin-bottom: 40px;
  }
}

/* 小屏幕：2列 */
@media (min-width: 768px) and (max-width: 1199px) {
  .oss-section {
    max-width: 100%;
    padding: 36px 20px;
  }
  
  .oss-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .oss-title {
    font-size: 2rem;
    margin-bottom: 36px;
  }
}

/* 平板：2列（调整间距） */
@media (min-width: 640px) and (max-width: 767px) {
  .oss-section {
    padding: 32px 16px;
  }
  
  .oss-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .oss-title {
    font-size: 1.75rem;
    margin-bottom: 32px;
  }
}

/* 手机端：1列 */
@media (max-width: 639px) {
  .oss-section {
    padding: 24px 12px;
  }
  
  .oss-list {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .oss-title {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }
}

/* 卡片样式调整 */
.oss-card {
  width: 100%;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  opacity: 0;
  transform: scale(0.8);
}

.oss-card.visible {
  opacity: 1;
  transform: scale(1);
}

.oss-card:hover {
  box-shadow: 0 8px 32px var(--vp-c-brand-1);
  transform: scale(1.04);
}

.oss-img-wrap {
  position: relative;
  width: 100%;
  height: 185px;
  overflow: hidden;
}

/* 图片高度响应式调整 */
@media (max-width: 767px) {
  .oss-img-wrap {
    height: 160px;
  }
}

@media (max-width: 639px) {
  .oss-img-wrap {
    height: 200px;
  }
}

.oss-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.oss-img:hover {
  transform: scale(1.08);
}

.oss-content {
  padding: 18px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.oss-name {
  color: #444;
  font-size: 1.18rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.oss-desc {
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 18px;
  min-height: 56px;
}

.oss-data {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

@media (max-width: 767px) {
  .oss-data {
    gap: 8px 12px;
    font-size: 0.85rem;
  }
}

/* 按钮组样式 */
.oss-btn-group {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 639px) {
  .oss-btn-group {
    gap: 10px;
  }
}

.oss-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background-color: #409eff;
  color: #ffffff;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  flex: 1;
  text-align: center;
}

.oss-btn:hover {
  background-color: #337ecc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 移动端按钮调整 */
@media (max-width: 639px) {
  .oss-btn {
    padding: 12px 16px;
    font-size: 15px;
  }
}
</style>