var mongoose = require('mongoose')
var bcrypt   = require('bcrypt-nodejs')
var Comment  = require('./comment')

// user schema
var userSchema = mongoose.Schema({
    email   : String,
    username: String,
    password: String, 
    
    comments   : [Comment.schema]
})

// user methods

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(), null)
}

userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
} 

// exports
module.exports = mongoose.model('User', userSchema)