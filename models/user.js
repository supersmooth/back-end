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

    friends : [String],
    
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

// add friend
// test this!
function addFriend_API(req, res, next){

    if(req.user.username === req.USER.username){
        res.json({'status' : 'error', 'message' : 'You can\'t add yourself as a friend!'})
    }

    else if(req.user.friends.indexOf(req.USER.username) !== -1 &&
            req.USER.friends.indexOf(req.user.username) !== -1){
        res.json({'status' : 'error', 'message' : 'You are already friends!'})
    }

    else if(req.user.friends.indexOf(req.USER.username) === -1 &&
            req.USER.friends.indexOf(req.user.username) !== -1){
        res.json({'status' : 'success', 'message' : 'You have accepted a friend request'})
    }

    else if(req.user.friends.indexOf(req.USER.username) !== -1){
        res.json({'status' : 'error', 'message' : 'You have already added this user.'})
    }

    else{
        req.user.friends.push(req.USER.username)
        req.user.save(function (err) {
            if(err) {
                console.log(err)
                res.json({'status' : 'error', 'message' : 'server error, try again'})
            }
            else res.json({'status' : 'success', 'message' : 'friend reqquest sent'})
        })
    }
}

// middleware
function findByUsername(req, res, next){
    userModel
    .findOne({ 'username': req.params.username })
    .populate({
        path: 'threads',
        options:{skip: 0, limit: 5, sort: {'_id': -1}}
    })
    .exec(function(err, user) {
        if(err) console.log(err)
        if(user){
            req.USER = user
            next()
        }
        else{
            req.flash('message', 'User doesn\'t exist')
            res.redirect('/')
        }
    })
}

// get threads from user 
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

function findByUsername_API(req, res, next){
    userModel
    .findOne({ 'username': req.params.username })
    .exec(function(err, user){
        if(err) console.log(err)
        if(user){
            req.USER = user
            next()
        }
        else{
            res.json({'status' : 'error', 'message' : 'User doesn\'t exist'})
        }
    })
}

// exports
module.exports.model = userModel
module.exports.findByUsername = findByUsername

module.exports.getThreads_API = getThreads_API
module.exports.findByUsername_API = findByUsername_API
module.exports.addFriend_API = addFriend_API