// nav导航栏配置
import { TeekIcon, VdoingIcon, SSLIcon, BlogIcon } from "./icon/NavIcon";
export const Nav = [
    { text: "🏡首页", link: "/" },





    // 笔记
    {
      text: '📚文档',
      items: [
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/linux.svg" alt="" style="width: 16px; height: 16px;">
              <span>运维</span>
            </div>
            `,
          link: '/linux/linux-index',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/前端.svg" alt="" style="width: 16px; height: 16px;">
              <span>前端</span>
            </div>
            `,
          link: '/qianduan/qianduan-index',
        },
                {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/编程.svg" alt="" style="width: 16px; height: 16px;">
              <span>编程</span>
            </div>
            `,
          link: '/code/code-index',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/黑客.svg" alt="" style="width: 16px; height: 16px;">
              <span>黑客</span>
            </div>
            `,
          link: '/hacker/hacker-index',
        },
      ],
    },  

    // 专题
    {
      text: '🛠️专题',
      items: [
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/teek.svg" alt="" style="width: 16px; height: 16px;">
              <span>hugo-teek</span>
            </div>
            `,
          link: '/hugo-teek/jieshao',
        },         
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/teek.svg" alt="" style="width: 16px; height: 16px;">
              <span>Teek</span>
            </div>
            `,
          link: '/teek/teek-blog',
        },        
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/博客.svg" alt="" style="width: 16px; height: 16px;">
              <span>博客搭建</span>
            </div>
            `,
          link: '/zhuanti/blog-index',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/前端demo.svg" alt="" style="width: 16px; height: 16px;">
              <span>前端demo</span>
            </div>
            `,
          link: '/zhuanti/qianduan-demo',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/Git.svg" alt="" style="width: 16px; height: 16px;">
              <span>Git</span>
            </div>
            `,
          link: '/zhuanti/git',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/面试.svg" alt="" style="width: 16px; height: 16px;">
              <span>面试题</span>
            </div>
            `,
          link: '/zhuanti/mianshiti',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/NAS.svg" alt="" style="width: 16px; height: 16px;">
              <span>NAS</span>
            </div>
            `,
          link: '/zhuanti/NAS',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/脚本.svg" alt="" style="width: 16px; height: 16px;">
              <span>脚本</span>
            </div>
            `,
          link: '/zhuanti/jiaoben',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/工具.svg" alt="" style="width: 16px; height: 16px;">
              <span>工具</span>
            </div>
            `,
          link: '/tools/tools-index',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/开源项目.svg" alt="" style="width: 16px; height: 16px;">
              <span>开源项目</span>
            </div>
            `,
          link: '/zhuanti/opensource',
        },   
        {
          text: '😂Emoji 表情库',
          link: '/tools/emoji',
        },         
      ],
    },  







    // 生活
    {
      text: '🏓生活',
      items: [
        {
          // 分组标题1
          text: '娱乐',
          items: [
            {
              text: `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <img src="/img/nav/相册.svg" alt="" style="width: 16px; height: 16px;">
                  <span>相册</span>
                </div>
                `,
              link: '/yule/photo',
            },
            {
              text: `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <img src="/img/nav/电影.svg" alt="" style="width: 16px; height: 16px;">
                  <span>电影</span>
                </div>
                `,
              link: '/yule/movie',
            },
            {
              text: `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <img src="/img/nav/音乐.svg" alt="" style="width: 16px; height: 16px;">
                  <span>音乐</span>
                </div>
                `,
              link: '/yule/music',
            },
          ],
        },
        {
          // 分组标题2
          text: '小屋',
          items: [
            {
              text: `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <img src="/img/nav/精神小屋.svg" alt="" style="width: 16px; height: 16px;">
                  <span>精神小屋</span>
                </div>
                `,
              link: '/love/inner',
            },
            {
              text: `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <img src="/img/nav/时间管理.svg" alt="" style="width: 16px; height: 16px;">
                  <span>时间管理</span>
                </div>
                `,
              link: '/love/time-plan',
            },
            {
              text: `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <img src="/img/nav/文案.svg" alt="" style="width: 16px; height: 16px;">
                  <span>情感文案</span>
                </div>
                `,
              link: '/love/wenan',
            },
            // { text: "💖情侣空间", link: "https://fxj.onedayxyy.cn/" },
          ],
        },
        // 兴趣
        {
          text: '兴趣',
          items: [
            {
              text: `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <img src="/img/nav/旅行.svg" alt="" style="width: 16px; height: 16px;">
                  <span>旅行</span>
                </div>
                `,
              link: '/xingqu/travel',
            },
            {
              text: `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <img src="/img/nav/读书.svg" alt="" style="width: 16px; height: 16px;">
                  <span>读书</span>
                </div>
                `,
              link: '/xingqu/reading',
            },
          ],
        },  

      ],
    },  


    // // 兴趣
    // {
    //   text: '🎨兴趣',
    //   items: [
    //     {
    //       text: `
    //         <div style="display: flex; align-items: center; gap: 4px;">
    //           <img src="/img/nav/旅行.svg" alt="" style="width: 16px; height: 16px;">
    //           <span>旅行</span>
    //         </div>
    //         `,
    //       link: '/xingqu/travel',
    //     },
    //     {
    //       text: `
    //         <div style="display: flex; align-items: center; gap: 4px;">
    //           <img src="/img/nav/读书.svg" alt="" style="width: 16px; height: 16px;">
    //           <span>读书</span>
    //         </div>
    //         `,
    //       link: '/xingqu/reading',
    //     },
    //   ],
    // },  
    
    
    // 索引
    {
      text: '👏索引',
      items: [
        { text: '📃分类页', link: '/categories' },
        { text: '🔖标签页', link: '/tags' },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/归档.svg" alt="" style="width: 16px; height: 16px;">
              <span>归档页</span>
            </div>
            `,
          link: '/archives',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/清单.svg" alt="" style="width: 16px; height: 16px;">
              <span>清单页</span>
            </div>
            `,
          link: '/articleOverview',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/登录.svg" alt="" style="width: 16px; height: 16px;">
              <span>登录页</span>
            </div>
            `,
          link: '/login',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/风险提示.svg" alt="" style="width: 16px; height: 16px;">
              <span>风险链接提示页</span>
            </div>
            `,
          link: '/risk-link?target=https://onedayxyy.cn/',
        },
      ],
    },  

    // 关于
    {
      text: '🍷关于',
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
        { text: '🎉关于本站', link: '/about/website' },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/友链.svg" alt="" style="width: 16px; height: 16px;">
              <span>友链</span>
            </div>
            `,
          link: '/about/friend-links',
        },        
        { text: '🌐网站导航', link: '/about/websites' },          
        { text: "👂留言区", link: "/about/liuyanqu" },
        { text: "💡思考", link: "/about/thouht" },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/情侣相册.svg" alt="" style="width: 16px; height: 16px;">
              <span>情侣相册</span>
            </div>
            `,
          link: '/about/love',
        },        
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/时间轴.svg" alt="" style="width: 16px; height: 16px;">
              <span>时间轴</span>
            </div>
            `,
          link: '/about/time-line',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/朋友圈.svg" alt="" style="width: 16px; height: 16px;">
              <span>朋友圈</span>
            </div>
            `,
          link: '/about/pyq',
        },        
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/网站统计.svg" alt="" style="width: 16px; height: 16px;">
              <span>网站统计</span>
            </div>
            `,
          link: 'https://umami.onedayxyy.cn/share/DzS4g85V8JkxsNRk/onedayxyy.cn',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/站点监控.svg" alt="" style="width: 16px; height: 16px;">
              <span>站点监控</span>
            </div>
            `,
          link: 'https://status.onedayxyy.cn/status/monitor',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/网盘.svg" alt="" style="width: 16px; height: 16px;">
              <span>网盘</span>
            </div>
            `,
          link: 'https://zdir.onedayxyy.cn/',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/恋爱.svg" alt="" style="width: 16px; height: 16px;">
              <span>情侣恋爱计时器</span>
            </div>
            `,
          link: '/about/ql-timer',
        },  
      ],
    },       
  ]
