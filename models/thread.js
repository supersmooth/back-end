var mongoose = require('mongoose')
var Comment  = require('./comment')
var Schema = mongoose.Schema

// Thread schema
var threadSchema = mongoose.Schema({
    body      : String,
    date      : Date,
    author    : String,
    likes     : [String],
    comments  : [Comment.schema]
})

// Thread model
var threadModel = mongoose.model('Thread', threadSchema)

// Thread create middleware
function createThread(req, res, next) {
    var newThread = new threadModel({
        date: Date.now(),
        author: req.user.username,
        likes: [req.user.username],
        body: req.body.content
    })
    newThread.save(function (err, thread){
        if (err) console.log(err)
        req.user.threads.push(thread._id)
        req.user.save(function (err) {
            if (err) console.log(err)
            next()
        })
    })
}

// Thread find middleware
function findById(req, res, next) {
    threadModel
    .findById(req.params.thread)
    .exec(function(err, thread){
        if(err) console.log(err)
        if(thread){
            req.THREAD = thread
            next()
        }
        else {
            req.flash('message', 'Thread does not exist.')
            res.redirect('/')
        }
    })
}

function likeThread(req, res, next){
    if(req.THREAD.likes.indexOf(req.user.username) !== -1){
        req.flash('message', 'You have already liked that Thread.')
        next()
    } 
    else {
        console.log(req.THREAD.likes.indexOf(req.user.username))
        req.THREAD.likes.push(req.user.username)
        req.THREAD.save(function(err){
            if(err) console.log(err)
            next()
        })
    }
}

function likeThreadAjax(req, res, next){
    if(req.THREAD.likes.indexOf(req.user.username) !== -1){
        res.json({'status' : 'error', 'message' : 'You have already liked that Thread.'})
    }
    else{
        res.json({'status': 'success'})
        req.THREAD.likes.push(req.user.username)
        req.THREAD.save(function(err){
            if(err) console.log(err)
        })
    }
}

// exports
module.exports.model = threadModel
module.exports.create = createThread
module.exports.findById = findById
module.exports.like = likeThread
module.exports.likeAJAX = likeThreadAjax
