var express = require('express')
, app = express()
, http = require('http').Server(app)
, io = require('socket.io')(http)
, morgan = require('morgan')
, cookieParser = require('cookie-parser')
, mongoose = require('mongoose')
, bodyParser = require('body-parser')
, passport = require('passport')
, session = require('express-session')
, flash = require('connect-flash')
, hbs = require('hbs')

// db
mongoose.connect('mongodb://testing:testing@ds053419.mongolab.com:53419/supersmooth', function(err) {
    if (err) console.log(err)
    else console.log('connected to db')
})

require('./authentication/passport')(passport)

// express config
app.use(morgan('dev'))
app.set('port', process.env.PORT || 5000)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials')

app.use(session({ secret: 'session-secret-stuff', saveUninitialized: true, resave: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// routes
require('./routes.js')(app, passport)

// socket.io
require('./sockets.js')(io)

// start up
http.listen(app.get('port'), function(){
  console.log('listening on ' + app.get('port'));
});