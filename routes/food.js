const express = require("express");

const router = express.Router();
const Food = require("../models/foodModel");

// GET by food ID
router.get("/:foodId", async (request, response) => {
  console.log("Got request");
  try {
    if (request.params.foodId.length != 24) {
      response.status(400).json({ message: "Invalid ID" });
    } else {
      const food = await Food.findById(request.params.foodId);

      if (food === null) {
        response.status(404).json({ message: "Food Not Found" });
      } else {
        response.status(200);
        response.send(food);
      }
    }
  } catch (e) {
    console.log(e);
    response.status(500).json({ message: "Internal Error" });
    console.log(e);
  }
});

// Keyword Search or Get By Barcode or Get By UserId
router.get("/", async (request, response) => {
  if (request.query.search) {
    try {
      console.log("Got Request");
      const foods = await Food.find({
        name: {
          $regex: new RegExp("\\b" + request.query.search + "\\b", "i"),
        },
      }).select({
        _id: 1,
        name: 1,
        brandOwner: 1,
        brandName: 1,
        isVerified: 1,
      });
      //.limit(250);
      if (foods === null || foods.length === 0) {
        response.status(404).json({ message: "No Foods Found" });
      } else {
        console.log(foods);
        response.status(200);
        response.send(foods.sort((a, b) => a.name.length - b.name.length));
      }
    } catch (e) {
      response.status(500).json({ message: "Internal Error" });
      console.log(e);
    }
  } else if (request.query.barcode) {
    try {
      const food = await Food.find({ barcode: request.query.barcode });
      if (food === null || food.length === 0) {
        response.status(404).json({ message: "Food Not Found" });
      } else {
        response.status(200);
        response.send(food[0]);
      }
    } catch (e) {
      response.status(500).json({ message: "Internal Error" });
      console.log(e);
    }
  } else if (request.query.userId) {
    try {
      const foods = await Food.find({ userId: request.query.userId });
      if (foods === null || foods.length === 0) {
        response.status(404).json({ message: "User has not added any foods" });
      } else {
        response.status(200);
        response.send(foods);
      }
    } catch (e) {
      response.status(500).json({ message: "Internal Error" });
      console.log(e);
    }
  } else {
    response.status(404).json({ message: "Page Not Found" });
  }
});

// POST create food
router.post("/", async (request, response) => {
  console.log("Got Request");
  const food = new Food({
    name: request.body.name,
    brandOwner: request.body.brandOwner,
    brandName: request.body.brandName,
    barcode: request.body.barcode,
    userId: request.body.userId,
    servingQuantity: request.body.servingQuantity,
    servingQuantityUnit: request.body.servingQuantityUnit,
    servingName: request.body.servingName,
    nutritionalContent: request.body.nutritionalContent,
    isVerified: false,
  });

  try {
    const newFood = await food.save();
    response.status(201).send(newFood);
  } catch (err) {
    response.status(500).send({ message: err.message });
  }
});

module.exports = router;
