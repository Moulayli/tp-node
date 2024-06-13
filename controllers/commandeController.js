const controller = {}
const Commande = require('../models/Commande')
const Bar = require('../models/Bar')

controller.getAllOfBar = (req, res) => {
  const id_bar = req.params.id_bar;

  Bar.findByPk(id_bar)
    .then((bar) => {
      if (!bar) {
        return res.status(404).json({ message: 'Bar not found' });
      }

      return Commande.findAll({
        where: {bar_id: id_bar}
      })
      .then((commandes) => {
        if (!commandes || commandes.length === 0) {
          return res.status(404).json({ message: 'No commands in this bar' });
        }
        res.status(200).json(commandes);
      })
    })
    .catch((error) => {
      console.error('Error retrieving commands of the bar:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
}

controller.getById = (req, res) => {
  const id_commande = req.params.id_commande
  Commande.findByPk(id_commande)
  .then((commande) => {
    if (!commande) {
      return res.status(404).json({ message: 'Command not found' });
    }
    res.status(200).json(commande);
  })
  .catch((err) => {
    console.error('Error retrieving command:', err);
    res.status(500).json({ message: 'Internal server error' });
  });
}

controller.addToBar = (req, res) => {
  const id_bar = req.params.id_bar;
  const { name, prix, date, status } = req.body;

  Bar.findByPk(id_bar)
    .then((bar) => {
      if (!bar) {
        return res.status(404).json({ message: 'Bar not found' });
      }

      return Commande.create({
        name,
        prix,
        date,
        status,
        bar_id: id_bar
      })
      .then((commande) => {
        res.status(201).json({ message: 'Command added to bar', command: commande });
      });
    })
    .catch((error) => {
      console.error('Error adding command to bar:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
}

controller.update = (req, res) => {
  const id_commande = req.params.id_commande;
  const { name, prix, date, status } = req.body;

  Commande.findByPk(id_commande)
    .then((commande) => {
      if (!commande) {
        return res.status(404).json({ message: 'Command not found' });
      }

      return commande.update({
        name,
        prix,
        date,
        status
      })
      .then((updatedCommande) => {
        res.status(200).json({ message: 'Command updated', command: updatedCommande });
      })
    })
    .catch((error) => {
      console.error('Error updating command:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
}

controller.delete = (req, res) => {
  const id_commande = req.params.id_commande;

  Commande.findByPk(id_commande)
    .then((commande) => {
      if (!commande) {
        return res.status(404).json({ message: 'Command not found' });
      }

      return commande.destroy()
      .then(() => {
        res.status(200).json({ message: 'Command deleted' });
      })
    })
    .catch((error) => {
      console.error('Error deleting command:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
}

module.exports = controller