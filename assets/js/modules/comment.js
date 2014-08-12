var request = require('superagent')
,   utils = require('./utils')

function commentGet(url){
	request
	.get(url)
	.end(function(err, res){
		if(err) console.log(err)
		var parsed = JSON.parse(res.text)
		console.log(parsed)
	})
}

function loadComments(e){
	var elem = e.target
	var url = '/api/thread/' + elem.id + '/query?offset=' + 0 + '&limit=' + 10 // todo

	commentGet(url)
}

function attachHandler(){
	utils.onClick('[data-load-comments]', loadComments)
	utils.onClick('[data-new-comment]', newComment)
}

function newComment(e){
	var elem = e.target
	var url = '/api/thread/' + elem.id + '/comment'
	var textContent = document.getElementById(elem.id + '_input')

	request
	.post(url)
	.send({body: textContent.value})
	.end(function(err, res){
		if(err) console.log(err)
		var parsed = JSON.parse(res.text)

		textContent.value = ''

		if(parsed['status'] === 'error'){
			utils.warningMessage(parsed['message'])
		}
	})
}

module.exports.get = commentGet
module.exports.attachHandler = attachHandler