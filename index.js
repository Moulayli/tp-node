const express = require("express");
const bodyParser = require("body-parser")
require("dotenv").config()
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const barRouter = require("./router/barRouter")
const biereRouter = require("./router/biereRouter")
app.use(barRouter);
app.use(biereRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`app listening on port ${process.env.SERVER_PORT}`)
})

module.exports = app;