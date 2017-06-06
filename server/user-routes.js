var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken'),
    mongoose= require('mongoose'),
    User    = require('./models/user'),
    SHA256 = require("crypto-js/sha256");

var app = module.exports = express.Router();

function createIdToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
}

app.post('/api/users', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user){
    if(user){
      return res.status(400).send("A user with that username already exists");
    } else {
      var new_user = new User({
        email: req.body.email,
        password: SHA256(req.body.password),
        type: req.body.type || 'individual'
      });
      new_user.save().then(function(user){
        res.status(201).send({
          success: true, 
          message: 'user created successfully',
          token:createIdToken(new_user), 
          user:{email: user.email, id:user._id, isProvider: (user.type && user.type === 'business')}
        });
      }, function(err){
        if (err) throw err;
      });    
    }
  })
});

app.post('/sessions/create', function(req, res) {
  User.findOne({email: req.body.email}).then(function(user){
    if(!user){
      res.status(400).send({ success: false, message: 'Authentication failed. User not exist'});
    } else {
      var verified = SHA256(req.body.password) == user.password;
      if(!verified) {
        res.status(400).send({ success: false, message: 'Authentication failed. Wrong password'});
      } else {
        var token = createIdToken(user);
        var reply = {
          success: true,
          message: 'Token created',
          token: token,
          user: {email: user.email, id: user._id, isProvider: (user.type && user.type === 'business')}
        };
        res.status(201).send(reply);
      }
    }
  });
});