const controller = require("../controllers/barController")

const express = require('express')
const { ensureAuthorized } = require("../middleware/auth")
const { LoginForm, CreateBarForm } = require("../middleware/form")
const router = express.Router()

router.post("/bars/login", LoginForm, controller.login)
router.get("/bars", controller.getAll)
router.get("/bars/:id_bar", controller.getById)
router.post("/bars", CreateBarForm, controller.create)
router.put("/bars/:id_bar", ensureAuthorized, controller.update)
router.delete("/bars/:id_bar", ensureAuthorized, controller.delete)
router.get("/bars/:id_bar/degree", controller.getAverageDegree);
router.get("/bars/:id_bar/commandes", controller.getCommandesByDatePriceRangeAndOptionalStatus);
router.get("/bars/:id_bar/biere", controller.getBieres);

module.exports = router