var express     = require('express'),
    _           = require('lodash'),
    config      = require('./config'),
    jwt         = require('jsonwebtoken'),
    mongoose    = require('mongoose'),
    Parking     = require('./models/parking'),
    Booking     = require('./models/booking');

var app = module.exports = express.Router();

var checkToken = function(req, res, next) {
    var token = req.body.token || req.query.token;
    
    if(!token){
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }

    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        return next();
      }
    }); 
}

app.get('/bookings', function(req, res) {
  Booking.find({user: req.query.user}).then(function(bookings) {
    res.status(200).send({
        success: true, 
        bookings: bookings
      });
  },function(err){
    if (err) throw err;
  });
});

app.post('/bookings', checkToken, function(req, res){
    var new_booking = new Booking({
      parking: req.body.parking,
      user: req.body.user,
      time: req.body.time,
      status: req.body.status,
    });

    new_booking.save().then(function(booking){
      Parking.findOne({ _id: booking.parking }, function (err, parking){
        if (err) throw err;
        parking.bookings.push(booking._id)
        parking.save().then(function(parking){
          res.status(201).send({
            success: true, 
            message: 'booking created successfully'
          });
        }, function(err){
          if(err) throw err;
        })
      })
      
    }, function(err){
      if (err) throw err;
    });
});


