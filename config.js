/**
 * 项目配置信息
 */
var config = {
    
    debug: false,

    // 程序运行的端口
    port: 3000,
    //mongodb配置
    db: 'mongodb://127.0.0.1/node_club_dev',

    all_logPath: "/common/log/allLog.log",
    err_logPath:"/common/log/errLog.log",
    http_LogPath: "/common/log/httpLog.log",

    // RSS配置
    rss: {
        title: 'CNode：Node.js专业中文社区',
        link: 'http://cnodejs.org',
        language: 'zh-cn',
        description: 'CNode：Node.js专业中文社区',
        //最多获取的RSS Item数量
        max_rss_items: 50
    },

    /**
     * 业务数据
     */
    transporter:{
        service: "163",
        auth: {
            user: "wenbruier@163.com",
            pass: ""
        }
    },
    mailOption : {
        from: '',//发件人邮箱
        to: '',           //收件人邮箱，多个邮箱地址间用','隔开
        subject: '注册邮箱验证',           //邮件主题
    },

    top_soup: "假如再也见不到你，祝你早安，午安，晚安！",
    nav_left: [
        "呐，荔枝",
        "生命不息"
    ],
    // 限制评论条数
    cmt_counts_limit: 100,
    // 展示评论数
    cmt_show_counts: 5,
    //限制评论字数
    cmt_size_limit: 100,
    //限制用户数
    user_counts_limit: 500 ,

    //主页跳动字体，最多8个，不然要改css文件
    throb_char:['R','U','I','E','R'],

    name: '', // title
    description: '', // 网站的描述
    keywords: '',

    // 添加到 html head 中的信息
    site_headers: [
        '<meta name="author" content="ruier"/>'
    ],

    startTime: {
        y: 2020,
        m: 4,
        d: 20
    },
    collapse:[
        {
            count: "collapse1",
            name:"昆明理工大学",
            value: {
                ">>充网费": "http://wysf.kmust.edu.cn/xysf/",
                ">>新系统": "https://cas.kmust.edu.cn/lyuapServer/login?service=https%3A%2F%2Fcas.kmust.edu.cn%2Fshunt%2Findex.jsp",
                ">>网络教学平台": "https://wljx.kmust.edu.cn/"
            }
        },
        {
            count: "collapse2",
            name: "编程相关",
            value: {
                ">>码云": "https://gitee.com/Run_er",
                ">>coplar内网穿透": "https://www.cpolar.com/docs",
                ">>免费天气API": "http://api.help.bj.cn/api/",
                ">>小程序开发": "https://console.newdao.net/x5/UI2/v_/portal/index.w?$skin=newdao#!main",
                ">>MDN": "https://developer.mozilla.org/zh-CN/",
                ">>Hello Github": "https://hellogithub.com/"

            }
        },
        {
            count: "collapse3",
            name: "实用工具",
            value: {
                ">> 跨平台分享工具": "https://cp.anyknew.com",
                ">> 免费商用字": "https://www.zitijia.com/t/%E5%85%8D%E8%B4%B9%E5%95%86%E7%94%A8",
                ">> 学术搜索镜像": "http://www.4243.net/",
                ">> 抠图": "https://www.remove.bg/zh",
                ">> 寻麓": "https://xulu.ltd/ziyuan.html",
                ">> 数学知道": "https://www.wolframalpha.com/"
            }
        },
        {
            count: "collapse4",
            name: "开发文档",
            value: {
                ">> Node开发文档": "https://www.nodeapp.cn/http.html",
                ">> echarts开发文档": "https://www.echartsjs.com/zh/option.html#title",
                ">> three.js开发文档": "http://www.yanhuangxueyuan.com/threejs/docs/index.html",
                ">> 微信小程序开发": "https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html",
                ">> FineBI数据分析": "https://www.finebi.com/"
            }
        }
    ]
}

// if (process.env.NODE_ENV === 'test') {
//     config.db = 'mongodb://127.0.0.1/node_club_test';
// }

module.exports = config
