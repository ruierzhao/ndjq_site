/**
 * 鉴于内容比较少
 * 评论表和用户表就写到一起了
 */
const mongoose = require("mongoose")
const config = require("../config")

if (config.debug) {
    mongoose.connect("mongodb://127.0.0.1/test", { UseNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err) {
            return console.log("connection is Error!");
        }
        console.log("OK");
    })
}else{
    mongoose.connect("mongodb://127.0.0.1/wenb", { UseNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err) {
            return console.log("connection is Error!");
        }
        console.log("OK");
    })
}

var Schema = mongoose.Schema

var cmtSchema = new Schema({
    time: { type: Date,  required: true },
    content: { type: String, required: true }
})

//文件上传下载
var file = new Schema({
    originalname: { type: String,},
    filename: { type: String,},
    tiqcode: { type: Number,},
})

/**
 * gender@param
 * -1 : 保密
 * 0 ：男
 * 1 ： 女
 * 
 * status @param
 * 0 没有权限限制
 * 1 不可以评论
 * -1 不可以登录
 */

var userSchema = new Schema({
    nickname: { type: String, required: true, },
    name: { type: String, default: ""},
    email:{type: String, required:true},
    pswd:{type:String,required:true},
    update_time:{type:String,default:Date.now},
    avator:{type:Array, default:["/public/img/default_avator.jpg"]},
    gender:{type:Number, enum:[-1, 0, 1], default:-1},
    bio:{type:String, default:""},
    education: { type: String, default: "" },
    graschool: { type: String, default:""},
    birthday: { type: String, default: "" },
    status: { type: Number, enum: [-1, 0, 1], default: 0},
})

module.exports.Cmt = mongoose.model("Comment", cmtSchema)
module.exports.User = mongoose.model("User", userSchema)
module.exports.File = mongoose.model("File", file)
