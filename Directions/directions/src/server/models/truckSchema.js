const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const truckSchema = new Schema({
  rendszam: { type: String, default: "" },
  biztositasKezdete: { type: Date },
  muszakiEv: { type: Number },
  sajatTomeg: { type: Number },
  ossztomeg: { type: Number },
  terheles: { type: Number },
  sofor: { type: String, default: "" },
  autoNeve: { type: String, default: "" },
});

const Truck = mongoose.model("Truck", truckSchema);

module.exports = Truck;
