var mongoose = require('mongoose')
var dburl = process.env.DEV ? 'localhost/supersmooth' : 'mongodb://testing:testing@ds053419.mongolab.com:53419/supersmooth';

module.exports.connect = function(cb){
	console.log("Connect to database at " + dburl)
	return mongoose.connect(dburl, cb)
}

module.exports.mongoose = mongoose