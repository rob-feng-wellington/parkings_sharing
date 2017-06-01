var express     = require('express'),
    mongoose    = require('mongoose'),
    Parking     = require('./models/parking');

var app = module.exports = express.Router();
app.get('/api/parkings', function(req, res){
    var parking_xhr = Parking.find().populate('bookings').sort({_id: 1});
    parking_xhr.then(function (parkings) {
      res.status(200).send({parkings: parkings});
    });
});
