var mongoose = require('mongoose')
var Comment  = require('./comment')
var Schema = mongoose.Schema

// comment schema
var threadSchema = mongoose.Schema({
    body     : String,
    date     : Date,
    author   : { type: Schema.ObjectId, ref: 'User' },
    likes    : Number,

    comments : [Comment.schema]
})

// exports
module.exports = mongoose.model('Thread', threadSchema)