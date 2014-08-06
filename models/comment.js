var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Comment schema
var commentSchema = mongoose.Schema({
    body      : String,
    date      : Date,
    author    : String,
    likes     : Number,
    isDeleted : Boolean,
    respondsTo: {type: Schema.ObjectId, ref: 'User'},
    replies   : [{ type: Schema.ObjectId, ref: 'Comment' }]
})

// Comment model
var commentModel = mongoose.model('Comment', commentSchema)

// Comment create
function createComment(req, res, next){
    var newComment = new commentModel({
        body: req.body.body,
        author: req.user.username,
        likes: 1,
        date: Date.now(),
    })
    req.THREAD.comments.push(newComment)
    req.THREAD.save(function (err, comment){
        if(err) console.log(err)
        next()
    })
}

// exports
module.exports.model = commentModel
module.exports.schema = commentSchema
module.exports.create = createComment