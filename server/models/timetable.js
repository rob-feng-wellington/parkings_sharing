var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Timetable', new Schema({
  _id: Number
}));