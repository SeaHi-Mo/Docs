<template>
  <TkPageCard :title="noticeContent.title">
    <div class="announcement-card">
      <!-- 公告内容 -->
      <div class="announcement-content">
        <h3 class="announcement-title">
          {{ noticeContent.subtitle }}
        </h3>

        <p class="announcement-text">
          {{ noticeContent.content }}
        </p>

        <!-- 底部操作区 -->
        <div class="announcement-footer">
          <a class="announcement-link" :href="noticeContent.operationButtonPath" :target="getTargetValue()">
            <span>{{ noticeContent.operationButtonName }}</span>
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </TkPageCard>
</template>

<script setup lang="ts">
import { TkPageCard } from "vitepress-theme-teek";

// 公告内容类型
interface NoticeContent {
  title: string;
  subtitle: string;
  content: string;
  operationButtonName: string;
  operationButtonPath: string;
}

// 公告内容
const noticeContent: NoticeContent = {
  title: '📢 公告',
  subtitle: '🎉祝贺本站的盛大建立',
  content: '贺SeaHi の博客首次发布！从此，把踩过的坑、悟到的道，都写成独属于自己的成长序章。🎉🎉🎉 为此，奖励大家一个SeaHi 的博客',
  operationButtonName: '热烈欢迎',
  operationButtonPath: 'https://docs.c-hi.cn',
};

// 判断是否为外链
const isExternalLink = (): boolean => {
  const url: string = noticeContent.operationButtonPath
  return /^(https?:\/\/|\/\/)/.test(url);
};

// 获取网页打开方式
const getTargetValue = (): string => {
  return isExternalLink() ? '_blank' : '_self';
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

.announcement-content {
  padding: 10px;
}

.announcement-title {
  display: flex;
  align-items: center;
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
  gap: 8px;
}

.announcement-text {
  margin: 0 0 20px 0;
  color: var(--text-color);
  line-height: 1.7;
  font-size: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.announcement-footer {
  display: flex;
  justify-content: flex-end;
}

.announcement-link {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  color: var(--link-color);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 6px;
  border-radius: 4px;
}

.announcement-link:hover {
  color: var(--link-hover);
  background-color: rgba(99, 102, 241, 0.1);
}

.link-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.announcement-link:hover .link-icon {
  transform: translateX(3px);
}
</style>
