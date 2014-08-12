var request = require('superagent')
,   utils = require('./utils')

function likeThread(e){

	var elem = e.target
	var url = '/api/thread/' + elem.id + '/like'

	postLike(elem, url)
}
function likeComment(e){

	var elem = e.target
	var _id = elem.id.split('_')
	var url = '/api/thread/' + _id[1] + '/comment/' + _id[0] + '/like'

	postLike(elem, url)
}

function postLike(elem, url){
	request
	.post(url)
	.end(function(err, res){
		if(err) console.log(err)
		var parsed = JSON.parse(res.text)

		elem.innerText = 'likes ' + (Number(elem.innerText.split(' ')[1]) + 1)
		elem.className += ' disabled'

		if(parsed['status'] === "error") {
			elem.className = elem.className.replace(' disabled', '')
			elem.innerText = 'likes ' + (Number(elem.innerText.split(' ')[1]) - 1)
			utils.warningMessage(parsed['message'])
		}
	})
}

function attachAllComments(){
	utils.onClick('[data-like-comment]', likeComment)
}

function attachAllThreads(){
	utils.onClick('[data-like-thread]', likeThread)
}

module.exports.attachAllThreads = attachAllThreads
module.exports.attachAllComments = attachAllComments