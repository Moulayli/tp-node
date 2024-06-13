const controller = require("../controllers/biere_commandeController")

const express = require('express')
const router = express.Router()

router.post("/commande/:id_commande/biere/:id_biere", controller.addBeerToCommand)
router.delete("/commande/:id_commande/biere/:id_biere", controller.deleteBeerFromCommand)

module.exports = router