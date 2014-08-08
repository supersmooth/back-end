// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    else{
        req.flash('message', 'You have to be logged in for that')
        res.redirect('/login')
    }
}

function isLoggedIn_API(req, res, next){
    if(req.isAuthenticated()) return next()
    else res.json({'status' : 'error', 'message' : 'You have to be logged in for that'})
}

function logout(req, res, next){
	if(req.user){
        req.logout()
        req.flash('message', 'you have signed out')
    }
    next()
}

module.exports.isLoggedIn = isLoggedIn
module.exports.logout = logout
module.exports.isLoggedIn_API = isLoggedIn_API