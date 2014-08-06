var mongoose = require('mongoose')
var Schema = mongoose.Schema

// comment schema
var commentSchema = mongoose.Schema({
    body      : String,
    date      : Date,
    author    : { type: Schema.ObjectId, ref: 'User' },
    authorName: String,
    likes     : Number,
    isDeleted : Boolean,
    respondsTo: {type: Schema.ObjectId, ref: 'User' },
    replies   : [{ type: Schema.ObjectId, ref: 'Comment' }]
})

var commentModel = mongoose.model('Comment', commentSchema)

function createComment(req, res, next){
    var newComment = new commentModel({
        body: req.body.body,
        author: req.user,
        authorName: req.user.username,
        date: Date.now(),
        likes: 1
    })
    req.THREAD.comments.push(newComment)
    req.THREAD.save(function (err) {
        if(err) console.log(err)
        next()
    })
}

// exports
module.exports.model = commentModel
module.exports.schema = commentSchema
module.exports.create = createComment