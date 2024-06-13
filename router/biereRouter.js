const controller = require("../controllers/biereController")

const express = require('express')
const router = express.Router()

router.get("/bars/:id_bar/biere", controller.getAllOfBar)
router.get("/biere/:id_biere", controller.getById)
router.post("/bars/:id_bar", controller.addToBar)
router.put("/biere/:id_biere", controller.update)
router.delete("/biere/:id_biere", controller.delete)

module.exports = router