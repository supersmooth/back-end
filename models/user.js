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
    
    comments: [Comment.schema],
    threads : [{ type: Schema.Types.ObjectId, ref: 'Thread' }]
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
    .populate('threads')
    .skip(0)
    .limit(10)
    .exec(function(err, user) {
        if(err) console.log(err)
        req.USER = user
        next()
    })
}

// get threads from user 
//todo: fix
function getThreads_API(req, res){

    if(req.query.limit > 20){
        res.json({'status' : 'error', 'message' : 'max limit = 20'})
    }

    else if(!req.query.limit || !req.query.offset){
        res.json({'status' : 'error', 'message' : 'invalid query'})
    }

    else{
        userModel
        .findOne({ 'username': req.params.username})
        .populate('threads')
        .exec(function(err, user){
            if(err) console.log(err)
            res.json(user.threads.slice(req.query.offset, req.query.limit))
        })
    }
}

// exports
module.exports.model = userModel
module.exports.findByUsername = findByUsername

module.exports.getThreads_API = getThreads_API