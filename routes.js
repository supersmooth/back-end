var User = require('./models/user')
var Comment  = require('./models/comment')

module.exports = function(app, passport, io) {

    app.get('/', function (req, res) {
        console.log(req.session.cookie)
        res.render('index', {something: req.flash('errorMessage'), layout : 'layouts/main'})
        
    })
    
    app.get('/signup', function(req, res) {
        res.render('signup', {message: req.flash('signupMessage'), layout : 'layouts/main'})
        
    })
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))
    
    app.get('/login', function(req, res) {
        res.render('login', {message: req.flash('loginMessage'), layout : 'layouts/main'})
    })
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))
    
    app.get('/u/:username', findUsername, function(req, res) {
        
        // if user in session is the same as :username
        if (req.user && req.user.username === req.params.username) {
                res.render('profile', {data: {isUser: true, comments: req.user.comments}, layout : 'layouts/main'})
        }
        // if :username exists in database
        else if (req.params.user) {
            res.render('profile', {data : {isUser: false, comments: req.params.user.comments}, layout : 'layouts/main'})
        }
        else {
            req.flash('errorMessage', 'that profile page does not exist')
            res.redirect('/')
        }
    })
    
    app.get('/profile', isLoggedIn, function(req, res) {
         res.redirect('/u/' + req.user.username)
    })
    
    app.get('/signout', function(req, res) {
        
        if(req.user){
            req.logout()
            req.flash('errorMessage', 'you have signed out')
        }
        res.redirect('/')
    })
    
    ///////////////////////////////////////////////////
    
    app.post('/comment', isLoggedIn, function (req, res) {
        var newComment = new Comment.model({
            date: Date.now(),
            author: req.user.username,
            likes: 1,
        })
        req.user.comments.push(newComment)
        req.user.save()
        res.redirect('/profile')
    })
    
    app.get('*', function (req, res) {
        res.status(404).render('404')
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next()
    else {
        req.flash('loginMessage', 'you need to be logged in for that')
        res.redirect('/login')
    }
}

function findUsername(req, res, next) {
    User.findOne({ 'username' : req.params.username }, function (err, user) {
        if (user) req.params.user = user
        next()
    })
}