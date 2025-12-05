import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SeaHi的个人资料站",
  description: "在线文档",
  
  themeConfig: {
    logo: { light: "/Seahi_d.png", dark: "/Seahi.png" },
    /*搜索框 */
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
    // 页脚配置内容
    footer: {
      copyright: '版权所有 © 2025-至今 莫石海',
      message: 'Released under the MIT License.',
    },

    lastUpdated: {
      text: '最后更新于',
    },
    
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    outline: {
      label: "文档导航",
      level: "deep"
      },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SeaHi-Mo' }
    ]
  }
})
