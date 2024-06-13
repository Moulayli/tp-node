const express = require("express");
const bodyParser = require("body-parser")
require("dotenv").config()
const app = express()

const Bar = require("./models/Bar");
const Biere = require("./models/Biere");
const Commande = require("./models/Commande");
const Biere_Commande = require("./models/Biere_Commande");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(process.env.SERVER_PORT, () => {
  console.log(`app listening on port ${process.env.SERVER_PORT}`)
})

module.exports = app;