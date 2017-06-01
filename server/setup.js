var express   = require('express'),
    User      = require('./models/user'),
    SHA256    = require("crypto-js/sha256"),
    Timetable = require('./models/timetable'),
    Parking   = require('./models/parking');

var app = module.exports = express.Router();

app.get('/setup', function(req, res) {
  //users  
  var steve = new User({
    email: 'steve.g@lfc.com',
    password: SHA256('number08'),
    type: 'individual'
  });
  
  steve.save(function(err){
    if (err) throw err;
  });
  
  var firmino = new User({
    email: 'firmino.r@lfc.com',
    password: SHA256('number11'),
    type: 'individual'
  });

  firmino.save(function(err){
    if (err) throw err;
  });
  
  //business
  var coutinho = new User({
    email: 'coutinho.c@lfc.com',
    password: SHA256('number10'),
    type: 'business'
  });

  coutinho.save(function(err){
    if (err) throw err;
  });
  
  //timetable
  var timetable;
  for(var t=0; t<24; t++){
    timetable = new Timetable({
      _id: t
    });
    timetable.save(function(err){
      if(err) throw err;
    })
  }

  //parking
  var parking;
  for (var p=1; p<=5; p++) {
    parking = new Parking({
      _id: 'A' + p
    });
    parking.save(function(err){
      if(err) throw err;
    })
  }

  res.json({success: true});
});
