var request = require('superagent')

function likeThread(e){

	request
	.post('/api/thread/' + e.target.id + '/like')
	.end(function(err, res){
		if(err) console.log(err)
		console.log(res)
	})
}

function likeComment(e){

	var _id = e.target.id.split('_')

	request
	.post('/api/thread/' + _id[0] + '/comment/' + _id[1] + '/like')
	.end(function(err, res){
		if(err) console.log(err)
		console.log(res)
	})
}

function onClick(query, cb){
	elem = document.querySelectorAll(query);
	for(var i=0; i<elem.length; i++){
		elem[i].addEventListener('click', cb)
	}
}

onClick('[data-like-thread]', likeThread)
onClick('[data-like-comment]', likeComment)