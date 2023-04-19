const express = require("express");
const router = express.Router();

const Telephely = require("../models/telephelySchema");

router.post("/", async (req, res) => {
  const telephelyData = req.body;
  const newTelephely = new Telephely(telephelyData);

  try {
    await newTelephely.save();
    res.status(201).json(newTelephely);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const telephelyek = await Telephely.find();
    res.status(200).json(telephelyek);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
