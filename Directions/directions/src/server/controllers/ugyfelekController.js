const Ugyfel = require("../models/ugyfelSchema");

exports.createUgyfel = async (req, res) => {
  const newUgyfel = new Ugyfel(req.body);

  try {
    await newUgyfel.save();
    res.status(201).json({ message: "Ugyfel added successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUgyfel = async (req, res) => {
  try {
    const updatedUgyfel = await Ugyfel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedUgyfel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUgyfelek = async (req, res) => {
  try {
    const ugyfelek = await Ugyfel.find();

    res.status(200).json(ugyfelek);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
