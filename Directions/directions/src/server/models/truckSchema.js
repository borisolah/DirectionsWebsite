const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const truckSchema = new Schema({
  rendszam: { type: String, default: "" },
  biztositasKezdete: { type: Date },
  muszakiEv: { type: Date },
  sajatTomeg: { type: Number },
  terheles: { type: Number },
  ossztomeg: { type: Number },
  sofor: {
    type: {
      _id: Schema.Types.ObjectId,
      nev: String,
      anyaNeve: String,
      szuletesiDatum: Date,
      telefonszam: String,
      varos: String,
      ervenyesKategoriak: [String],
      munkaviszonyKezdete: Date,
      __v: Number,
    },
    default: {},
  },
  telephely: {
    type: {
      _id: Schema.Types.ObjectId,
      nev: String,
      city: String,
      utca: String,
      raktarvezeto: String,
      lat: Number,
      lng: Number,
      __v: Number,
    },
    default: {},
  },
  autoNeve: { type: String, default: "" },
});

const Truck = mongoose.model("Truck", truckSchema);

module.exports = Truck;
