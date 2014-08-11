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

// create comment API
// should save comment reference on creator?
function createComment_API(req, res){
    var newComment = new commentModel({
        body: req.body.body,
        author: req.user.username,
        likes: [req.user.username],
        date: Date.now(),
    })
    req.THREAD.comments.push(newComment)
    req.THREAD.save(function (err, comment){
        if(err){
            console.log(err)
            res.json({'status' : 'error', 'message' : 'server error, try again'})
        }
        else res.json({'status' : 'success', 'message' : 'Comment created.'})
    })
}

function like_API(req, res){

    if(req.COMMENT.likes.indexOf(req.user.username) !== -1){
        return res.json({'status' : 'error', 'message' : 'You have already liked that Comment.'})
    }

    req.COMMENT.likes.push(req.user.username)
    req.THREAD.save(function(err){
        if(err) console.log(err)
        return res.json({'status': 'success'})
    })
}

// exports
module.exports.model = commentModel
module.exports.schema = commentSchema
module.exports.create = createComment

module.exports.like_API = like_API
module.exports.create_API = createComment_API
