var request = require('superagent')

function threadGet(num){

	var url = '/api/u/testaccount/thread/query?offset=' + num + '&limit=' + (num+10)

	request
	.get(url)
	.end(function(err, res){
		if(err) console.log(err)
		var parsed = JSON.parse(res.text)
		console.log(parsed)
	})
}

module.exports.get = threadGet