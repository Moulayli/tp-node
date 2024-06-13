const express = require("express");
const bodyParser = require("body-parser")
require("dotenv").config()
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const barRouter = require("./router/barRouter")
const biereRouter = require("./router/biereRouter")
const commandeRouter = require("./router/commandeRouter")
const biere_commandeRouter = require("./router/biere_commandeRouter")
app.use(barRouter);
app.use(biereRouter);
app.use(commandeRouter);
app.use(biere_commandeRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`app listening on port ${process.env.SERVER_PORT}`)
})

module.exports = app;