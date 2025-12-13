// nav导航栏配置
import { TeekIcon, VdoingIcon, SSLIcon, BlogIcon } from "./icon/NavIcon";
export const Nav = [
  { text: "首页", link: "/" },
  // 笔记

  {
    text: '开源项目',
    items: [

    ],
  }, 
  {
    text: '教程',
    items: [

    ],
  },
  // 专题
  {
    text: '工具',
    items: [
      {
        text: '😂Emoji 表情库',
        link: '/tools/emoji',
      },
    ],
  },

  // 关于
  {
    text: '关于',
    items: [
      { text: '👋关于我', link: '/about/me' },
      // {
      //   text: `
      //     <div style="display: flex; align-items: center; gap: 4px;">
      //       <img src="/img/nav/个人主页.svg" alt="" style="width: 16px; height: 16px;">
      //       <span>个人主页</span>
      //     </div>
      //     `,
      //   link: '/about/homepage',
      // },
      // { text: '🎉关于本站', link: '/about/website' },
    ],
  },
  {
    text: '💖打赏',
    link: 'personal',
  },
]
