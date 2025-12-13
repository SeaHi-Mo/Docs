<template>
  <div v-if="shouldShow" class="shiguang-public">
    <div class="copyright-card">
      <!-- 公共图标 -->
      <span class="copyright-symbol shiguang-icon shiguang-icon-public"></span>

      <div class="copyright-content">
        <!-- 作者信息 -->
        <div class="copyright-item">
          <span class="copyright-meta">
            <span class="shiguang-icon shiguang-icon-user"></span>
            <span class="meta-text">本文作者</span>:
          </span>
          <span class="copyright-info">
            <a :href="config.authorUrl" target="_blank" rel="noopener">{{ config.authorName }}</a>
          </span>
        </div>

        <!-- 文章标题 -->
        <!-- <div class="copyright-item">
          <span class="copyright-meta">
            <span class="shiguang-icon shiguang-icon-title"></span>
            <span class="meta-text">本文标题</span>:
          </span>
          <span class="copyright-info">
            {{ $frontmatter.title }}
          </span>
        </div> -->

        <!-- 文章链接 -->
        <!-- <div class="copyright-item">
          <span class="copyright-meta">
            <span class="shiguang-icon shiguang-icon-link"></span>
            <span class="meta-text">本文链接</span>:
          </span>
          <span class="copyright-info">
            <a :href="currentUrl" target="_blank" rel="noopener">{{ currentUrl }}</a>
          </span>
        </div> -->

        <!-- 版权声明 -->
        <div class="copyright-item">
          <span class="copyright-meta">
            <span class="shiguang-icon shiguang-icon-cc"></span>
            <span class="meta-text">版权声明</span>:
          </span>
          <span class="copyright-info">
            本站文章除特别声明外，均采用
            <a :href="config.licenseUrl" target="_blank" rel="noopener">{{ config.licenseName }}</a>
            协议，转载请注明来自
            <a :href="config.siteUrl" target="_blank" rel="noopener">{{ config.siteName }}</a>！
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

// 统一配置区
const config = {
  authorName: 'SeaHi',
  authorUrl: 'https://docs.c-hi.cn',
  siteName: 'SeaHi の博客',
  siteUrl: 'https://docs.c-hi.cn',
  licenseName: 'CC BY-NC-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh'
}

// 获取 frontmatter 和路由
const { frontmatter } = useData()
const route = useRoute()

// 是否显示版权组件
const shouldShow = computed(() => frontmatter.value.copyright !== false)

// 当前页面完整 URL
const currentUrl = computed(() => {
  const baseUrl = config.siteUrl
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const path = route.path === '/' ? '' : route.path.replace(/^\//, '')
  return `${normalizedBaseUrl}${path}`
})
</script>

<style scoped>
.shiguang-public {
  margin: 2rem 0;
}

.copyright-card {
  position: relative;
  padding: clamp(12px, 4vw, 16px) clamp(16px, 6vw, 20px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-alt);
  background: linear-gradient(to bottom, var(--vp-c-bg-alt), var(--vp-c-bg));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: clamp(14px, 4vw, 15px);
  line-height: 1.7;
  overflow: hidden;
}

.copyright-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(33, 122, 244, 0.12),
    0 0 0 1px var(--vp-c-brand);
}

/* 公共信号图标装饰 */
.copyright-symbol {
  position: absolute;
  top: 12px;
  right: 16px;
  color: var(--vp-c-text-3);
  font-size: 20px;
  opacity: 0.7;
  transition: all 0.3s ease;
  pointer-events: none;
}

.copyright-card:hover .copyright-symbol {
  color: var(--vp-c-brand);
  opacity: 1;
  transform: scale(1.1);
}

/* 内容区布局 */
.copyright-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.copyright-item {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 6px 8px;
}

.copyright-meta {
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  font-weight: 500;
}

.copyright-meta .shiguang-icon {
  margin-right: 4px;
  font-size: 1em;
}

.meta-text {
  font-variant: small-caps; /* 小型大写字母，提升设计感 */
}

.copyright-info {
  color: var(--vp-c-text-1);
  word-break: break-all;
}

.copyright-info a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.copyright-info a:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

/* 图标使用 Emoji（更现代且无需字体） */
.shiguang-icon::before {
  transform: none !important;
  display: inline-block;
}

.shiguang-icon-user::before { content: '👤'; }
.shiguang-icon-title::before { content: '📝'; }
.shiguang-icon-link::before  { content: '🔗'; }
.shiguang-icon-cc::before    { content: '🌐'; }
.shiguang-icon-public::before { content: '📡'; }

/* 移动端适配 */
@media (max-width: 768px) {
  .copyright-card {
    padding: 12px 14px;
    font-size: 14px;
    border-radius: 10px;
  }

  .copyright-symbol {
    top: 10px;
    right: 12px;
    font-size: 18px;
  }

  .copyright-item {
    gap: 4px 8px;
  }

  .meta-text {
    font-size: 0.95em;
  }
}

@media (min-width: 1024px) {
  .copyright-card {
    padding: 16px 20px;
  }
}
</style>