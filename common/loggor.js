const config = require("../config")
const log4js = require("log4js")
const path = require("path")

log4js.configure({
    //输出位置的基本信息
    appenders:{
        // 设置控制台输出（默认不输出）
        out: { type: "console" },
        //所有日志记录，文件类型file   文件最大值maxLogSize 单位byte (B->KB->M) backups:备份的文件个数最大值,最新数据覆盖旧数据
        allLog: { type: 'file', filename: config.logPath, keepFileExt: true, maxLogSize: 10485760, backups: 3 },
        //http请求日志  http请求日志需要app.use引用一下， 这样才会自动记录每次的请求信息 
        httpLog: { type: "dateFile", filename: config.http_LogPath, pattern: ".yyyy-MM-dd", keepFileExt: true },
        //错误日志 type:过滤类型logLevelFilter,将过滤error日志写进指定文件
        errorLog: { type: 'file', filename: config.err_logPath },
        error: { type: "logLevelFilter", level: "error", appender: 'errorLog' }
    },
    //不同等级的日志追加到不同的输出位置：appenders: ['out', 'allLog']  categories 作为getLogger方法的键名对应
    categories: {
        //appenders:采用的appender,取上面appenders项,level:设置级别
        http: { appenders: ['out', 'httpLog'], level: "debug" },
        default: { appenders: ['out', 'allLog', 'error'], level: 'debug' }, //error写入时是经过筛选后留下的
    }

})

const logger = log4js.getLogger("liveMeeting");

const httpLog = log4js.getLogger('http');
const httpLogger = log4js.connectLogger(httpLog, { level: 'WARN' });

exports = module.exports = { logger, httpLogger };
