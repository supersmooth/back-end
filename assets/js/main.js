var request = require('superagent')

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
		if(parsed['status'] === "error") {
			elem.className = elem.className.replace(' disabled', '')
			elem.innerHTML = Number(elem.innerHTML ) - 1
			errorMessage(parsed['message'])
		}
	})

	elem.innerHTML = Number(elem.innerHTML ) + 1
	elem.className += ' disabled'
}

function onClick(query, cb){
	elem = document.querySelectorAll(query);
	for(var i=0; i<elem.length; i++){
		elem[i].addEventListener('click', cb)
	}
}

onClick('[data-like-thread]', likeThread)
onClick('[data-like-comment]', likeComment)

function errorMessage(msg){
	var msg = "<div class=\"alert alert-warning alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><strong>Opps...</strong>" + msg + "</div>"
	document.getElementById('message').innerHTML += msg
}