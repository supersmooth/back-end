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
    console.log(newThread)
    newThread.save(function (err, thread){
        if (err) console.log(err)
        req.user.threads.push(thread._id)
        req.user.save(function (err) {
            if (err) console.log(err)
            req.THREAD = thread
            next()
        })
    })
}

// Thread create api
function createThread_API(req, res){
    var newThread = new threadModel({
        date: Date.now(),
        author: req.user.username,
        likes: [req.user.username],
        body: req.body.content
    })

    res.json(newThread)

    newThread.save(function (err, thread){
        if (err) console.log(err)
        req.user.threads.push(thread._id)
        req.user.save(function (err) {
            if (err) console.log(err)
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

// Thread find middleware
function findById_API(req, res, next) {
    threadModel
    .findById(req.params.thread)
    .exec(function(err, thread){
        if(err) console.log(err)
        if(thread){
            req.THREAD = thread
            next()
        }
        else {
            res.json({'status' : 'error', 'message' : 'Thread does not exist.'})
        }
    })
}

function likeThread_API(req, res, next){
    if(req.THREAD.likes.indexOf(req.user.username) !== -1){
        res.json({'status' : 'error', 'message' : 'You have already liked that Thread.'})
    }
    else{
        req.THREAD.likes.push(req.user.username)
        req.THREAD.save(function(err){
            if(err) console.log(err)
            res.json({'status': 'success'})
        })
    }
}

function findComment_API(req, res, next){

    var comments = req.THREAD.comments

    for(var i=0; i<comments.length; i++){
        if(comments[i]['_id'] == req.params.comment){
            req.COMMENT = comments[i]
            return next()
        }
    }
    res.json({'status' : 'error', 'message' : 'Comment does not exist.'})
}

// exports
module.exports.model = threadModel
module.exports.create = createThread
module.exports.findById = findById
module.exports.like_API = likeThread_API
module.exports.create_API = createThread_API
module.exports.findById_API = findById_API
module.exports.findComment_API = findComment_API