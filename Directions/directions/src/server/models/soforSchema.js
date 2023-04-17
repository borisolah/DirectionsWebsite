const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const soforSchema = new Schema({
  nev: { type: String, default: "" },
  anyaNeve: { type: String, default: "" },
  szuletesiDatum: { type: Date },
  telefonszam: { type: String, default: "" },
  varos: { type: String, default: "" },
  ervenyesKategoriak: { type: String, default: "" },
  munkaviszonyKezdete: { type: Date },
});

const Sofor = mongoose.model("Sofor", soforSchema);

module.exports = Sofor;
