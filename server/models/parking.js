var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Parking', new Schema({
  _id: String,
  bookings: [{type: String, ref: 'Booking'}]
}));