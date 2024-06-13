const { DataTypes } = require("sequelize")
const db = require("../config/db")
const Bar = require('./Bar')

const Biere = db.define('Biere', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  degree: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  bar_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Bar',
      key: 'id'
    }
  }
}, {  
  freezeTableName: true,
})

module.exports = Biere