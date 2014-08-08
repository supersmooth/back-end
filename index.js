var express = require('express')
, app = exports.app = express()
, morgan = require('morgan')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, passport = require('passport')
, session = require('express-session')
, flash = require('connect-flash')
, hbs = require('hbs')
, db = require('./db')
, routes = require('./routes')
, api = require('./api')
, fs = require('fs')

// load partials
var partialsDir = __dirname + '/views/partials'
var filenames = fs.readdirSync(partialsDir)
filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename)
  if(!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8')
  hbs.registerPartial(name, template);
})

// db
db.connect(function(err){
    if(err) return console.error("Couldn't connect to database!")
    console.info("Connected to database successfully")
})

require('./authentication/passport')(passport)

// express config
app.use(morgan('dev'))
app.set('port', process.env.PORT || 5000)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./assets'))

app.locals.layout = '/layouts/main.hbs'
app.set('view engine', 'hbs')
app.locals.cache = false

app.use(session({ secret: 'session-secret-stuff', saveUninitialized: true, resave: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// routes
routes(app, passport)

// api routes
api(app)

// start up
app.listen(app.get('port'), function(){
  console.log('listening on ' + app.get('port'));
});