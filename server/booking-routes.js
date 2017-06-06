var express     = require('express'),
    _           = require('lodash'),
    mongoose    = require('mongoose'),
    Parking     = require('./models/parking'),
    Booking     = require('./models/booking'),
    checkToken  = require('./check_token');

var app = module.exports = express.Router();

app.get('/bookings', function(req, res) {
  if(req.query.user) {
    Booking.find({user: req.query.user}).populate('user').then(function(bookings) {
      res.status(200).send({
          success: true, 
          bookings: bookings
        });
    },function(err){
      res.status(400).send({
        success: false, 
        message: err.message
      })
    });
  } else {
    Booking.find().populate('user').then(function(bookings) {
      res.status(200).send({
          success: true, 
          bookings: bookings
        });
    },function(err){
      res.status(400).send({
        success: false, 
        message: err.message
      })
    });
  }
});

app.post('/bookings', checkToken.checkToken, function(req, res){
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
          res.status(400).send({
            success: false, 
            message: err.message
          })
        })
      })
      
    }, function(err){
      res.status(400).send({
        success: false, 
        message: err.message
      })
    });
});

app.put('/bookings', checkToken.checkToken, function(req, res){
  Booking.update({_id: req.body.booking._id}, req.body.booking, {multi: false}, function(err, raw){
      if(err) {
        res.status(400).send({
          success: false, 
          message: err.message
        })
      }
      // automatically reject others for the same time being if this is approving
      if( req.body.booking.status === 'approved') {
        Booking.update({_id: {$ne: req.body.booking._id}, parking: req.body.booking.parking, time: {$in: req.body.booking.time}}, {status: 'rejected'}, {multi: true}, function(err, raw){
          if(err) {
            res.status(400).send({
              success: false, 
              message: err.message
            })
          }
          res.status(200).send({
            success: true, 
            message: 'booking updated successfully',
            booking: req.body.booking
          });
        });  
      } else {
        res.status(200).send({
          success: true, 
          message: 'booking updated successfully',
          booking: req.body.booking
        });
      }   
    }
  )
});