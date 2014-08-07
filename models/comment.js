var mongoose = require('mongoose')
var User = require('./user')
var Schema = mongoose.Schema

// Comment schema
var commentSchema = mongoose.Schema({
    body      : String,
    date      : Date,
    author    : String,
    likes     : [String],
    isDeleted : Boolean,
    respondsTo: {type: Schema.ObjectId, ref: 'User'},
    replies   : [{ type: Schema.ObjectId, ref: 'Comment' }]
})

// Comment model
var commentModel = mongoose.model('Comment', commentSchema)

// refactor this refactor this refactor this
// Comment create
function createComment(req, res, next){
    var newComment = new commentModel({
        body: req.body.body,
        author: req.user.username,
        likes: [req.user.username],
        date: Date.now(),
    })
    req.THREAD.comments.push(newComment)
    req.THREAD.save(function (err, comment){
        if(err) console.log(err)
        //
        User.model
        .findOne({ 'username': comment.author})
        .exec(function(err, user){
            if(err) console.log(err)
            if(user) {
                user.comments.push(comment)
                user.save(function(err){
                    if(err) console.log(err)
                    next()
                })
            }
            else {
                req.flash('message', 'Profile page does not exist')
                res.redirect('/')
            }
        })
    })
}

function getComment(req, res, next){
    //todo
}

function likeComment(req, res, next){
    //todo
}

// exports
module.exports.model = commentModel
module.exports.schema = commentSchema
module.exports.create = createComment
module.exports.get = getComment
module.exports.like = likeComment
