const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const telephelySchema = new Schema({
  nev: { type: String, default: "" },
  city: { type: String, default: "" },
  utca: { type: String, default: "" },
  raktarvezeto: { type: String, default: "" },
});

const Telephely = mongoose.model("Telephely", telephelySchema);

module.exports = Telephely;
