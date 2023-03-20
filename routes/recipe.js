const express = require("express");
const { update } = require("../models/foodModel");
const router = express.Router();

const Recipe = require("../models/recipeModel");

router.get("/:recipeId", async (request, response) => {
  try {
    if (request.params.recipeId.length != 24) {
      response.status(400).json({ message: "Invalid ID" });
    } else {
      const recipe = await Recipe.findById(request.params.recipeId);
      console.log(recipe);
      if (recipe === null) {
        response.sendStatus(404).json({ message: "Recipe Not Found" });
      } else {
        response.status(200);
        response.send(recipe);
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
      const recipes = await Recipe.find({ userId: request.query.userId });
      if (recipes === null || recipes.length === 0) {
        response
          .status(404)
          .json({ message: "User has not created any recipes" });
      } else {
        response.status(200);
        response.send(recipes);
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
  console.log(request.body);
  const recipe = new Recipe({
    userId: request.body.userId,
    name: request.body.name,
    macros: request.body.macros,
    ingredients: request.body.ingredients,
    timestamp: Date.now(),
  });

  try {
    const newRecipe = await recipe.save();
    response.status(201).json(newRecipe);
    console.log(newRecipe);
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

router.patch("/:recipeId", async (request, response) => {
  try {
    if (request.params.workoutId.length != 24) {
      response.status(400).json({ message: "Invalid ID" });
    }

    const updateRecipe = {
      name: request.body.name,
      numServings: request.body.numServings,
      macros: request.body.macros,
      ingredients: request.body.ingredients,
      timestamp: Date.now(),
    };

    const recipe = await Workout.findById(request.params.workoutId);
    if (recipe === null) {
      response.status(404).json({ message: "Workout Not Found" });
    } else if (recipe.userId !== request.body.userId) {
      response.status(401).json({ message: "User not Authorized" });
    } else {
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        request.params.recipeId,
        updateRecipe
      );
      response.status(200).json(updatedRecipe);
      console.log(updateRecipe);
    }
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

router.delete("/:recipeId", async (request, response) => {
  try {
    if (request.params.recipeId.length != 24) {
      response.status(400).json({ message: "Invalid ID" });
    } else {
      const recipe = await Recipe.deleteOne({
        _id: request.params.recipeId,
      });
      console.log(recipe);
      if (recipe === null) {
        response.status(404).json({ message: "Recipe Not Found" });
      } else {
        response.status(200);
        response.send(recipe);
      }
    }
  } catch (e) {
    response.status(500).json({ message: "Internal Error" });
    console.log(e);
  }
});

module.exports = router;
