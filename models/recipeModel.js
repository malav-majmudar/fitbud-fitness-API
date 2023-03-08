const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  userId: String,
  name: String,
  numServings: Number,
  macros: {
    kcal: Number,
    protein: Number,
    totalCarb: Number,
    totalFat: Number
  },
  ingredients: [
    {
        foodId: String,
        servingName: String,
        numServings: Number,
        quantityMetric: Number
    }
  ],
  timestamp: Date,
});

module.exports = mongoose.model("Recipe", recipeSchema);
