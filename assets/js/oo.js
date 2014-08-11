(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//var http = require('http')
var  row = document.getElementsByClassName('row')[0]
, error
, button
, id 
, parent
, likeSpan
, counter

function getLikes(e) {
	var targ = e.target

	if(targ.data === 'like') {
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
},{}]},{},[1]);
