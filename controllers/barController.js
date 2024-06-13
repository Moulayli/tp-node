const controller = {}
const Bar = require('../models/Bar');
const bars = [];

controller.getAll = (req, res) => {
  Bar.findAll().then((bars) => {
    res.status(200).send(bars)
  }).catch((err) => {
    res.status(503).send({message : "Find all failed"})
  })
}

controller.getById = (req, res) => {
  const id = req.params.id
  Bar.findByPk(id)
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
  const { name, adresse, tel, email, description } = req.body
  const bar = {name, adresse, tel, email, description}

  Bar.create(bar)
  .then( (b) => {
    return res.status(201).send({bar : b, message: "Bar created"})
  } )
  .catch( (err) => {
    return res.status(400).send({message: "Error creating Bar", error : err.errors})
  })
}

controller.update = (req, res) => {
  const id = req.params.id
  const { name, adresse, tel, email, description } = req.body
  const bar = {name, adresse, tel, email, description}

  Bar.update(bar, { where : { id : id}}).then( (queryResult) => {
    res.status(200).send({message: "Bar updated" , result : queryResult })
  }).catch( (error) => {
    res.status(400).send({message : "Bar not updated", error})
  })
}

controller.delete = (req, res) => {
  const id = req.params.id

  Bar.destroy({ where : { id : id}}).then((queryResult) => {
    if (queryResult === 0) return res.status(400).send('Bar not found')
      
    res.status(200).send({message : "Bar deleted !", result : queryResult})
  }).catch( error => {
    res.status(400).send({message : "Bar not deleted", error})
  })
}

module.exports = controller
