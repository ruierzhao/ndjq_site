const config = require("../config")
const Cmt = require("../models/comments").Cmt
const User = require("../models/comments").User
const File = require("../models/comments").File
const proxy_cmt = require("../proxy/comments")
const MD5 = require("blueimp-md5")

/**
 * 数据库status_code @param
 * 0 : 正常
 * 1 ： 数据库错误
 * -1 ：验证码错误（之后做法）
 * -1 ：超出存储限制（原计划）
 */


var show_counts = config.cmt_show_counts
var cmt_counts_limit = config.cmt_counts_limit
var user_counts_limit = config.user_counts_limit

module.exports.index = function (req, res) {
    res.render("home/index.html", {
        top_soup: config.top_soup,
        nav_laft: config.nav_left,
        throb_char: config.throb_char,
        collapse: config.collapse,
        cmt_size_limit: config.cmt_size_limit,
        cmt_counts_limit: cmt_counts_limit,
        user: req.session.user
    })
}

//留言请求处理
module.exports.publish = function (req, res) {
    var time = req.body.time
    var content = req.body.content

    proxy_cmt.findCount(Cmt, function (err, data) {
        var cmt_counts = data.length
        
        if (cmt_counts <= cmt_counts_limit) {
            proxy_cmt.newAndSave(time, content, function (err) {
                if (err) {
                    return res.send({ status_code: 1 })//数据库问题
                }
                res.send({ status_code: 0, show_counts: config.cmt_show_counts,size: Math.ceil(cmt_counts / show_counts) })
            })
        } else {
            res.send({ status_code: -1 })//超限
        }
    })
}

//获取分页显示数据
module.exports.page = function (req, res) {
    proxy_cmt.findByPage(req.query.page, config.cmt_show_counts, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            jsonArray = { row: data }
            res.json(jsonArray);
        }
    })
}

