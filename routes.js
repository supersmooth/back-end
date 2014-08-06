var User = require('./models/user')
var Thread  = require('./models/thread')
var Comment  = require('./models/comment')
var async = require('async')
var authUtils = require('./authentication/utils')

module.exports = function(app, passport){

    app.param('thread', Thread.findById)
    app.param('username', User.findByUsername)

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
    app.get('/profile', authUtils.isLoggedIn, function(req, res){
         res.redirect('/u/' + req.user.username)
    })

    // user page
    app.get('/u/:username', function(req, res){
        
        if((req.user) && (req.user.username === req.params.username)){
            console.log(req.params.user.threads)
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
    app.post('/thread', authUtils.isLoggedIn, Thread.create, function (req, res){
        res.redirect('/profile')
    })

    // handles comment creation
    app.post('/u/:username/:thread', authUtils.isLoggedIn, Comment.create, function(req, res){
        res.redirect('/profile')
    })

    // 404 page
    app.get('*', function (req, res) {
        res.status(404).render('404')
    })
}