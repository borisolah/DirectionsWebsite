// models/dijtablaModel.js

const mongoose = require("mongoose");

const dijtablaSchema = new mongoose.Schema({
  dijtablaNeve: {
    type: String,
    required: true,
  },
  dijtak: {
    type: Array,
    default: [],
  },
});

const Dijtabla = mongoose.model("Dijtabla", dijtablaSchema);

module.exports = Dijtabla;
