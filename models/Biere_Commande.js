const sequelize = require("sequelize");
const db = require("../config/db");

const Biere_Commande = db.define('Biere_Commande', {
  biere_id: {
    type: sequelize.INTEGER,
    references: {
      model: 'Biere',
      key: 'id'
    }
  },
  commande_id: {
    type: sequelize.INTEGER,
    references: {
      model: 'Commande',
      key: 'id'
    }
  }
}, {  
  freezeTableName: true,
});

module.exports = Biere_Commande;