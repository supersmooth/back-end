var http = require('http')
, row = document.getElementsByClassName('row')[0]
, error
, button
, id 
, parent
, likeSpan
, counter

function getLikes(e) {
	var targ = e.target

	if(targ.className === 'like') {
		button = targ
		id = targ.id
		parent = button.parentNode.children
		likeSpan = parent[1]
		error = parent[2]
		request(button, id)
	}

}

function request (ele, id) {
	var route = '/api/thread/' + id + '/like'
	, req = http.request({
		method: 'POST',
	 	path: route
	 }, likes)

	function likes (res) {
		var data = ''
		res.on('data', function (buf) {
			data += buf
		})
		res.on('end', function () {
			data = JSON.parse(data)
			if(data.status === 'success')	{
				counter = likeSpan.innerHTML.split('')
				counter[1] = Number(counter[1]) + 1
				likeSpan.innerHTML = counter.join('')
			}
			else 
				error.className = error.className.replace('hidden', '')

		})
	}

	req.end()
}

if(row)
	row.addEventListener('click', getLikes)