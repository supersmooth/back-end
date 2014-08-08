var User = require('./models/user')
var Thread  = require('./models/thread')
var Comment  = require('./models/comment')
var async = require('async')
var authUtils = require('./authentication/utils')

module.exports = function(app){

	// 'like' thread 
    app.post('/api/thread/:thread/like', authUtils.isLoggedIn_API, Thread.like_API)

    // handles thread creation
    app.post('/api/thread', authUtils.isLoggedIn_API, Thread.create_API)

    //users threads query // fix...
    app.get('/api/u/:username/thread', User.getThreads_API)

    // 404 page
    app.get('*', function (req, res) {
        res.status(404).render('404')
    })
}