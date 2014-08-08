var User = require('./models/user')
var Thread  = require('./models/thread')
var Comment  = require('./models/comment')
var async = require('async')
var authUtils = require('./authentication/utils')

module.exports = function(app){

	// 'like' thread 
    app.post('/api/thread/:thread/like', authUtils.isLoggedIn, Thread.likeAJAX)

    // handles thread creation
    app.post('/api/thread', authUtils.isLoggedIn, Thread.createAJAX)
}