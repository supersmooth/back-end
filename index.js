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

// db
mongoose.connect('mongodb://testing:testing@ds053419.mongolab.com:53419/supersmooth', function(err) {
    if (err) console.log(err)
    else console.log('connected to db')
})

require('./passport')(passport)

// express config
app.use(morgan('dev'))
app.set('port', process.env.PORT || 1000)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('jade', require('jade').__express)

app.use(session({ secret: 'session-secret-stuff', saveUninitialized: true, resave: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// routes
require("./routes.js")(app, passport)

// socket.io
io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(app.get('port'), function(){
  console.log('listening on ' + app.get('port'));
});

