const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: String,
  name: String,
  strengthExercises: [String],
  cardioExercises: [String],
  timestamp: Date,
});

module.exports = mongoose.model("Workout", workoutSchema);
