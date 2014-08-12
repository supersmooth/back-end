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

function handleClick(e){
	var elem = e.target
	var url = '/api/thread/' + elem.id + '/query?offset=' + 0 + '&limit=' + 10 // todo

	commentGet(url)
}

function attachHandler(){
	utils.onClick('[data-load-comments]', handleClick)
}

module.exports.get = commentGet
module.exports.attachHandler = attachHandler