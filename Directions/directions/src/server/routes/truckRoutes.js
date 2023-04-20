const express = require("express");
const router = express.Router();

const Truck = require("../models/truckSchema");

router.post("/", async (req, res) => {
  const truckData = req.body;
  const newTruck = new Truck(truckData);

  try {
    await newTruck.save();
    res.status(201).json(newTruck);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const trucks = await Truck.find();
    res.status(200).json(trucks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
