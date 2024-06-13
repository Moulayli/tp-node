const controller = require("../controllers/commandeController")

const express = require('express')
const { ensureAuthorized } = require("../middleware/auth")
const router = express.Router()

router.get("/bars/:id_bar/commande", controller.getAllOfBar)
router.get("/commande/:id_commande", controller.getById)
router.post("/bars/:id_bar/commande", ensureAuthorized, controller.addToBar)
router.put("/commande/:id_commande", ensureAuthorized, controller.update)
router.delete("/commande/:id_commande", ensureAuthorized, controller.delete)
router.get('/commande/details/:id_commande', controller.generateCommandePDF);

module.exports = router