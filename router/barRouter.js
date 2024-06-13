const controller = require("../controllers/barController")

const express = require('express')
const router = express.Router()

router.get("/bars", controller.getAll)
router.get("/bars/:id_bar", controller.getById)
router.post("/bars", controller.create)
router.put("/bars/:id_bar", controller.update)
router.delete("/bars/:id_bar", controller.delete)
router.get("/bars/:id_bar/degree", controller.getAverageDegree);
router.get("/bars/:id_bar/commandes", controller.getCommandesByDatePriceRangeAndOptionalStatus);
router.get("/bars/:id_bar/biere", controller.getBieres);

module.exports = router