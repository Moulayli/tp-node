const controller = {}
const Bar = require('../models/Bar');
const Biere = require('../models/Biere');

controller.getAllOfBar = (req, res) => {
  const id_bar = req.params.id_bar;

  Bar.findByPk(id_bar)
    .then((bar) => {
      if (!bar) {
        return res.status(404).json({ message: 'Bar not found' });
      }

      return Biere.findAll({
        where: {bar_id: id_bar}
      })
      .then((bieres) => {
        if (!bieres || bieres.length === 0) {
          return res.status(404).json({ message: 'No beers in this bar' });
        }
        res.status(200).json(bieres);
      })
    })
    .catch((error) => {
      console.error('Error retrieving beers of the bar:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
}

controller.getById = (req, res) => {
  const id_biere = req.params.id_biere
  Biere.findByPk(id_biere)
    .then((biere) => {
      if (!biere) {
        return res.status(404).json({ message: 'Beer not found' });
      }
      res.status(200).json(biere);
    })
    .catch((err) => {
      console.error('Error retrieving beer:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
}

controller.addToBar = (req, res) => {
  const id_bar = req.params.id_bar;
  const { name, description, degree, prix } = req.body;

  Bar.findByPk(id_bar)
    .then((bar) => {
      if (!bar) {
        return res.status(404).json({ message: 'Bar not found' });
      }

      return Biere.create({
        name,
        description,
        degree,
        prix,
        bar_id: id_bar
      })
      .then((biere) => {
        res.status(201).json({ message: 'Beer added to bar', beer: biere });
      });
    })
    .catch((error) => {
      console.error('Error adding beer to bar:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
}

controller.update = (req, res) => {
  const id_biere = req.params.id_biere;
  const { name, description, degree, prix } = req.body;

  Biere.findByPk(id_biere)
    .then((biere) => {
      if (!biere) {
        return res.status(404).json({ message: 'Beer not found' });
      }

      return biere.update({
        name,
        description,
        degree,
        prix
      })
      .then((updatedBiere) => {
        res.status(200).json({ message: 'Beer updated', beer: updatedBiere });
      })
    })
    .catch((error) => {
      console.error('Error updating beer:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
}

controller.delete = (req, res) => {
  const id_biere = req.params.id_biere;

  Biere.findByPk(id_biere)
    .then((biere) => {
      if (!biere) {
        return res.status(404).json({ message: 'Beer not found' });
      }

      return biere.destroy()
      .then(() => {
        res.status(200).json({ message: 'Beer deleted' });
      })
    })
    .catch((error) => {
      console.error('Error deleting beer:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
}

module.exports = controller
