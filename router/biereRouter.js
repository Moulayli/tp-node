const controller = require("../controllers/biereController")

const express = require('express')
const { ensureAuthorized } = require("../middleware/auth")
const router = express.Router()

router.get("/bars/:id_bar/biere", controller.getAllOfBar)
router.get("/biere/:id_biere", controller.getById)
router.post("/bars/:id_bar", ensureAuthorized, controller.addToBar)
router.put("/biere/:id_biere", ensureAuthorized, controller.update)
router.delete("/biere/:id_biere", ensureAuthorized, controller.delete)

module.exports = router