const { DataTypes } = require("sequelize")
const db = require("../config/db")
const Biere = require("./Biere")

const Bar = db.define('Bar', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {  
  freezeTableName: true,
})

module.exports = Bar