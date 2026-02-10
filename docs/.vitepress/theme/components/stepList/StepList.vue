<template>
  <div class="step-list">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="step-item"
    >
      <!-- 顶部：icon + 步骤标题（确保水平对齐） -->
      <div class="step-header">
        <div class="step-icon">
          <span class="step-icon-inner" v-html="step.icon || (index + 1)"></span>
        </div>
        <div class="step-title">
          <span class="step-title-text">{{ step.title || `第 ${index + 1} 步` }}</span>
        </div>
      </div>
      <!-- 下方：内容卡片 -->
      <div class="step-content">
        <div class="step-body">
          <div class="step-text">{{ step.text }}</div>
          <img
            v-if="step.image"
            :src="step.image.startsWith('/') ? step.image : '/' + step.image"
            :alt="step.alt || `步骤 ${index + 1} 截图`"
            class="step-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  steps: {
    type: Array as () => Array<{
      icon?: string
      title?: string
      text: string
      image?: string
      alt?: string
    }>,
    required: true
  }
})
</script>

<style scoped>
.step-list {
  margin: 2rem 0;
  padding: 0;
  list-style: none;
}

.step-item {
  position: relative;
  display: flex;
  flex-direction: column; /* 垂直布局 */
  gap: 0.8rem; /* 标题和内容的垂直间距 */
  padding-bottom: 1rem; /* 步骤之间的间距 */
  margin-left: 2rem; /* 左侧留空给icon和竖线 */
}

/* 所有步骤显示竖线，精准对准icon中心 */
.step-item::before {
  content: '';
  position: absolute;
  left: calc(-2rem + 1.2rem - 1px); /* icon中心 - 竖线半宽 */
  top: 3rem; /* 从icon底部开始 */
  bottom: 0.5rem;
  width: 2px;
  background-color: #3f71fd;
}

/* 核心修正：确保icon和标题水平居中对齐 */
.step-header {
  display: flex;
  align-items: center; /* 保证水平居中 */
  gap:3rem; /* 调整为你想要的间距 */
  position: relative;
  min-height: 2.4rem; /* 匹配icon高度，确保对齐 */
}

.step-icon {
  position: absolute;
  left: -2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2.4rem;
  height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00c853;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.step-title {
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  /* 标题本身无需额外样式，靠step-header的align-items:center对齐 */
}

/* 内容卡片：缩进对齐 */
.step-content {
  background-color: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 1.5rem;
  margin-left: 0;
}

.step-body {
  display: flex;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.step-text {
  flex: 1;
  min-width: 280px;
  color: #e0e0e0;
  line-height: 1.6;
}

.step-image {
  max-width: 400px;
  border-radius: 6px;
  flex-shrink: 0;
}
</style>