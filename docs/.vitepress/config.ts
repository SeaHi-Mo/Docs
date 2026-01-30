import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";
import { version } from "vitepress-theme-teek/es/version";
import { Wallpaper } from "./ConfigHyde/Wallaper"; // 导入Wallaper模块
import { Cover } from "./ConfigHyde/Cover"; // 导入Wallaper模块

import { CommentData } from "./ConfigHyde/Comment"; //导入评论配置
import { Nav } from "./ConfigHyde/Nav"; // 导入Nav模块
import { SocialLinks } from "./ConfigHyde/SocialLinks"; //导入社交链接配置



import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons"; // 导入代码组图标插件

import timeline from "vitepress-markdown-timeline"; // 导入时间线插件

import type { HeadConfig } from "vitepress"; // 在文件顶部添加类型导入
import { HeadData } from "./ConfigHyde/Head"; // 导入 HeadData 导入和类型断言

import { createRewrites } from "vitepress-theme-teek/config";

import AutoFrontmatter, { FileInfo } from "vitepress-plugin-auto-frontmatter";
import { useTransformByRules, type TransformRule } from "./theme/composables/useTransform";
import { sidebarConfig } from "./theme/sidebar/SidebarConfig";


const description = [
  "欢迎来到 SeaHi 的博客",
  "本站是一个嵌入式个人资料库，记录了 SeaHi 的在电子、编程、DIY的学习过程",
  "或与你在这里可以找到C51、STM32、WiFi、蓝牙等嵌入式开发资料和开发经验",
].toString();
const CoverImgList = Cover; // 获取封面列表
// const CoverBgList = Wallpaper; // 获取壁纸列表


