const express = require("express");
const router = express.Router();

const Sofor = require("../models/soforSchema");

router.post("/", async (req, res) => {
  const soforData = req.body;
  const newSofor = new Sofor(soforData);

  try {
    await newSofor.save();
    res.status(201).json(newSofor);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;
