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
        
        if((req.user) && (req.user.username === req.USER.username)){
            res.render('profile', {data: {isUser: true, threads: req.USER.threads}, layout : 'layouts/main'})
        }
        else if (req.USER){
            res.render('profile', {data : {isUser: false, threads: req.USER.threads}, layout : 'layouts/main'})
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

    // 'like' thread
    // thread.like should know if use has already liked this
    app.post('/thread/:thread/like', authUtils.isLoggedIn, Thread.like, function(req,res){
        backURL=req.header('Referer') || '/';
        res.redirect(backURL)
    })

    // handles comment creation
    app.post('/thread/:thread', authUtils.isLoggedIn, Comment.create, function(req, res){
        res.redirect('/profile')
    })

    // 'like' comment
    app.post('/comment/:comment/like', function(req, res){
        //todo
    })

    // 404 page
    app.get('*', function (req, res) {
        res.status(404).render('404')
    })
}