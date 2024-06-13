const sequelize = require("sequelize");
const db = require("../config/db");

const Commande = db.define('Commande', {
  name: {
    type: sequelize.STRING,
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
  },
  date: {
    type: sequelize.DATE,
    allowNull: false
  },
  status: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [['en cours', 'terminée']]
    }
  }
});

module.exports = Commande;