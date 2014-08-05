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

// user methods

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(), null)
}

userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
} 

// exports
module.exports = mongoose.model('User', userSchema)