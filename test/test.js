var request = require('supertest')
var should = require('should')
var app = require('../index').app

describe('GET /', function(){
  it('should exist', function(done){
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done()
      });
  })
})