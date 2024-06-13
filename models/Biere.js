const sequelize = require("sequelize")
const db = require("../config/db")

const Biere = db.define('Biere', {
  id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: {
    type: sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: sequelize.TEXT,
    allowNull: true
  },
  degree: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  prix: {
    type: sequelize.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  bars_id: {
    type: sequelize.INTEGER,
    references: {
      model: 'Bars',
      key: 'id'
    }
  }
})

module.exports = Biere