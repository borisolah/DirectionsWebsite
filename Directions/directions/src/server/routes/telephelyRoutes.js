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

module.exports = router;
``;
