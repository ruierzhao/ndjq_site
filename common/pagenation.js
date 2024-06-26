const cmt = require("../proxy/comments")
const Cmt = require("../models/comments")

var comments_counts
cmt.findCount(Cmt, function(err, data) {
    if (err) {
        console.log("DB connect error!");
    }else{
        comments_counts = data
    }

})

module.exports = {
    comments_counts : comments_counts
}
