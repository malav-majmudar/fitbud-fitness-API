const mongoose = require("mongoose");

const strengthSchema = new mongoose.Schema({
    name: String,
    MET: Number
});

module.exports = mongoose.model("Strength_exercise", strengthSchema);
