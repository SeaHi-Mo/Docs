<template>
  <div class="step-list">
    <div v-for="(step, index) in steps" :key="index" class="step-item">
      <!-- 顶部：icon + 步骤标题 -->
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
          <img v-if="step.image" :src="step.image" :alt="step.alt || `步骤 ${index + 1} 截图`" class="step-image" />
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
/* 保留原样式，适配VitePress的默认样式体系 */
.step-list {
  margin: 2rem 0;
  padding: 0;
  list-style: none;
}

.step-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding-bottom: 1rem;
  margin-left: 2rem;
}

.step-item::before {
  content: '';
  position: absolute;
  left: calc(-2rem + 1.2rem - 1px);
  top: 3rem;
  bottom: 0.5rem;
  width: 2px;
  background-color: #c936ee;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 3rem;
  position: relative;
  min-height: 2.4rem;
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
  color: var(--vp-c-text-1);
  /* 适配VitePress主题色变量 */
  font-size: 1rem;
  font-weight: 500;
  margin-left: 1rem;
}

.step-content {
  background-color: var(--vp-c-bg-alt);
  /* 适配VitePress背景色 */
  border: 1px solid #605e61;
  border-radius: 8px;
  padding: 1.5rem;
  margin-left: 1rem;
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
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.step-image {
  max-width: 400px;
  border-radius: 6px;
  flex-shrink: 0;
}

/* 适配暗黑模式 */
.dark .step-content {
  background-color: var(--vp-c-bg-alt);
  /* border-color: var(--vp-c-border-dark); */
  border-color: #605e61;
  /* 修改暗黑模式下的边框颜色 */
}
</style>