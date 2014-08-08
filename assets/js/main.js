var http = require('http')
, walk = require('dom-walk')
, row = document.getElementsByClassName('row')[0]

function getLikes(e) {
	e.preventDefault()
	var targ = e.target
	, parent 
	, button
	, id 

	if(targ.innerHTML === 'like') {
		parent = targ.parentNode.parentNode
		button = targ
		walk(parent.children, getPiD)
	}

	function getPiD(node) {
		if(node.className === '_id') id = node.innerHTML
	}

	request(button, id)
}

function request (ele, id) {
	var route = '/api/thread/' + id + '/like'
	, req = http.request({
		method: 'POST',
	 	path: route
	 }, likes)

	req.end()

	function likes (res) {
		res.on('data', function (buf) {
			console.log(buf)
		})
	}
}

row.addEventListener('click', getLikes)