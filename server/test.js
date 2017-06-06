var express   = require('express'),
    Booking   = require('./models/booking')
    Parking   = require('./models/parking');

var app = module.exports = express.Router();

app.get('/test', function(req, res) {
  Booking.find({parking: 'A4', time: {$in: [8,9]}}, function(err, data){
      res.status(200).send(data);
  });
});