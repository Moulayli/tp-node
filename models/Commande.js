const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Commande = db.define('Commande', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {
    type: DataTypes.STRING,
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
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['en cours', 'terminée']]
    }
  }
}, {  
  freezeTableName: true,
});

module.exports = Commande;