const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Recipe = require("../models/recipeModel");
const Food = require("../models/foodModel");

router.get("/:recipeId", async (request, response) => {
  try {
    if (
      request.params.recipeId.length != 24 ||
      !mongoose.isObjectIdOrHexString(request.params.recipeId)
    ) {
      response.status(400).json({ message: "Invalid ID" });
    } else {
      let recipe = await Recipe.findById(request.params.recipeId);
      console.log(recipe);
      if (recipe === null) {
        response.sendStatus(404).json({ message: "Recipe Not Found" });
      } else {
        recipe = recipe.toObject();

        for (let i = 0; i < recipe.ingredients.length; i++) {
          let ingredient = recipe.ingredients[i];

          const food = await Food.findById(ingredient.foodId);
          delete ingredient.foodId;
          ingredient.food = food;
          console.log(ingredient);
          recipe.ingredients[i] = ingredient;
        }
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
  const ingredients = request.body.ingredients;
  let kcal = 0,
    carbs = 0,
    fat = 0,
    protein = 0;

  for (let i = 0; i < ingredients.length; i++) {
    const food = await Food.findById(ingredients[i].foodId);
    kcal += food.nutritionalContent.kcal;
    carbs += food.nutritionalContent.totalCarb;
    fat += food.nutritionalContent.totalFat;
    protein += food.nutritionalContent.protein;
  }

  const recipe = new Recipe({
    userId: request.body.userId,
    name: request.body.name,
    numServings: request.body.numServings,
    macros: {
      kcal: kcal,
      protein: protein,
      totalCarb: carbs,
      totalFat: fat,
    },
    ingredients: request.body.ingredients,
    timestamp: Date.now(),
  });

  console.log(recipe);

  try {
    const newRecipe = await recipe.save();
    response.status(201).send({
      message: "Recipe Successfully Created",
      _id: newRecipe._id,
    });
    console.log(newRecipe);
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

router.patch("/:recipeId", async (request, response) => {
  try {
    if (
      request.params.recipeId.length != 24 ||
      !mongoose.isObjectIdOrHexString(request.params.recipeId)
    ) {
      response.status(400).json({ message: "Invalid ID" });
    }

    const recipe = await Recipe.findById(request.params.recipeId);

    if (recipe === null) {
      response.status(404).json({ message: "Workout Not Found" });
    } else if (recipe.userId !== request.body.userId) {
      response.status(401).json({ message: "User not Authorized" });
    } else {
      const updateRecipe = {
        name: request.body.name || recipe.name,
        numServings: request.body.numServings || recipe.numServings,
        macros: request.body.macros || recipe.macros,
        ingredients: request.body.ingredients || recipe.ingredients,
        timestamp: Date.now(),
      };
      console.log(updateRecipe);
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        request.params.recipeId,
        updateRecipe
      );
      response.status(200).send({
        message: "Recipe Successfully Updated",
        _id: updatedRecipe._id,
      });
    }
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

router.delete("/:recipeId", async (request, response) => {
  try {
    if (
      request.params.recipeId.length != 24 ||
      !mongoose.isObjectIdOrHexString(request.params.recipeId)
    ) {
      response.status(400).json({ message: "Invalid ID" });
    } else {
      const recipe = await Recipe.findByIdAndDelete(request.params.recipeId);
      console.log(recipe);
      if (recipe === null) {
        response.status(404).json({ message: "Recipe Not Found" });
      } else {
        response.status(200);
        response.send({ message: "Recipe Successfully Deleted" });
      }
    }
  } catch (e) {
    response.status(500).json({ message: "Internal Error" });
    console.log(e);
  }
});

router.delete("/", async (request, response) => {
  try {
    if (
      request.query.userId.length != 24 ||
      !mongoose.isObjectIdOrHexString(request.query.userId)
    ) {
      response.status(400).json({ message: "Invalid UserId" });
    } else {
      const recipes = await Recipe.deleteMany({
        userId: request.query.userId,
      });
      console.log(recipes);
      if (recipes === null) {
        response.status(404).json({ message: "Recipes Not Found" });
      } else {
        response.status(200);
        response.send({ message: "Recipes Successfully Updated" });
      }
    }
  } catch (e) {
    response.status(500).json({ message: "Internal Error" });
    console.log(e);
  }
});

module.exports = router;
