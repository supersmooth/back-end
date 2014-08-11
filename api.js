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
    //example: localhost:5000/api/u/testaccount/thread?offset=1&limit=4
    app.get('/api/u/:username/thread/query', User.getThreads_API)

    // thread comment query
    //example: localhost:5000/api/thread/53e820480d33abc618fe6f0e/query?offset=2&limit=4
    app.get('/api/thread/:thread/query', Thread.findById_API, Thread.getComments_API)

    // create comment
    app.post('/api/thread/:thread/comment', Thread.findById_API, Comment.create_API)

    // 'like comment'
    app.post('/api/thread/:thread/comment/:comment', authUtils.isLoggedIn_API, Thread.findById_API, Thread.findComment_API, Comment.like_API)

    // send friend request/accept friend request
    // should probably save user reference instead of username
    app.post('/api/u/:username/add', authUtils.isLoggedIn_API, User.findByUsername_API, User.addFriend_API)

    // 404 page
    app.get('*', function (req, res) {
        res.status(404).render('404')
    })
}