var express = require('express')
, app = express()
, morgan = require('morgan')
, cookieParser = require('cookie-parser')
, mongoose = require('mongoose')

// express config
app.set('port', process.env.PORT || 1000)
app.use(cookieParser())
app.use(morgan('dev'))

// routes
require("./routes.js")(app)

//launch and confirm
app.listen(app.get('port'), function(){
    console.log('server running on port: ' + app.get('port'));
})