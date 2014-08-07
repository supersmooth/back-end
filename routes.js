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
        res.render('index', {message: req.flash('message')})
    })

    // signup page
    app.get('/signup', function(req, res){
        res.render('signup', {message: req.flash('message')})
    })

    // login page
    app.get('/login', function(req, res){
        res.render('login', {message: req.flash('message')})
    })
    
    // redirects to req.user(users in session) page
    app.get('/profile', authUtils.isLoggedIn, function(req, res){
         res.redirect('/u/' + req.user.username)
    })

    // user page
    app.get('/u/:username/:page?', function(req, res){

        var lastPage = (req.params.page>1) ? (parseInt(req.params.page) -1) : 1
        var nextPage = (req.params.page>1) ? (parseInt(req.params.page) +1) : 2

        if((req.user) && (req.user.username === req.USER.username)){
            res.render('profile', {data: {isUser: true, owner: req.USER.username, 
                lastPage: lastPage, nextPage: nextPage,
                threads: req.USER.threads, flash: req.flash('message')}})
        }
        else if (req.USER){
            res.render('profile', {data: {isUser: false, owner: req.USER.username, 
                lastPage: lastPage, nextPage: nextPage,
                threads: req.USER.threads, flash: req.flash('message')}})
        }
        else{
            req.flash('message', 'that profile page does not exist')
            res.redirect('/')
        }
    })

    // singout page
    app.get('/signout', authUtils.logout, function(req, res){
        res.redirect('/')
    })

    // handles signup
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))

    // handles login
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
    app.all('*', function (req, res) {
        res.status(404).render('404')
    })
}