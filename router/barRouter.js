const controller = require("../controllers/barController")

const express = require('express')
const router = express.Router()

router.get("/bar", controller.getAll)
router.get("/bar/:id", controller.getById)
router.post("/bar", controller.create)
router.put("/bar/:id", controller.update)
router.delete("/bar/:id", controller.delete)

module.exports = router