var express     = require('express'),
    mongoose    = require('mongoose'),
    checkToken  = require('./check_token'),
    Parking     = require('./models/parking'),
    Booking     = require('./models/booking');

var app = module.exports = express.Router();
app.get('/api/parkings', function(req, res){
    var parking_xhr = Parking.find().populate('bookings').sort({_id: 1});
    parking_xhr.then(function (parkings) {
      res.status(200).send({parkings: parkings});
    });
});

app.delete('/api/parkings', checkToken.checkToken, function(req,res){
    Parking.findOneAndRemove({_id: req.query.id}, function(err){
        if(err) {
            res.status(400).send({
                success: false,
                message: err.message
            });
        }
        // change all existing bookings status to canceled
        Booking.update({parking: req.query.id}, {status: 'cancelled'}, {multi: true}, function(err, raw){
          if(err) {
            res.status(400).send({
              success: false, 
              message: err.message
            })
          }
          res.status(200).send({
            success: true, 
            message: 'parking removed successfully',
          });
        });  
    });
});