// routes/dijtablaRoutes.js

const express = require("express");
const router = express.Router();
const Dijtabla = require("../models/dijtablaModel");

router.get("/", async (req, res) => {
  try {
    const dijtablak = await Dijtabla.find();
    res.status(200).json(dijtablak);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { dijtablaNeve, dijtak } = req.body;
  const newDijtabla = new Dijtabla({ dijtablaNeve, dijtak });

  try {
    await newDijtabla.save();
    res.status(201).json(newDijtabla);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
