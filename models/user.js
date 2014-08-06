var mongoose = require('mongoose')
var bcrypt   = require('bcrypt-nodejs')
var Comment  = require('./comment')
var Thread  = require('./thread')
var Schema = mongoose.Schema

// user schema
var userSchema = mongoose.Schema({
    email   : String,
    username: String,
    password: String, 
    
    comments   : [Comment.schema],
    threads    : [{ type: Schema.Types.ObjectId, ref: 'Thread' }]
})

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(), null)
}

userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
} 

var userModel = mongoose.model('User', userSchema)

// middleware
function findByUsername(req, res, next) {
    userModel.findOne({ 'username' : req.params.username }, function (err, user) {
        if (user) req.params.user = user
        next()
    }).populate('threads').exec(function (err, thread) {
        if (err) console.log(err)
    })
}

// exports
module.exports.model = userModel
module.exports.findByUsername = findByUsername