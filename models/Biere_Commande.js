const sequelize = require("sequelize");
const db = require("../config/db");

const Biere_Commande = db.define('Biere_Commande', {
  biere_id: {
    type: sequelize.INTEGER,
    references: {
      model: 'Bieres',
      key: 'id'
    }
  },
  commande_id: {
    type: sequelize.INTEGER,
    references: {
      model: 'Commandes',
      key: 'id'
    }
  }
});

module.exports = Biere_Commande;