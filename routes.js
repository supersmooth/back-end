var User = require('./models/user')
var Thread  = require('./models/thread')
var Comment  = require('./models/comment')
var async = require('async')

module.exports = function(app, passport){
    
    // landing page
    app.get('/', function (req, res){
        res.render('index', {something: req.flash('errorMessage'), layout : 'layouts/main'})
    })
    
    // signup page
    app.get('/signup', function(req, res){
        res.render('signup', {message: req.flash('signupMessage'), layout : 'layouts/main'})
    })
    
    // login page
    app.get('/login', function(req, res){
        res.render('login', {message: req.flash('loginMessage'), layout : 'layouts/main'})
    })
    
    // redirects to req.user(users in session) page
    app.get('/profile', isLoggedIn, function(req, res){
         res.redirect('/u/' + req.user.username)
    })

    // user page
    app.get('/u/:username', findUsername, function(req, res){
        
        if((req.user) && (req.user.username === req.params.username)){
                res.render('profile', {data: {isUser: true, threads: req.params.user.threads}, layout : 'layouts/main'})
        }
        else if (req.params.user){
            res.render('profile', {data : {isUser: false, threads: req.params.user.threads}, layout : 'layouts/main'})
        }
        else{
            req.flash('errorMessage', 'that profile page does not exist')
            res.redirect('/')
        }
    })

    // singout page
    app.get('/signout', function(req, res){

        if(req.user){
            req.logout()
            req.flash('errorMessage', 'you have signed out')
        }
        res.redirect('/')
    })

    // signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))
    
    // login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))

    // handles thread creation
    app.post('/thread', isLoggedIn, Thread.create, function (req, res){
        res.redirect('/profile')
    })
    
    app.post('/u/:username/:thread', isLoggedIn, findUsername, findThread, Comment.create, function(req, res){
        res.redirect('/profile')
    })
    
    // 404 page
    app.get('*', function (req, res) {
        res.status(404).render('404')
    })
}

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next()
    else {
        req.flash('loginMessage', 'you need to be logged in for that')
        res.redirect('/login')
    }
}

// middleware
function findUsername(req, res, next) {
    User.findOne({ 'username' : req.params.username }, function (err, user) {
        if (user) req.params.user = user
        next()
    }).populate('threads').exec(function (err, thread) {
        if (err) console.log(err)
    })
}

// middleware
function findThread(req, res, next) {
    Thread.model.findById(req.params.thread, function (err, thread) {
        if(err) console.log(err)
        if(thread) {
            req.THREAD = thread
            next()
        }
        else {
            req.flash('errorMessage', 'that thread page does not exist')
            res.redirect('/')
        }
    })
}