require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const foodRouter = require("./routes/food");
const recipeRouter = require("./routes/recipe");
const cardioRouter = require("./routes/cardio");
const strengthRouter = require("./routes/strength");
const workoutRouter = require("./routes/workout");

const mongodb_URI = process.env.URI;
const PORT = process.env.PORT;

const app = express();
app.listen(PORT, () => console.log("Server Started")); // http://localhost:8001
app.use(express.json());

mongoose.set("strictQuery", true); // ignore deprecation

try {
  mongoose.connect(
    mongodb_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Mongoose successfully connected to database")
  );
} catch (e) {
  console.log("Could not connect to the database");
}

app.use((req, res, next) => {
  console.log(
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
  );
  console.log("Got Request!");
  req.method ? console.log("Method:", req.method) : null;
  req.originalUrl ? console.log("Original URL:", req.originalUrl) : null;
  req.get("Authorization")
    ? console.log("Authorization:", req.get("Authorization"))
    : null;
  next();
});

app.use("/food", foodRouter);
app.use("/recipes", recipeRouter);
app.use("/exercise/cardio", cardioRouter);
app.use("/exercise/strength", strengthRouter);
app.use("/workouts", workoutRouter);
