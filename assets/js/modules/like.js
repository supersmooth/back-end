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

	clicks(elem)

	request
	.post(url)
	.end(function(err, res){
		if(err) console.log(err)
		var parsed = JSON.parse(res.text)

		if(parsed['status'] === "error") {
			utils.warningMessage(parsed['message'])
			unclicks(elem)
		}
	})
}

function checkIfClicked(elem, attr, name){

	var elem = document.querySelectorAll(elem)
	for(var i=0; i<elem.length; i++){
		if(elem[i].getAttribute(attr).indexOf(name) !== -1){
			clicks(elem[i])
		}
	}
}

function clicks(elem){
	elem.innerText = 'likes ' + (Number(elem.innerText.split(' ')[1]) + 1)
	elem.className += ' disabled'
}

function unclicks(elem){
	elem.className = elem.className.replace(' disabled', '')
	elem.innerText = 'likes ' + (Number(elem.innerText.split(' ')[1]) - 1)
}

function attachAllComments(){
	utils.onClick('[data-like-comment]', likeComment)
	checkIfClicked('[data-like-comment]', 'data-like-comment', utils.getUsername())
}

function attachAllThreads(){
	utils.onClick('[data-like-thread]', likeThread)
	checkIfClicked('[data-like-thread]', 'data-like-thread', utils.getUsername())
}

module.exports.attachAllThreads = attachAllThreads
module.exports.attachAllComments = attachAllComments