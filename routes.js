var User = require('./models/user')

module.exports = function(app, passport) {

    app.get('/', function (req, res) {
        //req.session.save()
        console.log(req.session.cookie)
        res.render('index.jade', {something: req.flash('signoutMessage')})
    })
    
    app.get('/signup', function(req, res) {
        res.render('signup.jade', {message: req.flash('signupMessage')})
    })
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))
    
    app.get('/login', function(req, res) {
        res.render('login.jade', {message: req.flash('loginMessage')})
    })
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))
    
    app.get('/u/:username', function(req, res) {
        res.render('profile.jade')
    })
    
    //temp // should send to /u/:username
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.jade', {username : req.user.username})
    })
    
    app.get('/signout', function(req, res) {
        
        if(req.user){
            req.logout()
            req.flash('signoutMessage', 'you have signed out')
        }
        res.redirect('/')
    })
    
    app.get('*', function (req, res) {
        res.status(404).send('<h1>page not found</h1')
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next()
    else {
        req.flash('loginMessage', 'you need to be logged in for that')
        res.redirect('/login')
    }
}