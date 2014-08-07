// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    else{
        req.flash('message', 'you need to be logged in for that')
        res.redirect('/login')
    }
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