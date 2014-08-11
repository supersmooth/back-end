var request = require('superagent')
,   like = require('./modules/like')

like.attachAllComments()
like.attachAllThreads()