//注册处理
module.exports.register = function(req, res) {
    req.body.pswd = MD5(MD5(req.body.pswd)+"ruier")

    if ( req.session.authcode != req.body.authcode ) {
        return res.json({ status_code: -1 })
    }else{
        proxy_cmt.newAndSaveUser(User, req.body, function (err) {
            if (err) {
                return res.send({ status_code: 1 })
            }
            res.send({ status_code: 0, })
        })
    }
}
module.exports.queryNkname = function (req, res) {
    proxy_cmt.queryIsExsit({nickname: req.query.nickname}, function(err, data) {
        if (err) {
            return res.json({ status_code: 1, msg: "数据库错误！" })
        }
        if (data) {
            res.json({ status_code: 0 }) //数据已存在
        } else {
            res.json({ status_code: 2 }); //可以注册
        }
    })
}
module.exports.queryEmail = function (req, res) {
    proxy_cmt.queryIsExsit({ email: req.query.email }, function (err, data) {
        if (err) {
            return res.json({ status_code: 1, msg: "数据库错误！" })
        }
        if (data) {
            res.json({ status_code: 0 }) //数据已存在
        }else{
            res.json({ status_code: 2 }); //可以注册
        }
    })
}
module.exports.authcode = function (req, res) {
    req.session.authcode = null
    var email = req.body.email
    //生成验证码保存 session
    var authcode = parseInt((Math.random() * 9 + 1) * 100000)
    req.session.authcode = authcode

    //发送Email
    var html = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        </head>
        <body>
        <h1>wenb注册验证</h1>
        <hr>
        <h4>您好：${email}！</h4>
        <h4>欢迎注册！</h4>
        <h4>请将验证码填写到页面上。</h4>
        <h4>验证码：${authcode}</h4>
        <h4>注意：验证码5 分钟内有效。</h4>
        <p><b>tip :</b>如非你本人操作，请忽略!</p>
        <hr>
        </body>
        </html>`
    proxy_cmt.emailSend163(email, html, function (err) {
        if (err) {
            return res.json({ "status_code": 1})
        }else{
            setTimeout(() => {
                req.session.authcode = null
            }, 5*60);
            return res.json({ "status_code": 0 })
        }
    })
}

//登录请求处理
module.exports.login = function (req, res) {
    var pswd = MD5(MD5(req.body.pswd) +  "ruier")
    proxy_cmt.queryIsExsit({ email: req.body.email, pswd: pswd }, function (err, data) {
        if (err) {
            return res.json({ status_code: 1, msg: "数据库错误！" })
        }
        if (data) {
            req.session.user = data
            res.json({ status_code: 0 }) //数据匹配，登录成功
        } else {
            res.json({ status_code: 2 }); //没有，密码错误
        }
    })
}

//个人中心
module.exports.rendUser = function (req, res) {
    if (!req.session.user) {
        return res.render("home/logout.html")
    }else{
        var email = req.session.user.email

        User.findOne({ "email": email }, function (err, data) {
            if (err) {
                return res.render("home/logout.html")
            }
            res.render("home/user.html", {
                userinfo: data
            })
        })
    }
}
module.exports.updateUser = function (req, res) {
    if (!req.session.user.email) {
        res.render("home/logout.html")
    } else {
        User.findOne({ "email": req.session.user.email }, function (err, data) {
            if (err) {
                console.log(err);
            }
            res.render("home/updateUser.html", {
                user: data
            })
        })
    }
}
module.exports.modifyUser = function (req, res) {
    var email = req.body.email
    var nickname = req.body.nickname
    User.findOne({nickname:nickname},function(err, rst){
        if (err) {
            return res.json({ status_code: -1 })
        }
        if (!rst) {
            User.findOneAndUpdate({
                email: email
            }, {
                $set: req.body
            }, {}, function (err, data) {
                if (err) {
                    return res.json({ status_code: -1 })
                }
                if (!data) {
                    res.json({ status_code: 1 })
                } else {
                    res.json({ status_code: 0 })
                }
            })
        }else{
            res.json({ status_code: 2 })
        }
        
    })
    
}
module.exports.modifyEmail = function (req, res) {
    var authcode = req.body.authcode
    var email = req.body.newemail
    var nickname = req.session.user.nickname
    var pswd = MD5(MD5(req.body.pswd) + "ruier")
    var newPswd = MD5(MD5(req.body.origpswd) + "ruier")
    var setData = {
        email: email,
        pswd: newPswd
    }
    
    if (authcode != req.session.authcode) {
        return res.json({ status_code: 2 })//验证码错误
    }
    User.findOneAndUpdate({
        nickname: nickname,
        pswd: pswd
    }, {
        $set: setData
    }, {}, function (err, data) {
        if (err) {
            return res.json({ status_code: -1 })
        }
        if (!data) {
            res.json({ status_code: 1 })
        } else {
            res.json({ status_code: 0 })
        }
    })
}

/**
 * 文件上传 下载
 */
module.exports.upload = function (req, res) {
    var tiqcode = parseInt((Math.random() * 9 + 1) * 100000)
    var file = {
        originalname: req.file.originalname,
        tiqcode: tiqcode,
        filename: req.file.filename
    }
    proxy_cmt.newAndSaveUser(File, file, function (err) {
        if (err) {
            return res.send({ status_code: 1 })//数据库问题
        }
        res.send({ status_code: 0, tiqcode: tiqcode })
    })
}
module.exports.download = function (req, res) {
    var tiqcode = req.query.tiqucode
    
    File.findOne({ tiqcode: tiqcode},function(err,data) {
        if (err) {
            let msg = "数据库错误！"
            return res.send(`<h6 style="color:red;text-align:center">${msg}</h6>`)
        }
        if (data) {
            var dldfilename = data.filename
            var dldoriginalname = data.originalname

            var dldPath = "file/" + dldfilename

            res.download(dldPath, dldoriginalname,(err)=>{
                if (err) {
                    console.log(err);
                }
            })
        } else {
            let msg = "提取码错误！请检查"

            res.send(`<h6 style="color:red;text-align:left">${msg}</h6>`) //没有，提取码错误
        }
    })
}