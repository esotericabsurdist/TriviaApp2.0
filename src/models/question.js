//'use strict';

var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
  question : String,
  answer : String
});

var model = mongoose.model('Question', questionSchema);

module.exports = model;
