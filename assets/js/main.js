var request = require('superagent')
,   Like = require('./modules/like')
,   Thread = require('./modules/thread')

Like.attachAllComments()
Like.attachAllThreads()