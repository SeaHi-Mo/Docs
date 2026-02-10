// 组件导入
import Teek from "vitepress-theme-teek";
import TeekLayoutProvider from "./components/TeekLayoutProvider.vue";
import { defineComponent, h } from "vue";
import { useData } from "vitepress";
// import notice from "./components/notice.vue";
// import MNavLinks from "./components/MNavLinks.vue"; // 引入导航组件
import confetti from "./components/Confetti.vue"; //导入五彩纸屑组件
// import NavIcon from "./components/NavIcon.vue"; //导入导航栏图标
import TuyaIntroCard from "./components/TuyaIntroCard.vue"; // 导入涂鸦教程简介卡片组件


// Teek 在线主题包引用（需安装 Teek 在线版本）
import "vitepress-theme-teek/index.css"; // 引入主题样式
import "vitepress-theme-teek/theme-chalk/tk-code-block-mobile.css"; // 引入移动端代码块样式

import "vitepress-theme-teek/theme-chalk/tk-sidebar.css"; // 引入侧边栏样式

import "vitepress-theme-teek/theme-chalk/tk-nav.css"; // 引入导航栏样式

import "vitepress-theme-teek/theme-chalk/tk-aside.css"; // 文章目录样式
import "vitepress-theme-teek/theme-chalk/tk-doc-h1-gradient.css"; // 文档以及标题样式
import "vitepress-theme-teek/theme-chalk/tk-table.css"; // 表格样式
import "vitepress-theme-teek/theme-chalk/tk-mark.css"; // 文章 mark 标签样式
import "vitepress-theme-teek/theme-chalk/tk-blockquote.css"; //引用样式
import "vitepress-theme-teek/theme-chalk/tk-home-card-hover.css"; // 首页卡片悬停效果

import "vitepress-theme-teek/theme-chalk/tk-index-rainbow.css"; // Vitepress 首页彩虹渐变样式
import "vitepress-theme-teek/theme-chalk/tk-doc-fade-in.css"; // 文档淡入效果样式
import "vitepress-theme-teek/theme-chalk/tk-banner-desc-gradient.css"; // Banner 描述渐变样式

// 主题增强样式
import "vitepress-theme-teek/theme-chalk/tk-nav-blur.css"; // 导航栏毛玻璃样式
// import "vitepress-theme-teek/theme-chalk/tk-container.css"; // Markdown 容器样式
// import "vitepress-theme-teek/theme-chalk/tk-container-left.css"; // Markdown 容器左框样式
// import "vitepress-theme-teek/theme-chalk/tk-container-flow.css"; // Markdown 容器流体样式
import "vitepress-theme-teek/tk-plus/banner-full-img-scale.scss"; // Banner 全屏图片放大样式

import "./styles/code-bg.scss";
import "./styles/iframe.scss";
import "./style/index.scss"; // 引入One全局样式

// import "virtual:group-icons.css"; //代码组图标样式
import "vitepress-markdown-timeline/dist/theme/index.css"; // 引入时间线样式

//切换进度条
import { NProgress } from "nprogress-v2/dist/index.js"; // 进度条组件
import "nprogress-v2/dist/index.css"; // 进度条样式

import "vitepress-theme-teek/tk-plus/fade-up-animation.scss";// 首次加载的动画效果


import SLink from "./components/SLink/index.vue"; //友链

// 导入情侣相册组件
import CoupleAlbum from './components/CoupleAlbum/CoupleAlbum.vue'
import PhotoCard from './components/CoupleAlbum/PhotoCard.vue'

// 引入复制事件（复制后弹窗提示）
import { useCopyEvent } from "./composables/useCopyEvent.ts";


import "./components/guangbiaoTX/guangbiaoTX.scss"; // ⬅️ 鼠标拖尾样式scss
import { useGuangbiaoTX } from "./components/guangbiaoTX/useGuangbiaoTX"; // ⬅️ 导入鼠标拖尾星星动画ts
// import "./style/sidebar-icon.scss";
import { initImageViewer } from "./style/dd-image/dd-image.ts" // 引入图片查看器功能（替换原版

import EmojiShiroki from "./components/EmojiShiroki/index.vue"; // 引入EmojiShiroki组件
import StepList from './components/stepList/StepList.vue' // 引入步骤列表组件



export default {
  extends: Teek,
  async enhanceApp({ app, router }) {
    // 注册组件
    // app.component("MNavLinks", MNavLinks); // 注册导航组件
    app.component("confetti", confetti); // 注册五彩纸屑组件

    app.component('CoupleAlbum', CoupleAlbum) // 注册情侣相册组件
    app.component('PhotoCard', PhotoCard)

    // app.component("NavIcon", NavIcon); //导航栏图标

    // 注册全局组件
    // app.component("friend-link", SLink);

    app.component("emoji-Shiroki", EmojiShiroki); // ◀️ 注入 Emoji 表情库组件布局
    app.component("TuyaIntroCard", TuyaIntroCard); // 注册涂鸦教程简介卡片组件
    app.component('StepList', StepList) // 注册步骤列表组件

    // 非SSR环境下配置路由进度条
    // @ts-expect-error
    if (!import.meta.env.SSR) {
      NProgress.configure({ showSpinner: false });
      router.onBeforeRouteChange = () => NProgress.start();
      router.onAfterRouteChange = () => {
        setTimeout(() => {
          NProgress.done();
        }, 100);
      };

      // 🔽 鼠标拖尾星星动画
      if (typeof window !== "undefined") {
        useGuangbiaoTX();
      }

      // 🔽 替换原版图片查看器
      initImageViewer();

    }
    // 不蒜子环境下配置路由进度条
    // if (inBrowser) {
    //   NProgress.configure({ showSpinner: false });
    //   router.onBeforeRouteChange = () => {
    //     NProgress.start(); // 开始进度条
    //   };
    //   router.onAfterRouteChanged = () => {
    //     NProgress.done(); // 停止进度条
    //   };
    // },  

  },
  Layout: defineComponent({
    name: "LayoutProvider",
    setup() {
      if (typeof window !== 'undefined') {
        // 监听复制事件
        useCopyEvent();
      }

      const props: Record<string, any> = {};
      const { frontmatter } = useData();

      // 添加自定义 class 逻辑
      if (frontmatter.value?.layoutClass) {
        props.class = frontmatter.value.layoutClass;
      }

      return () => h(TeekLayoutProvider, props);
    },
  }),
};