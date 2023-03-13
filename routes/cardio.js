const express = require("express");
const router = express.Router();

const Cardio_exercise = require("../models/cardioExerciseModel");

router.get("/:exerciseId", async (request, response) => {
  console.log("Got request");
  try {
    if (request.params.exerciseId.length != 24) {
      response.status(400).json({ message: "Invalid ID" });
    } else {
      const exercise = await Cardio_exercise.findById(
        request.params.exerciseId
      );

      if (exercise === null) {
        response.status(404).json({ message: "Exercise Not Found" });
      } else {
        response.status(200);
        response.send(exercise);
      }
    }
  } catch (e) {
    console.log(e);
    response.status(500).json({ message: "Internal Error" });
    console.log(e);
  }
});

router.get("/", async (request, response) => {
  console.log(request.query.search);
  if (request.query.search) {
    try {
      const exercises = await Cardio_exercise.find({
        name: { $regex: new RegExp("\\b" + request.query.search + "\\b", "i") },
      });
      if (exercises === null || exercises.length === 0) {
        response.status(404).json({ message: "No Exercises Found" });
      } else {
        response.status(200);
        response.send(exercises);
      }
    } catch (e) {
      response.status(500).json({ message: "Internal Error" });
      console.log(e);
    }
  } else {
    response.status(404).json({ message: "Page Not Found" });
  }
});

module.exports = router;
