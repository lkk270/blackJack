const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Hand = new Schema({
    initials: {type: String, required: true},
    computerHand: {type: String, required: true},
    userHand: {type: String, required: true},
    computerTotal: {type: Number, required: true},
    userTotal: {type: Number, required: true},
    result: {type: String, required: true},
  },
  { timestamps: true },
  );

  module.exports = mongoose.model('hand', Hand)