/**
 * 鉴于内容比较少
 * 评论表和用户表就写到一起了
 */
const Cmt = require("../models/comments").Cmt
const User = require("../models/comments").User
const transport = require("../config").transporter
const mailOption = require("../config").mailOption
const nodemailer = require("nodemailer")

module.exports.newAndSave = function (time, content, callback ) {
    var cmt = new Cmt()
    cmt.time = time
    cmt.content = content
    cmt.save(callback)
}

//对上面方法的优化方法
module.exports.newAndSaveUser = function (table, data, callback) {
    new table(data).save(callback)
}

module.exports.findByPage = function (page, cmt_show_counts, callback) {
    var pageIndex = parseInt(page - 1)
    var pageSkip = parseInt(cmt_show_counts) * pageIndex
    var rst = Cmt.find().sort({ 'time': -1 }).skip(pageSkip).limit(cmt_show_counts)

    rst.exec(function (err, rs) {
        if (err) {
            callback(err)
        } else {
            if (err) {
                callback(err)
            } else {
                callback(null, rs)
            }
        }
    })
}

module.exports.findCount = function (table,callback) {
    table.find({}, function (err, data) {
        if (err) {
            callback(err)
        }
        callback(null, data)
    })
}

//用户表查询
module.exports.queryIsExsit = function(query, callback) {
    User.findOne(query,function (err, data) {
        if (err) {
            callback(err)
        }
        callback(err, data)
    })
}
module.exports.emailSend163 = function (distmail, html, callback) {
    var transporter = nodemailer.createTransport(transport)
    mailOption.to = distmail
    mailOption.html = html
    transporter.sendMail(mailOption, callback)
}

