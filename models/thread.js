var mongoose = require('mongoose')
var Comment  = require('./comment')
var Schema = mongoose.Schema

// Thread schema
var threadSchema = mongoose.Schema({
    body      : String,
    date      : Date,
    author    : { type: Schema.ObjectId, ref: 'User' },
    authorName: String,
    likes     : Number,
    comments  : [Comment.schema]
})

// Thread model
var threadModel = mongoose.model('Thread', threadSchema)

// Thread create middleware
function createThread(req, res, next) {
    var newThread = new threadModel({
        date: Date.now(),
        author: req.user._id,
        authorName: req.user.username,
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

// exports
module.exports.model = threadModel
module.exports.create = createThread
