var mongoose = require('mongoose')
var Schema = mongoose.Schema

// comment schema
var commentSchema = mongoose.Schema({
    body     : String,
    date     : Date,
    author   : { type: Schema.ObjectId, ref: 'User' },
    likes    : Number,
    
    respondsTo: {type: Schema.ObjectId, ref: 'User' },

    replies : [{ type: Schema.ObjectId, ref: 'Comment' }]
})

// exports
module.exports.model = mongoose.model('Comment', commentSchema)
module.exports.schema = commentSchema