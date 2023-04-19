const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ugyfelSchema = new Schema({
  nev: { type: String, default: "" },
  telephoneNumber: { type: String, default: "" },
  email: { type: String, default: "" },
  cim: { type: String, default: "" },
  raklapos: Schema.Types.Mixed,
  nemRaklapos: Schema.Types.Mixed,
});

const Ugyfel = mongoose.model("Ugyfel", ugyfelSchema);

module.exports = Ugyfel;
