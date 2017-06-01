var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Booking', new Schema({
  parking: { type: String, ref: 'Parking' },
  user: {type: String, ref: 'User'},
  time: [{type: Number, ref: 'Timetable'}],
  status: String
}));