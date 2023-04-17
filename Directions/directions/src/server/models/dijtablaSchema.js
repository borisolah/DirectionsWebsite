const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dijtablaSchema = new Schema({
  dijtablaNeve: { type: String, default: "" },
  dijtak: [
    {
      kgTol: { type: Number },
      kgIg: { type: Number },
      netto: { type: Number },
      brutto: { type: Number },
    },
  ],
});

const Dijtabla = mongoose.model("Dijtabla", dijtablaSchema);

module.exports = Dijtabla;
