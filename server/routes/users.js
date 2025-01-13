var express = require('express');
var router = express.Router();
const connection = require('../db');


router.get('/', function(req, res, next) {
  
  connection.query('SELECT * FROM user', (err, results) => {
    if (err) {
      res.status(500).send('Greška pri dobijanju podataka.');
    } else {
      res.json(results)
      
    }
  });

});
router.get("/test", (req, res) => {
  res.send("Backend radi!");
});

router.get('/t', function(req, res, next) {

  connection.query('SELECT * FROM appointments_type', (err, results) => {
    if (err) {
      res.status(500).send('Greška pri dobijanju podataka.');
    } else {
      res.json(results)
      
    }
  });

});

router.get('/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'SELECT * FROM user WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Greška pri izvršavanju upita:', err);
            return res.status(500).json({ error: 'Greška na serveru' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User nije pronađen' });
        }

        const patient = results[0];

        const response = {
            firstName: patient.first_name,
            lastName: patient.last_name,
            email: patient.email,

        };
      
        res.json(response); 
    });
});
module.exports = router;
