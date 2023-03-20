const express = require("express");
const router = express.Router();

const Workout = require("../models/workoutModel");

router.get("/:workoutId", async (request, response) => {
  try {
    if (request.params.workoutId.length != 24) {
      response.status(400).json({ message: "Invalid ID" });
    } else {
      const workout = await Workout.findById(request.params.workoutId);
      console.log(workout);
      if (workout === null) {
        response.status(404).json({ message: "Workout Not Found" });
      } else {
        response.status(200);
        response.send(workout);
      }
    }
  } catch (e) {
    response.status(500).json({ message: "Internal Error" });
    console.log(e);
  }
});

router.get("/", async (request, response) => {
  if (request.query.userId) {
    try {
      const workouts = await Workout.find({ userId: request.query.userId });
      if (workouts === null || workouts.length === 0) {
        response
          .status(404)
          .json({ message: "User has not created any workouts" });
      } else {
        response.status(200);
        response.send(workouts);
      }
    } catch (e) {
      response.status(500).json({ message: "Internal Error" });
      console.log(e);
    }
  } else {
    response.status(404).json({ message: "Page Not Found" });
  }
});

router.post("/", async (request, response) => {
  console.log("Got Request");
  console.log(request.body);
  const workout = new Workout({
    userId: request.body.userId,
    name: request.body.name,
    strengthExercises: request.body.strengthExercises,
    cardioExercises: request.body.cardioExercises,
    timestamp: Date.now(),
  });

  try {
    const newWorkout = await workout.save();
    response.status(201).json(newWorkout);
    console.log(newWorkout);
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

router.patch("/:workoutId", async (request, response) => {
  console.log("Got Request");

  try {
    if (request.params.workoutId.length != 24) {
      response.status(400).json({ message: "Invalid ID" });
    }

    const updateWorkout = {
      name: request.body.name,
      strengthExercises: request.body.strengthExercises,
      cardioExercises: request.body.cardioExercises,
      timestamp: Date.now(),
    };

    const workout = await Workout.findById(request.params.workoutId);
    if (workout === null) {
      response.status(404).json({ message: "Workout Not Found" });
    } else if (workout.userId !== request.body.userId) {
      response.status(401).json({ message: "User not Authorized" });
    } else {
      const updatedWorkout = await Workout.findByIdAndUpdate(
        request.params.workoutId,
        updateWorkout
      );
      response.status(200).json(updatedWorkout);
      console.log(updatedWorkout);
    }
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

router.delete("/:workoutId", async (request, response) => {
  try {
    if (request.params.workoutId.length != 24) {
      response.status(400).json({ message: "Invalid ID" });
    } else {
      const workout = await Workout.deleteOne({
        _id: request.params.workoutId,
      });
      console.log(workout);
      if (workout === null) {
        response.status(404).json({ message: "Workout Not Found" });
      } else {
        response.status(200);
        response.send(workout);
      }
    }
  } catch (e) {
    response.status(500).json({ message: "Internal Error" });
    console.log(e);
  }
});

module.exports = router;
