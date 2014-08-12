var request = require('superagent')
,   Like = require('./modules/like')
,   Thread = require('./modules/thread')
,   Friend = require('./modules/friend')
,   Comment = require('./modules/comment')

Friend.attachHandler()

Comment.attachHandler()

Like.attachAllComments()
Like.attachAllThreads()