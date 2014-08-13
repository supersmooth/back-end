var request = require('superagent')
,   utils = require('./utils')
,   Like = require('./like')

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
		if(parsed['status'] === 'success'){
			console.log(parsed['message'])
			var msg = parsed['message']

			commentTemplate(msg.author, msg.body, elem.id, msg._id, msg.likes)
		}
	})
}

//refactor
function commentTemplate(author, body, threadID, commentID, likes){
	var elem = document.createElement('div')
	elem.innerHTML = "<div class=\"comment\"><a href=\"\/u\/" + author + "\">" + author + ":</a><p>" + body + "</p><button id=\"" + commentID + "_" + threadID + "\" class=\"btn btn-primary\" data-like-comment=\"\">likes " + likes.length + "</button></div>"
	var parent = document.querySelector('[data-thread='+ '\"' + threadID + '\"' +']')
	parent.insertBefore(elem, parent.firstChild)
	Like.attachAllComments()
}

module.exports.get = commentGet
module.exports.attachHandler = attachHandler