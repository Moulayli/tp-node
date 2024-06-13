const sequelize = require("sequelize")
const db = require("../config/db")

const Bar = db.define('Bar', {
  id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: {
    type: sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  adresse: {
    type: sequelize.STRING,
    allowNull: false
  },
  tel: {
    type: sequelize.STRING,
    allowNull: true
  },
  email: {
    type: sequelize.STRING,
    allowNull: false
  },
  description: {
    type: sequelize.TEXT,
    allowNull: true
  }
})

module.exports = Bar