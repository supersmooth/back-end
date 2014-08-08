var User = require('./models/user')
var Thread  = require('./models/thread')
var Comment  = require('./models/comment')
var async = require('async')
var authUtils = require('./authentication/utils')

module.exports = function(app){

	// 'like' thread 
    app.post('/api/thread/:thread/like', authUtils.isLoggedIn_API, Thread.findById_API, Thread.like_API)

    // handles thread creation
    app.post('/api/thread', authUtils.isLoggedIn_API, Thread.create_API)

    //users threads query
    app.get('/api/u/:username/thread', User.getThreads_API)

    // create comment
    app.post('/api/thread/:thread/comment', Thread.findById_API, Comment.create_API)

    // 'like comment'
    //TODO TODO TODO
    app.post('/api/thread/:thread/comment/:comment', Thread.findById_API)

    // add friend
    //TODO TODO TODO
    app.put('/api/u/:username/add', authUtils.isLoggedIn_API, User.findByUsername_API)

    // 404 page
    app.get('*', function (req, res) {
        res.status(404).render('404')
    })
}