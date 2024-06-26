
const express = require("express")
const session = require("express-session")
const path = require("path")
const homeRouter = require("./routers/homeRouter")
const config = require("./config")
const bodyParser = require("body-parser")
// const comments_counts = require("./common/pagenation")
// const logger = require("./common/loggor").logger
// const httpLogger = require("./common/loggor").httpLogger

var app = express()

// app.all("*", function (req, res, next) {
   
//     res.header("Access-Control-Allow-Origin","*");
//     //允许的header类型
//     res.header("Access-Control-Allow-Headers", "content-type");
//     //跨域允许的请求方式 
//     res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
//     if (req.method == 'options')
//         res.send(200);  //让options尝试请求快速结束
//     else
//         next();
// })

//session
app.use(session({
    secret: "wenbruier",
    resave: false,
    saveUninitialized: true,
    cookie: ('/', 'value', { maxAge: 30 * 60 * 1000, secure: false })
}));

//静态文件目录
var publicDir = path.join(__dirname, "./public/")
var node_modulesDir = path.join(__dirname, "./node_modules/")
var viewsDir = path.join(__dirname, "./views")

// app.use(httpLogger);

app.use("/public/", express.static(publicDir))
app.use("/node_modules/", express.static(node_modulesDir))

app.engine("html", require("express-art-template"))
app.set("views", viewsDir)

// 解析 application/json
app.use(bodyParser.json({ limit: "2mb" }));
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit:"2mb" }));

app.use(homeRouter)

if (!module.parent) {
    app.listen(config.port, function () {
        // logger.info("Server is running on port 3000....");
        console.log("Server is running on port 3000....");
    })
}

