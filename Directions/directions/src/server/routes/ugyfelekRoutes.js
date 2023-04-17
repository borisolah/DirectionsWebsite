const express = require("express");
const router = express.Router();
const ugyfelekController = require("../controllers/ugyfelekController");

router.post("/", ugyfelekController.createUgyfel);
router.put("/:id", ugyfelekController.updateUgyfel);
router.get("/", ugyfelekController.getUgyfelek);

module.exports = router;
``;
