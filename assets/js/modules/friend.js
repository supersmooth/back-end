request = require('superagent')
,   utils = require('./utils')

function addFriend(e){

	var elem = e.target
	var username = elem.innerText.split(' ')[1]
	var url = '/api/u/' + username + '/add'

	request
	.post(url)
	.end(function(err, res){
		if(err) console.log(err)
		var parsed = JSON.parse(res.text)
		if(parsed['status'] === 'error'){
			utils.errorMessage(parsed['message'])
		}
	})
}

function attachHandler(){
	utils.onClick('[data-add-friend]', addFriend)
}

module.exports.attachHandler = attachHandler