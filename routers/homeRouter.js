const express = require("express")
const site = require("../controllers/site")
const config = require("../config")
const multer = require("multer")

var homeRouter = express.Router()

//主页
homeRouter.get("/", site.index)

//留言路由
homeRouter.post("/publish", site.publish)
homeRouter.get("/page", site.page)

//登录注册
homeRouter.post("/login", site.login)
homeRouter.post("/register", site.register)
homeRouter.get("/queryNkname", site.queryNkname)
homeRouter.get("/queryEmail", site.queryEmail)
homeRouter.post("/authcode", site.authcode)

//用户中心
homeRouter.get("/i", site.rendUser)

homeRouter.get("/i/updatEmail", function (req, res) {
    if (!req.session.user) {
        return res.render("home/logout.html")
    }
    res.render("home/updatEmail.html",{
        email: req.session.user.email
    })
})
homeRouter.post("/i/modifyEmail", site.modifyEmail)
homeRouter.get("/i/updateUser", site.updateUser)
homeRouter.post("/i/modifyUser", site.modifyUser)
homeRouter.get("/logout", function (req, res) {
    req.session.destroy()
    res.redirect("/")
})

/**
 * 文件上传下载upload
 */
homeRouter.post("/upload", multer({ dest: "file" }).single("file"), site.upload)
homeRouter.get("/download", site.download)
/**
 * 文件上传下载
 */
    
//杂项
homeRouter.get("/gcoord", function (req, res) {
    res.render("home/gcoord.html")
})

homeRouter.get("/typing_waltz", function (req, res) {
    res.render("home/typing_waltz.html")
})

homeRouter.get("/articleMake", function (req, res) {
    res.render("home/articleMake.html")
})

homeRouter.get("/paintfunct", function (req, res) {
    res.render("home/paintFunct.html")
})
homeRouter.get("/paintlove", function (req, res) {
    res.render("home/paintlove.html")
})
homeRouter.get("/bullet", function (req, res) {
    res.render("home/bullet.html")
})
homeRouter.get("/line", function (req, res) {
    res.render("home/line.html")
})

homeRouter.get("/timeCorona", function (req, res) {
    res.render("home/timeCorona.html")
})

homeRouter.get("/rotateImg", function (req, res) {
    res.render("home/rotateImg.html")
})


homeRouter.get("/loveLimit", function (req, res) {
    res.render("home/loveLimit.html",{
        startTime: config.startTime
    })
})

homeRouter.get("/echartsmap", function (req, res) {
    res.render("home/echartsmap.html")
})

homeRouter.get("/echartsmap", function (req, res) {
    res.render("home/echartsmap.html")
})

homeRouter.get("/heaven", function (req, res) {
    res.render("home/heaven.html")
})

homeRouter.get("/wzry", function (req, res) {
    res.render("home/wzry.html")
})
homeRouter.get("*", function (req, res) {
    res.render("home/404.html")
})

module.exports = homeRouter