const teekConfig = defineTeekConfig({
  // // 首页顶部按 F11 开启壁纸模式
  // 首页顶部按 F11 开启壁纸模式
  wallpaper: {
    enabled: true, // 是否启用壁纸模式
    hideBanner: false, // 开启壁纸模式后，全屏是否显示打字机文案，
    hideMask: true, // 开启壁纸模式后，是否隐藏 Banner 或 bodyBgImage 的遮罩层，则确保 banner.mask 和 bodyBgImage.mask 为 true 才生效
  },

  loading: false, // 启用 Loading 动画，为 false 则关闭 Loading 动画
  // loading: "已经在很努力加载了，请稍等一下哦~", // 修改 Loading 文案


  themeEnhance: {
    themeColor: {
      defaultColorName: "vp-default",   //默认主题色为蓝色
    },
  },

  windowTransition: true,

  sidebarTrigger: true, //侧边栏收缩

  // author: { name: "Teeker", link: "https://github.com/Kele-Bingtang" },
  blogger: {
    // 博主信息，显示在首页侧边栏
    avatar: "/Seahi-Logo.png",  //侧边栏个人头像
    shape: "circle-rotate", // 头像风格：square 为方形头像，circle 为圆形头像，circle-rotate 可支持鼠标悬停旋转
    name: "SeaHi", // 侧边栏个人昵称
    slogan: "言念君子，温其如玉", // 侧边栏个人座右铭
    circleBgImg: "/img/1.webp", // 侧边栏个人头像圆形背景图
    circleBgMask: false, // 头像圆形背景图是否显示遮罩层
    color: "#fff",

    // 状态，仅当 shape 为 circle 相关值时有效
    status: {
      icon: "😜", // 状态图标
      size: 24, // 图标大小
      title: "我是一个程序员", // 鼠标悬停图标的提示语
    },
  },


  // 分类卡片
  category: {
    enabled: false, // 是否启用分类卡片
    limit: 8, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
  },
  // 标签卡片
  tag: {
    enabled: false, // 是否启用标签卡片
    limit: 21, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
  },


  // 精选文章卡片
  topArticle: {
    enabled: false, // 是否启用精选文章卡片
    limit: 5, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
    dateFormat: "yyyy-MM-dd", // 精选文章的日期格式
    // dateFormat: "yyyy-MM-dd hh:mm:ss", // 精选文章的日期格式
  },

  page: {
    pageSize: 39, //首页 Post 文章列表的分页配置
  },

  // 首页尺寸变大
  themeSize: "large",

  // // 布蒜子统计分析
  // docAnalysis: {
  //   createTime: "2021-10-19",
  //   statistics: {
  //     // provider: "busuanzi",
  //     provider: "vercount",
  //     // provider: "busuanzi",
  //     // url: "//bsz.eryajf.net/jsonp?callback=Busuanzicallback"
  //   },
  //   wordCount: true,
  //   readingTime: true,
  //   // overrideInfo: [
  //   //   { key: "lastActiveTime", value: (_, currentValue) => `${currentValue}前` },
  //   //   { key: "totalPosts", label: "文章总数目" },
  //   // ],
  //   appendInfo: [{ key: "index", label: "序号", value: "One" }],
  // },


  // 布蒜子统计分析
  // docAnalysis: {
  //   createTime: "2025-02-26",
  //   statistics: {
  //     provider: "busuanzi",
  //     url: "https://bszi.eryajf.net/jsonp?callback=BusuanziCallback",
  //     tryRequest: true,
  //     tryCount: 5,
  //     tryIterationTime: 2000,
  //   },
  //   wordCount: true,
  //   readingTime: true,
  // },


  // 风险链接提示页
  riskLink: {
    enabled: false, //是否启用风险链接提示功能
    whitelist: ["https://docs.c-hi.cn", /https:\/\/github.com/, /https:\/\/giee.com/], // 白名单，匹配到的链接不提示风险
    blacklist: [], // 黑名单，匹配到的链接提示风险
  },

  // articleBottomTip: () => {
  //   return {
  //     type: "tip",
  //     title: "声明",
  //     text: `<p>作者：<a href="https://onedayxyy.cn/" target="_blank" rel="noopener noreferrer">One</a></p>
  //            <p style="margin-bottom: 0">链接：可点击右上角分享此页面复制文章链接😜</p>
  //            <p>版权：本博客所有文章除特别声明外，均采用<a href="http://www.suncai.net/PubLicense/CCBY40.html" target="_blank" rel="noopener noreferrer">CCBY-NC-SA4.O</a>许可协议。转载请注明来自<a href="https://onedayxyy.cn/" target="_blank" rel="noopener noreferrer">One Blog</a></p>
  //           `,
  //   };
  // },

  // backTopDone: TkMessage => TkMessage.success("返回顶部"),

  // //右下角回到顶部配置。
  backTop: {
    enabled: true, // 是否启动回到顶部功能
    content: "icon", // 回到顶部按钮的显示内容，可选配置 progress | icon
    done: TkMessage => TkMessage.success("返回顶部成功"), // 回到顶部后的回调
  },

  //右下角滚动滚动到评论区配置。
  toComment: {
    enabled: true, // 是否启动滚动到评论区功能
    done: TkMessage => TkMessage.success("已抵达评论区"), // 滚动到评论区后的回调
  },

  // 新版代码块配置
  codeBlock: {
    // disabled: false, // 是否禁用新版代码块
    collapseHeight: 700, // 超出高度后自动折叠，设置 true 则默认折叠，false 则默认不折叠
    overlay: true, // 代码块底部是否显示展开/折叠遮罩层
    overlayHeight: 400, // 当出现遮罩层时，指定代码块显示高度，当 overlay 为 true 时生效
    copiedDone: (TkMessage) => TkMessage.success("复制成功！"),
  },

  post: {
    showCapture: false,  //关闭自动摘要
  },

  articleShare: { enabled: true },

  articleAnalyze: {
    imageViewer: { hideOnClickModal: true }, // 图片预览是否点击遮罩层关闭}
    showIcon: true, // 作者、日期、分类、标签、字数、阅读时长、浏览量等文章信息的图标是否显示
    // dateFormat: "yyyy-MM-dd hh:mm:ss", // 文章日期格式，首页和文章页解析日期时使用
    dateFormat: "yyyy-MM-dd", // 文章日期格式，首页和文章页解析日期时使用
    showInfo: true, // 是否展示作者、日期、分类、标签、字数、阅读时长、浏览量等文章信息，分别作用于首页和文章页
    showAuthor: true, // 是否展示作者
    showCreateDate: true, // 是否展示创建日期
    showUpdateDate: true, // 是否展示更新日期，是否展示更新时间，仅在文章页显示
    showCategory: true, // 是否展示分类
    showTag: true, // 是否展示标签
    // showTag: ["article"], // 是否展示标签

    // 将文章信息传到一级标题下面
    // teleport: {
    //   selector: "h1",
    //   position: "after",
    //   className: "h1-bottom-info",
    // },
  },


  // 超过半年的文章自动提示文章内容可能已过时
  articleTopTip: (frontmatter) => {
    const tip: Record<string, string> = {
      type: "warning",
      text: "文章发布较早，内容可能过时，阅读注意甄别。",
    };

    // 大于半年，添加提示
    const longTime = 6 * 30 * 24 * 60 * 60 * 1000;
    if (
      frontmatter.date &&
      Date.now() - new Date(frontmatter.date).getTime() > longTime
    )
      return tip;
  },

  // // 评论配置
  // comment: {
  //   provider: "twikoo",
  //   options: CommentData,
  // },
  comment: {
    provider: "render",
    // options: CommentData,
  },


  // // 公告
  // notice: {
  //   enabled: true, // 是否启用公告功能
  //   title: "公告", // 公告标题，支持函数式：需要和国际化搭配使用，根据不同语言环境返回不同标题
  //   initOpen: true,
  //   duration: 4000, // 弹框定时自动关闭，0 不自动消失
  //   mobileMinify: false, // 移动端自动最小化
  //   reopen: true, // 关闭公告弹框后，是否支持重新打开，如果为 false，则代表公告只显示一次
  //   useStorage: true, // 是否使用 localStorage 存储公告状态，如：当打开公告弹框后，下次进来则自动打开弹框
  //   twinkle: false, // 公告图标是否打开闪烁提示
  //   position: "center", // 公告弹框出现位置
  // },



  vitePlugins: {
    permalink: true,
    sidebar: true,


    sidebarOption: {
      initItems: false, //这条命令注释后，才会让文档和目录的样式保持一致
      collapsed: true, //打开侧边栏自动收缩功能
      ignoreList: [/^_.*$/],
      resolveRule: "rewrites",
      checkRewritesPrefix: true,
      ignoreIndexMd: true,
    },

    autoFrontmatter: true, // 自动生成 frontmatter
    // permalinkOption: {
    //   notFoundDelayLoad: 1000, // 1秒后加载
    // },

    // 自动格式formatter插件 添加文章封面图
    autoFrontmatterOption: {
      exclude: { title: true, }, // 排除自动生成字段
      transform: frontmatter => {
        // 如果文件本身存在了 coverImg，则不生成
        if (frontmatter.coverImg) return;

        const list = CoverImgList;

        const coverImg = list[Math.floor(Math.random() * list.length)];

        const transformResult = { ...frontmatter, coverImg };

        return Object.keys(transformResult).length ? transformResult : undefined;
      },
    },
  },

  markdown: {
    config: (md) => {
      md.use(timeline); //时间线插件
      md.use(groupIconMdPlugin); // 代码组图标插件
    },
    demo: {
      githubUrl: "https://github.com/Kele-Bingtang/vitepress-theme-teek/blob/master/docs",
    },
  },
  // siteAnalytics: [
  //   {
  //     provider: "baidu",
  //     options: {
  //       id: "d5ee872d9aa1ef8021f4a3921b2e9c2a",
  //     },
  //   },
  //   {
  //     provider: "google",
  //     options: {
  //       id: "G-K5GNDW3L7K",
  //     },
  //   },
  // ],


  // // 赞赏在文章下方
  appreciation: {
    position: "doc-after",
    options: {
      // buttonHtml: `<button>测试按钮</button>`,
      icon: "weChatPay", // 赞赏图标，内置 weChatPay 和 alipay
      expandTitle: "打赏作者", // 展开标题，支持 HTML
      collapseTitle: "下次一定", // 折叠标题，支持 HTML
      content: `<img src='/img/alipay/1.png'><img src='/img/alipay/2.png'>`, // 赞赏内容，支持 HTML
      expand: false, // 是否默认展开，默认 false
    },
  },

  // 单文章页banner功能
  articleBanner: {
    enabled: true, // 是否启用单文章页 Banner
    showCategory: true, // 是否展示分类
    showTag: true, // 是否展示标签
    defaultCoverImg: "", // 默认封面图
    defaultCoverBgColor: "", // 默认封面背景色，优先级低于 defaultCoverImg
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  rewrites: createRewrites({
    srcDir: 'docs',
  }),

  extends: teekConfig,
  title: "SeaHi", //左上角网站名称
  description: description,

  cleanUrls: false,  //设置为true就是让链接后不默认添加.html

  lastUpdated: true,
  lang: "zh-CN",
  head: HeadData as HeadConfig[],
  markdown: {
    // 开启行号
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: false,
    },
    // 更改容器默认值标题
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
    //表格主题


  },
  sitemap: {
    hostname: "https://docs.c-hi.cn",
    transformItems: items => {
      const permalinkItemBak: typeof items = [];
      // 使用永久链接生成 sitemap
      const permalinks = (globalThis as any).VITEPRESS_CONFIG.site.themeConfig.permalinks;
      items.forEach(item => {
        const permalink = permalinks?.map[item.url];
        if (permalink) permalinkItemBak.push({ url: permalink, lastmod: item.lastmod });
      });
      return [...items, ...permalinkItemBak];
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // logo: "/teek-logo-mini.svg",
    logo: "/seahi.ico",   //网站logo
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    // lastUpdatedText: "上次更新时间",
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    outline: {
      level: [2, 4],
      label: "本页导航",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    nav: Nav, // 导航栏配置    
    // socialLinks: [{ icon: "github", link: "https://github.com/Kele-Bingtang/vitepress-theme-teek" }],
    socialLinks: SocialLinks, // 社交链接配置
    sidebar: sidebarConfig, // 侧边栏配置



    search: {
      provider: "local",
      options: {
        miniSearch: {
          /**
           * @type {Pick<import('minisearch').Options, 'extractField' | 'tokenize' | 'processTerm'>}
           */
          options: {
            tokenize: (text) => {
              const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
              const result: string[] = []
              for (const it of segmenter.segment(text)) {
                if (it.isWordLike) {
                  result.push(it.segment)
                }
              }
              return result;
            }
          },
          /**
           * @type {import('minisearch').SearchOptions}
           * @default
           * { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
           */
          searchOptions: {
            fuzzy: 0.2, // 设置模糊搜索的容错率
            prefix: true, // 启用前缀匹配
            boost: {
              title: 4, // 标题字段的权重
              text: 3, // 正文内容的权重
              titles: 1, // 其他标题字段的权重
            },
            /* ... */
          }
        },
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },

    // algolia搜索
    // search: {
    //   provider: 'algolia',
    //   options: {
    //     appId: '6AC1N60WH4',
    //     apiKey: '90f7d1ece3094d290fe42fcaf6cdfd3c',
    //     indexName: 'onedayxyy',
    //     locales: {
    //       root: {
    //         placeholder: '搜索文档',
    //         translations: {
    //           button: {
    //             buttonText: '搜索文档',
    //             buttonAriaLabel: '搜索文档'
    //           },
    //           modal: {
    //             searchBox: {
    //               resetButtonTitle: '清除查询条件',
    //               resetButtonAriaLabel: '清除查询条件',
    //               cancelButtonText: '取消',
    //               cancelButtonAriaLabel: '取消'
    //             },
    //             startScreen: {
    //               recentSearchesTitle: '搜索历史',
    //               noRecentSearchesText: '没有搜索历史',
    //               saveRecentSearchButtonTitle: '保存至搜索历史',
    //               removeRecentSearchButtonTitle: '从搜索历史中移除',
    //               favoriteSearchesTitle: '收藏',
    //               removeFavoriteSearchButtonTitle: '从收藏中移除'
    //             },
    //             errorScreen: {
    //               titleText: '无法获取结果',
    //               helpText: '你可能需要检查你的网络连接'
    //             },
    //             footer: {
    //               selectText: '选择',
    //               navigateText: '切换',
    //               closeText: '关闭',
    //               searchByText: '搜索提供者'
    //             },
    //             noResultsScreen: {
    //               noResultsText: '无法找到相关结果',
    //               suggestedQueryText: '你可以尝试查询',
    //               reportMissingResultsText: '你认为该查询应该有结果？',
    //               reportMissingResultsLinkText: '点击反馈'
    //             },
    //           },
    //         },
    //       },
    //     },
    //   }
    // },


    // editLink: {
    //   text: "在 GitHub 上编辑此页",
    //   // pattern: "https://github.com/Kele-Bingtang/vitepress-theme-teek/edit/master/docs/:path",
    //   pattern: "https://onedayxyy.cn/teek/teek-one",
    // },
  },

  vite: {
    server: {
      // host: "127.0.0.1", // 指定服务器应该监听哪个 IP 地址
      // port: 5173, // 指定开发服务器端口
      // strictPort: true, // 若端口已被占用则会直接退出
      // open: true, // 运行后自动打开网页
    },

    // 构建
    build: {
      chunkSizeWarningLimit: 1500, // 限制警告的块大小
    },

    plugins: [
      // 自动注入一级前缀（rewrite模式）
      AutoFrontmatter({
        pattern: "**/*.md",
        // exclude 指定的对象如果在 markdown frontmatter 存在，则忽略该文件。当 include 和 exclude 存在相同文件时，exclude 优先级高
        //exclude: { coverImg: true},
        recoverTransform: true, // false 只添加不存在的字段
        // 返回一个新的 frontmatter 或只返回 undefined，如果返回 {}，则清空 MD 文件本身存在的 frontmatter
        transform: (frontMatter: Record<string, any>, fileInfo: FileInfo) => {

          // 定义需要处理的所有规则（可扩展多个）
          const rules: TransformRule[] = [
            { folderName: "01.开源项目", prefix: "/project/$uuid5", removeLevel: 99 }, // 清空前缀并且添加前缀使用随机数
            { folderName: "02.使用说明", prefix: "/user/$uuid5", removeLevel: 99 }, // 清空前缀并且添加前缀使用随机数
            { folderName: "10.STLink343", prefix: "/user/stlink343/$uuid5", removeLevel: 99 }, // 清空前缀并且添加前缀使用随机数
            { folderName: "模组烧录架", prefix: "/user/bruntools/$uuid5", removeLevel: 99 }, // 清空前缀并且添加前缀使用随机数
            { folderName: "20.教程", prefix: "/tutorial/$uuid5", removeLevel: 99 }, // 清空前缀并且添加前缀使用随机数
            { folderName: "涂鸦入门教程", prefix: "/tutorial/tuya/$uuid5", removeLevel: 99 }, // 清空前缀并且添加前缀使用随机数
            { folderName: "15.工具", prefix: "/tools/$uuid5", removeLevel: 99 }, // 清空前缀并且添加前缀使用随机数
            { folderName: "40.关于", prefix: "/about/$uuid5", removeLevel: 99 }, // 清空前缀并且添加前缀使用随机数
          ];
          // 应用规则转换
          return useTransformByRules(frontMatter, fileInfo, rules);

          /*            // 如果文件本身存在了 coverImg，则不生成
                      if (frontMatter.coverImg) return; // 随机获取 coverImg
                      const list = [...Wallpaper, ...BlogCover];
                      const coverImg = list[Math.floor(Math.random() * list.length)];
                      const transformResult = { ...frontMatter, coverImg };
                      console.log("transformResult", transformResult)
                      return Object.keys(transformResult).length
                          ? transformResult
                          : undefined;*/
        },
      }),

    ],

  },

  transformHtml: (code, id, context) => {
    if (context.page !== "404.md") return code;
    return code.replace("404 | ", "");
  },

});
