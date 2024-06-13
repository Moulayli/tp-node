const controller = {}
const Commande = require('../models/Commande');
const Biere = require('../models/Biere');
const Biere_Commande = require('../models/Biere_Commande');

controller.addBeerToCommand = (req, res) => {
  const { id_commande, id_biere } = req.params;

  Promise.all([
    Commande.findByPk(id_commande),
    Biere.findByPk(id_biere)
  ])
  .then(([commande, biere]) => {
    if (!commande) {
      return res.status(404).json({ message: 'Command not found' });
    }
    if (!biere) {
      return res.status(404).json({ message: 'Beer not found' });
    }

    return Biere_Commande.create({ commande_id: id_commande, biere_id: id_biere })
    
    .then(() => {
      res.status(201).json({ message: 'Beer added to command' });
    })
  })
  .catch((error) => {
    console.error('Error adding beer to command:', error);
    res.status(500).json({ message: 'Internal server error' });
  });
};

controller.deleteBeerFromCommand = (req, res) => {
  const { id_commande, id_biere } = req.params;

  Biere_Commande.destroy({
    where: {
      commande_id: id_commande,
      biere_id: id_biere
    }
  })
  .then((deleted) => {
    if (deleted === 0) {
      return res.status(404).json({ message: 'Beer or Command not found' });
    }
    res.status(200).json({ message: 'Beer removed from command' });
  })
  .catch((error) => {
    console.error('Error removing beer from command:', error);
    res.status(500).json({ message: 'Internal server error' });
  });
};

module.exports = controller