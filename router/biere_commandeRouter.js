const controller = require("../controllers/biere_commandeController")

const express = require('express')
const { ensureAuthorized } = require("../middleware/auth")
const router = express.Router()

router.post("/commande/:id_commande/biere/:id_biere", ensureAuthorized, controller.addBeerToCommand)
router.delete("/commande/:id_commande/biere/:id_biere", ensureAuthorized, controller.deleteBeerFromCommand)

module.exports = router