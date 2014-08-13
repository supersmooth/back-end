function onClick(query, cb){
	var elem = document.querySelectorAll(query);
	for(var i=0; i<elem.length; i++){
		elem[i].addEventListener('click', cb)
	}
}

function errorMessage(msg){
	var msg = "<div class=\"alert alert-danger alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><strong>error </strong>" + msg + "</div>"
	document.getElementById('message').innerHTML += msg
	window.scrollTo(0,50)
}

function warningMessage(msg){
	var msg = "<div class=\"alert alert-warning alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><strong>Opps... </strong>" + msg + "</div>"
	document.getElementById('message').innerHTML += msg
	window.scrollTo(0,50)
}

module.exports.onClick = onClick
module.exports.errorMessage = errorMessage
module.exports.warningMessage = warningMessage