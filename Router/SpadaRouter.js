
const express = require("express");
const router = express.Router();
const SpadaController = require("../Controller/SpadaController");

router.post("/", SpadaController.getTrends);
module.exports = router;
