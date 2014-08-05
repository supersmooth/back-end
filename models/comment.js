var mongoose = require('mongoose')

// comment schema
var commentSchema = mongoose.Schema({
    body     : String,
    date     : Date,
    author   : String,
    likes    : Number,
    
    comments : [commentSchema]
})

// exports
module.exports.model = mongoose.model('Comment', commentSchema)
module.exports.shcema = commentSchema