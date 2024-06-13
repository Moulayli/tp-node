const path = require('path');
const os = require('os');
const fs = require('fs');
const PDFDocument = require('pdfkit');


const controller = {}

const Biere = require('../models/Biere');
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

controller.getCommandeDetails = async (req, res) => {
  const id_commande = req.params.id_commande;

  try {
    const commande = await Commande.findByPk(id_commande, {
      include: [{
        model: Biere,
        through: 'Biere_Commande',
        as: 'Bieres'
      }]
    });

    if (!commande) {
      return res.status(404).json({ message: 'Commande not found' });
    }

    res.status(200).json(commande);
  } catch (error) {
    console.error('Error retrieving commande details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

controller.generateCommandePDF = async (req, res) => {
  const id_commande = req.params.id_commande;

  try {
    let commande = await Commande.findByPk(id_commande);

    if (!commande) {
      return res.status(404).json({ message: 'Commande not found' });
    }

    const tempDir = path.join(os.tmpdir());
    const randomString = Math.random().toString(36).substring(2, 7);
    const fileName = `commande_${id_commande}-${randomString}.pdf`;
    const filePath = path.join(tempDir, fileName);
    if (!fs.existsSync(tempDir)) {
      console.log(`Creating directory: ${tempDir}`);
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(20).text(`Commande #${commande.id}`, { align: 'center' }).moveDown();
    doc.fontSize(14).text(`Date de commande: ${commande.date}`, { align: 'left' }).moveDown();
    doc.fontSize(16).text('Détails de la commande:', { align: 'left' }).moveDown();

    doc.fontSize(16).text(`Bar : ${commande.bar_id}`, { align: 'left' }).moveDown();
    doc.fontSize(16).text(`Nom: ${commande.name}`, { align: 'left' }).moveDown();
    doc.fontSize(16).text(`Prix: ${commande.prix}€`, { align: 'left' }).moveDown();
    doc.fontSize(16).text(`Status: ${commande.status}`, { align: 'left' }).moveDown();
    doc.fontSize(16).text('Total:', { align: 'right' }).moveDown();
    doc.fontSize(16).text(`${commande.prix}€`, { align: 'right' }).moveDown();

    doc.end();
    stream.on('finish', () => {
      res.contentType('application/pdf');
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Error sending PDF:', err);
          res.status(500).json({ message: 'Error generating PDF' });
        }
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting PDF:', err);
          }
        });
      });
    });

    stream.on('error', (err) => {
      console.error('Error writing PDF:', err);
      res.status(500).json({ message: 'Error generating PDF' });
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = controller