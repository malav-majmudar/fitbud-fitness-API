const mongoose = require("mongoose");

const cardioSchema = new mongoose.Schema({
  name: String,
  MET: Number,
});

module.exports = mongoose.model("Cardio_exercise", cardioSchema);
