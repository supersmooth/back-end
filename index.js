var express = require('express')
, app = express()
, morgan = require('morgan')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, passport = require('passport')
, session = require('express-session')
, flash = require('connect-flash')
, hbs = require('hbs')
, db = require('./db')
, routes = require('./routes')
, sockets = require('./sockets.js')

// db
db.connect(function(err){
    if(err) return console.error("Couldn't connect to database!")
    console.info("Connect to database successfully")
})

require('./authentication/passport')(passport)

// express config
app.use(morgan('dev'))
app.set('port', process.env.PORT || 5000)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./public'))

app.set('view engine', 'hbs')
app.locals.layout = '/layouts/main.hbs'
app.locals.cache = false
hbs.registerPartials(__dirname + '/views/partials')

app.use(session({ secret: 'session-secret-stuff', saveUninitialized: true, resave: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// routes
routes(app, passport)
// start up
app.listen(app.get('port'), function(){
  console.log('listening on ' + app.get('port'));
});