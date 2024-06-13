const { Op } = require("sequelize");
const Commande = require("../models/Commande");
const Biere = require("../models/Biere");

const controller = {}
const Bar = require('../models/Bar');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

controller.login = async (req, res) => {
  if (!req.form.isValid) {
    return res.status(400).send({ message: "Invalid body" })
  }
  const { email, password } = req.form;
  
  Bar.findOne({ where: {email} })
  .then( async (bar) => {
    if (!bar || !bcrypt.compareSync(password, bar.password)) {
      return res.status(401).json({ message : 'Invalid credentiels' })
    }

    res.status(200).json({ id: bar.id, token: bar.token })
  })
}

controller.getAll = (req, res) => {
  Bar.findAll().then((bars) => {
    res.status(200).send(bars)
  }).catch((err) => {
    res.status(503).send({message : "Find all failed"})
  })
}

controller.getById = (req, res) => {
  const id_bar = req.params.id_bar
  Bar.findByPk(id_bar)
  .then((bar) => {
    if (!bar) {
      return res.status(404).json({ message: 'Bar not found' });
    }
    res.status(200).json(bar);
  })
  .catch((err) => {
    console.error('Error retrieving bar:', err);
    res.status(500).json({ message: 'Internal server error' });
  });
}

controller.create = (req, res) => {
  if (!req.form.isValid) {
    return res.status(400).json({ message: "Invalid body", errors: req.form.errors });
  }
  const { name, adresse, tel, email, description, password } = req.form

  Bar.findOne({ where: {email}})
    .then(async (bar) => {
      if (bar) {
        return res.status(409).json({ message: 'Bar already exists !' })
      }

      const hashed = await bcrypt.hash(password, 10);
      
      Bar.create({ 
        name: name,
        adresse: adresse,
        tel: tel,
        description: description,        
        email: email, 
        password: hashed 
      })
      .then(async (bar) => {
        bar.token = jwt.sign(bar.id, process.env.JWT_SECRET)
        await bar.save();
        return res.json({ id: bar.id, token: bar.token })
      })
    })
}

controller.update = (req, res) => {
  const id_bar = req.params.id_bar
  const { name, adresse, tel, email, description } = req.body
  const bar = {name, adresse, tel, email, description}

  Bar.update(bar, {where: {id: id_bar}}).then( (queryResult) => {
    res.status(200).send({message: "Bar updated" , result : queryResult })
  }).catch( (error) => {
    res.status(400).send({message : "Bar not updated", error})
  })
}

controller.delete = (req, res) => {
  const id_bar = req.params.id_bar

  Bar.destroy({where: {id: id_bar}}).then((queryResult) => {
    if (queryResult === 0) return res.status(400).send('Bar not found')
      
    res.status(200).send({message : "Bar deleted !", result : queryResult})
  }).catch( error => {
    res.status(400).send({message : "Bar not deleted", error})
  })
}

controller.getAverageDegree = async (req, res) => {
  const id_bar = req.params.id_bar;
  const { date, prix_min, prix_max } = req.query;

  try {
    let bieres = [];

    if (date) {
      // Filter by date
      const commandes = await Commande.findAll({
        where: {
          bar_id: id_bar,
          date: {
            [Op.eq]: new Date(date)
          }
        },
        include: [{
          model: Biere,
          through: 'Biere_Commande',
          attributes: ['degree']
        }]
      });

      if (commandes.length === 0) {
        return res.status(404).json({ message: 'No orders found for this bar on the specified date' });
      }

      bieres = commandes.flatMap(commande => commande.Bieres);
    } else if (prix_min && prix_max) {
      // Filter par prix range
      bieres = await Biere.findAll({
        where: {
          bar_id: id_bar,
          prix: {
            [Op.between]: [parseFloat(prix_min), parseFloat(prix_max)]
          }
        }
      });

      if (bieres.length === 0) {
        return res.status(404).json({ message: 'No beers found for this bar within the specified price range' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid query parameters' });
    }

    const degrees = bieres.map(biere => biere.degree);
    const averageDegree = degrees.reduce((sum, degree) => sum + degree, 0) / degrees.length;

    res.status(200).json({ averageDegree });
  } catch (error) {
    console.error('Error calculating average degree:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



controller.getCommandesByDatePriceRangeAndOptionalStatus = async (req, res) => {
  const id_bar = req.params.id_bar;
  const { date, prix_min, prix_max, status, name } = req.query;

  try {
    const whereClause = {
      bar_id: id_bar,
      /*
      date: {
        [Op.eq]: new Date(date)
      },
      */
      prix: {
        [Op.between]: [parseFloat(prix_min), parseFloat(prix_max)]
      }
    };

    if (status) {
      whereClause.status = status;
    }

    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`
      };
    }

    const commandes = await Commande.findAll({
      where: whereClause
    });

    if (commandes.length === 0) {
      return res.status(404).json({ message: 'No orders found for this bar matching the specified criteria' });
    }

    res.status(200).json(commandes);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


controller.getBieres = async (req, res) => {
  const id_bar = req.params.id_bar;
  const { sort = 'asc', limit, offset, degree_min, degree_max, prix_min, prix_max } = req.query;

  try {
    const whereClause = {
      bar_id: id_bar
    };

    if (degree_min !== undefined && degree_max !== undefined) {
      whereClause.degree = {
        [Op.between]: [parseFloat(degree_min), parseFloat(degree_max)]
      };
    }

    if (prix_min !== undefined && prix_max !== undefined) {
      whereClause.prix = {
        [Op.between]: [parseFloat(prix_min), parseFloat(prix_max)]
      };
    }

    const options = {
      where: whereClause,
      order: [['name', sort.toUpperCase()]],
    };

    if (limit !== undefined) {
      options.limit = parseInt(limit);
    }

    if (offset !== undefined) {
      options.offset = parseInt(offset);
    }

    const bieres = await Biere.findAll(options);

    if (bieres.length === 0) {
      return res.status(404).json({ message: 'No beers found for this bar matching the specified criteria' });
    }

    res.status(200).json(bieres);
  } catch (error) {
    console.error('Error retrieving beers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = controller
