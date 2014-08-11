var request = require('superagent')
,   Like = require('./modules/like')
,   Thread = require('./modules/thread')
,   Friend = require('./modules/friend')

Friend.attachHandler()

Like.attachAllComments()
Like.attachAllThreads()