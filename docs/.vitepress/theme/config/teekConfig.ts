import type { TeekConfig } from "vitepress-theme-teek/config";
import { version } from "vitepress-theme-teek/es/version";

import { FooterInfo } from "../../ConfigHyde/FooterInfo"; //导入底部信息配置
import { FriendLink } from "../../ConfigHyde/FriendLink"; // 导入FriendLink模块
import { HitokotoDate } from "../../ConfigHyde/HitokotoDate"; // 导入HitokotoData模块
import { Wallpaper } from "../../ConfigHyde/Wallaper"; // 导入Wallaper模块
// import { Cover } from "../../ConfigHyde/Cover"; // 导入Wallaper模块
import { SocialDate } from "../../ConfigHyde/SocialDate"; // 导入SocialDate社交信息模块


// 文档配置
export const teekDocConfig: TeekConfig = {
  // 文档风格，footer简洁版
  footerInfo: {
    theme: {
      name: `Theme By Teek@${version}`,
    },
    copyright: {
      createYear: 2025,
      suffix: "Seahi",
    },
  },

  //选择第三个选项：全部站看，侧边栏和内容区域宽度都可以调整
  themeEnhance: {
    layoutSwitch: {
      defaultMode: "bothWidthAdjustable",
      disabled: true,
    },
  },
};

// 博客基础配置
const teekBlogCommonConfig: TeekConfig = {

  //选择第三个选项：全部站看，侧边栏和内容区域宽度都可以调整
  themeEnhance: {
    layoutSwitch: {
      defaultMode: "bothWidthAdjustable",
      disabled: false,
    },
    themeColor: {
      defaultColorName: "vp-default",
      disabled: true,
      disableHelp: true,
    },

    spotlight: {
      disabled: false,
    },

    enabled: true,
  },


  teekHome: true,
  vpHome: false,

  banner: {
    enabled: true,
    name: "SeaHi の博客 🎉", // Banner 标题，默认读取 vitepress 的 title 属性
    bgStyle: "partImg", // Banner 背景风格：pure 为纯色背景，partImg 为局部图片背景，fullImg 为全屏图片背景
    pureBgColor: "#28282d", // Banner 背景色，bgStyle 为 pure 时生效
    imgSrc: Wallpaper, // Banner 图片链接。bgStyle 为 partImg 或 fullImg 时生效
    imgInterval: 15000, // 当多张图片时（imgSrc 为数组），设置切换时间，单位：毫秒
    imgShuffle: true, // 图片是否随机切换，为 false 时按顺序切换，bgStyle 为 partImg 或 fullImg 时生效
    imgWaves: true, // 是否开启 Banner 图片波浪纹，bgStyle 为 fullImg 时生效
    mask: false, // Banner 图片遮罩，bgStyle 为 partImg 或 fullImg 时生效
    maskBg: "rgba(0, 0, 0, 0.4)", // Banner 遮罩颜色，如果为数字，则是 rgba(0, 0, 0, ${maskBg})，如果为字符串，则作为背景色。bgStyle 为 partImg 或 fullImg 且 mask 为 true 时生效
    textColor: "#ffffff", // Banner 字体颜色，bgStyle 为 pure 时为 '#000000'，其他为 '#ffffff'
    titleFontSize: "3.2rem", // 标题字体大小
    descFontSize: "1.4rem", // 描述字体大小
    descStyle: "types", // 描述信息风格：default 为纯文字渲染风格（如果 description 为数组，则取第一个），types 为文字打印风格，switch 为文字切换风格
    description: HitokotoDate, // 描述信息
    switchTime: 4000, // 描述信息切换间隔时间，单位：毫秒。descStyle 为 switch 时生效
    switchShuffle: true, // 描述信息是否随机切换，为 false 时按顺序切换。descStyle 为 switch 时生效
    typesInTime: 200, // 输出一个文字的时间，单位：毫秒。descStyle 为 types 时生效
    typesOutTime: 100, // 删除一个文字的时间，单位：毫秒。descStyle 为 types 时生效
    typesNextTime: 100, // 打字与删字的间隔时间，单位：毫秒。descStyle 为 types 时生效
    typesShuffle: false, // 描述信息是否随机打字，为 false 时按顺序打字，descStyle 为 types 时生效
    

  },

  // // 首页顶部按 F11 开启壁纸模式
  // wallpaper: {
  //   enabled: true, // 是否启用壁纸模式
  //   hideBanner: true, // 开启壁纸模式后，全屏是否显示打字机文案，
  //   hideMask: true, // 开启壁纸模式后，是否隐藏 Banner 或 bodyBgImage 的遮罩层，则确保 banner.mask 和 bodyBgImage.mask 为 true 才生效
  //   // hideWaves: true, // 开启壁纸模式后，是否隐藏 Banner 波浪组件，仅 banner.bgStyle = 'fullImg' 生效
  // },
  // footerInfo: {
  //   customHtml: `<span id="runtime"></span>`, // 需要搭配 .vitepress/theme/helper/useRuntime.ts 使用
  // },

  footerInfo: FooterInfo, // 底部信息配置 
  friendLink: FriendLink, // 友链配置
  social: SocialDate, //社交信息配置
  codeBlock: {
    enabled: true, // 是否启用新版代码块
    collapseHeight: false, // 超出高度后自动折叠，设置 true 则默认折叠，false 则默认不折叠
    overlay: false, // 代码块底部是否显示展开/折叠遮罩层
    overlayHeight: 400, // 当出现遮罩层时，指定代码块显示高度，当 overlay 为 true 时生效
    langTextTransform: "none", // 语言文本显示样式，为 text-transform 的值:none, capitalize, lowercase, uppercase
    copiedDone: TkMessage => TkMessage.success("复制成功！"), // 复制代码完成后的回调
  },
};

