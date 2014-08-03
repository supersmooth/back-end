var LocalStrategy = require('passport-local').Strategy
var User = require('./models/user')

module.exports = function (passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })

    passport.use('local-signup', new LocalStrategy({
        usernameField    : 'username',
        passwordField    : 'password',
        passReqToCallback : true
    },
    function (req, username, password, done) {
        process.nextTick(function() {
            
            User.findOne({ 'username' : username }, function (err, user) {
                if (err) console.log(err + '!!!!!!!!!')
                if (user) return done(null, false, req.flash('signupMessage', 'That username is taken.'))

                else {
                    console.log('new account created') //dev
                    var newUser = new User()
                    newUser.username = username
                    newUser.password = newUser.generateHash(password)
                    
                    newUser.save(function (err) {
                        if (err) console.log(err)
                        return done (null, newUser)
                    })
                }
            })
        })
    }))
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        console.log(username + ' ' + password)
        User.findOne({ 'username' :  username }, function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, req.flash('loginMessage', 'that username does not exist!'))
            if (!user.isValidPassword(password)) return done(null, false, req.flash('loginMessage', 'Ooops! wrong password'))

            else return done(null, user)
        })
    }))
}