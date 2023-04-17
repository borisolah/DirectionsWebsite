const express = require("express");
const router = express.Router();

const Truck = require("../models/truckSchema");

router.post("/", async (req, res) => {
  const truckData = req.body;
  const newTruck = new Truck(truckData);
  console.log("Received data:", req.body); // Add this line

  try {
    await newTruck.save();
    res.status(201).json(newTruck);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;