// 博客默认配置
export const teekBlogConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  banner: {
    name: "🎉 SeaHi",
    description: [
      "有些人心如花木，皆向阳而生 —— 《剑来》",
      "认定一件事，即使拿十分力气都无法完成，也要拿出十二分力气去努力 —— 《剑来》：陈平安",
      "即使蚍蜉用尽全力，也无法撼动大树，但他想要对大树做些什么，是他的态度",
      "人生当苦无妨，良人当归即好",
      "苦难艰辛之大困局中，最难耐者能耐之，苦定回甘。",
      "落魄时，一定要把自己当回事；发迹后，一定要把他人当回事。",
    ],
    bgStyle: "partImg",
  },
};

// 博客小图配置
export const teekBlogParkConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  post: {
    postStyle: "card",

  },
  homeCardListPosition: "left",
  banner: {
    name: "SeaHi の博客 🎉",
    bgStyle: "partImg",
    imgSrc: ["/img/blog/4.jpeg", "/img/blog/3.png", "/img/blog/1.png"],
    description: [
      "有些人心如花木，皆向阳而生 —— 《剑来》",
      "认定一件事，即使拿十分力气都无法完成，也要拿出十二分力气去努力 —— 《剑来》：陈平安",
      "即使蚍蜉用尽全力，也无法撼动大树，但他想要对大树做些什么，是他的态度",
      "人生当苦无妨，良人当归即好",
      "苦难艰辛之大困局中，最难耐者能耐之，苦定回甘。",
      "落魄时，一定要把自己当回事；发迹后，一定要把他人当回事。",
    ],
    descStyle: "types",
    imgShuffle: true,
    titleFontSize: "3.2rem", // 标题字体大小
    switchShuffle: true, // 描述信息是否随机切换，为 false 时按顺序切换。descStyle 为 switch 时生效
    typesNextTime: 100,
    //代码块
    
  },

};

// 博客大图配置
export const teekBlogFullConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  post: {
    coverImgMode: "full",
  },
  banner: {
    name: "🎉 SeaHi",
    bgStyle: "fullImg",
    imgSrc: ["/blog/bg1.webp", "/blog/bg2.webp", "/blog/bg3.webp"],
    description: [
      "有些人心如花木，皆向阳而生 —— 《剑来》",
      "认定一件事，即使拿十分力气都无法完成，也要拿出十二分力气去努力 —— 《剑来》：陈平安",
      "即使蚍蜉用尽全力，也无法撼动大树，但他想要对大树做些什么，是他的态度",
      "人生当苦无妨，良人当归即好",
      "苦难艰辛之大困局中，最难耐者能耐之，苦定回甘。",
      "落魄时，一定要把自己当回事；发迹后，一定要把他人当回事。",
    ],
    descStyle: "types",
  },
  comment: {
    provider: "giscus",
    options: {
      repo: "Kele-Bingtang/vitepress-theme-teek",
      repoId: "R_kgDONpVfBA",
      category: "Announcements",
      categoryId: "DIC_kwDONpVfBM4Cm3v9",
    },
  },
};

// 博客全图配置
export const teekBlogBodyConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  pageStyle: "segment-nav",
  bodyBgImg: {
    imgSrc: ["/blog/bg1.webp", "/blog/bg2.webp", "/blog/bg3.webp"],
  },
  themeEnhance: {
    layoutSwitch: {
      defaultMode: "original",
      disabled: true,
    },
    themeColor: {
      disabled: true,
    },
  },
};

// 博客卡片配置
export const teekBlogCardConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  post: {
    postStyle: "card",
  },
  homeCardListPosition: "left",

};
