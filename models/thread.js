var mongoose = require('mongoose')
var Comment  = require('./comment')
var Schema = mongoose.Schema

// Thread schema
var threadSchema = mongoose.Schema({
    body      : String,
    date      : Date,
    author    : String,
    likes     : Number,
    comments  : [Comment.schema]
})

// Thread model
var threadModel = mongoose.model('Thread', threadSchema)

// Thread create middleware
function createThread(req, res, next) {
    var newThread = new threadModel({
        date: Date.now(),
        author: req.user.username,
        likes: 1,
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
            req.flash('errorMessage', 'that thread page does not exist')
            res.redirect('/')
        }
    })
}

function likeThread(req, res, next){
    req.THREAD.likes +=1
    req.THREAD.save(function(err){
        if(err) console.log(err)
        next()
    })
}

// exports
module.exports.model = threadModel
module.exports.create = createThread
module.exports.findById = findById
module.exports.like = likeThread
