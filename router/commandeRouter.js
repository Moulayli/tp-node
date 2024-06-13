const controller = require("../controllers/commandeController")

const express = require('express')
const router = express.Router()

router.get("/bars/:id_bar/commande", controller.getAllOfBar)
router.get("/commande/:id_commande", controller.getById)
router.post("/bars/:id_bar/commande", controller.addToBar)
router.put("/commande/:id_commande", controller.update)
router.delete("/commande/:id_commande", controller.delete)

module.exports = router