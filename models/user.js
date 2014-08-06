var mongoose = require('mongoose')
var bcrypt   = require('bcrypt-nodejs')
var Comment  = require('./comment')
var Thread  = require('./thread')
var Schema = mongoose.Schema

// User schema
var userSchema = mongoose.Schema({
    email   : String,
    username: String,
    password: String, 
    
    comments   : [Comment.schema],
    threads    : [{ type: Schema.Types.ObjectId, ref: 'Thread' }]
})

// User schema methods
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(), null)
}
userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

var userModel = mongoose.model('User', userSchema)

// middleware
function findByUsername(req, res, next){
    userModel
    .findOne({ 'username': req.params.username})
    .populate('threads', null, null, {limit:20})
    .exec(function(err, user) {
        if(err) console.log(err)
        req.USER = user
        next()
    })
}

// exports
module.exports.model = userModel
module.exports.findByUsername = findByUsername