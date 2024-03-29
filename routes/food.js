const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Food = require("../models/foodModel");

// GET by food ID
router.get("/:foodId", async (request, response) => {
  try {
    if (
      request.params.foodId.length != 24 ||
      !mongoose.isObjectIdOrHexString(request.params.foodId)
    ) {
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
      const search = request.query.search.toUpperCase();
      const foods = await keywordSearch(search);
      if (foods === null || foods.length === 0) {
        response.status(404).json({ message: "No Foods Found" });
      } else {
        console.log(foods);
        response.status(200);
        response.send(foods);
      }
    } catch (e) {
      response.status(500).json({ message: "Internal Error" });
      console.log(e);
    }
  } else if (request.query.barcode) {
    try {
      const foodID = await Food.find({ barcode: request.query.barcode }).select(
        {
          _id: 1,
        }
      );
      if (foodID === null || foodID.length === 0) {
        response.status(404).json({ message: "Food Not Found" });
      } else {
        response.status(200);
        response.send(foodID[0]);
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
  const food = new Food({
    name: request.body.name,
    brandOwner: request.body.brandOwner,
    brandName: request.body.brandName,
    barcode: request.body.barcode,
    userId: request.body.userId,
    servingQuantity: request.body.servingQuantity,
    servingQuantityUnit: request.body.servingQuantityUnit,
    servingName: request.body.servingName,
    nutritionalContent: {
      kcal: request.body.nutritionalContent.kcal,
      totalFat: request.body.nutritionalContent.totalFat,
      saturatedFat: request.body.nutritionalContent.saturatedFat,
      transFat: request.body.nutritionalContent.transFat,
      polyunsaturatedFat: request.body.nutritionalContent.polyunsaturatedFat,
      monounsaturatedFat: request.body.nutritionalContent.monounsaturatedFat,
      cholesterol: request.body.nutritionalContent.cholesterol,
      sodium: request.body.nutritionalContent.sodium,
      totalCarb: request.body.nutritionalContent.totalCarb,
      dietaryFiber: request.body.nutritionalContent.dietaryFiber,
      totalSugar: request.body.nutritionalContent.totalSugar,
      addedSugar: request.body.nutritionalContent.addedSugar,
      sugarAlcohols: request.body.nutritionalContent.sugarAlcohols,
      protein: request.body.nutritionalContent.protein,
      vitaminD: request.body.nutritionalContent.vitaminD,
      calcium: request.body.nutritionalContent.calcium,
      iron: request.body.nutritionalContent.iron,
      potassium: request.body.nutritionalContent.potassium,
      vitaminA: request.body.nutritionalContent.vitaminA,
      vitaminC: request.body.nutritionalContent.vitaminC,
      vitaminE: request.body.nutritionalContent.vitaminE,
      thiamin: request.body.nutritionalContent.thiamin,
      riboflavin: request.body.nutritionalContent.riboflavin,
      niacin: request.body.nutritionalContent.niacin,
      vitaminB6: request.body.nutritionalContent.vitaminB6,
      folate: request.body.nutritionalContent.folate,
      vitaminB12: request.body.nutritionalContent.vitaminB12,
      biotin: request.body.nutritionalContent.biotin,
      pantothenicAcid: request.body.nutritionalContent.pantothenicAcid,
      phosphorus: request.body.nutritionalContent.phosphorus,
      iodine: request.body.nutritionalContent.iodine,
      magnesium: request.body.nutritionalContent.magnesium,
      selenium: request.body.nutritionalContent.selenium,
    },
    isVerified: false,
  });

  try {
    const newFood = await food.save();
    response.status(201).send({
      message: "Food Successfully Created",
      _id: newFood._id,
    });
  } catch (err) {
    response.status(500).send({ message: err.message });
  }
});

router.patch("/", async (request, response) => {
  try {
    if (
      request.body.userId.length != 24 ||
      !mongoose.isObjectIdOrHexString(request.body.foodId)
    ) {
      response.status(400).json({ message: "Invalid ID" });
    }

    const updateFood = {
      userId: null,
    };
    const updatedFood = await Food.updateMany(
      { userId: request.body.userId },
      updateFood
    );
    response.status(200).send({ message: "Foods Successfully Updated" });
    console.log(updatedFood);
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

async function keywordSearch(search) {
  const foods = await Food.aggregate([
    {
      $search: {
        index: "foodSearch",
        compound: {
          should: [
            {
              autocomplete: {
                path: "name",
                query: search,
                score: {
                  boost: {
                    value: 70,
                  },
                },
              },
            },
            {
              text: {
                path: "name",
                query: search,
                fuzzy: {
                  maxEdits: 1,
                },
                score: {
                  boost: {
                    value: 100,
                  },
                },
              },
            },
            {
              text: {
                path: { value: "name", multi: "standard" },
                query: search,
                fuzzy: {
                  maxEdits: 2,
                },
                score: {
                  boost: {
                    value: 1,
                  },
                },
              },
            },
            {
              text: {
                path: ["brandName", "brandOwner"],
                query: search,
                score: {
                  boost: {
                    value: 50,
                  },
                },
              },
            },
            {
              text: {
                path: [
                  { value: "brandName", multi: "standard" },
                  { value: "brandOwner", multi: "standard" },
                ],
                query: search,
                fuzzy: {
                  maxEdits: 2,
                },
                score: {
                  boost: {
                    value: 0.5,
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        brandOwner: 1,
        brandName: 1,
        isVerified: 1,
      },
    },
    {
      $limit: 50,
    },
  ]);
  return foods;
}

module.exports = router;
