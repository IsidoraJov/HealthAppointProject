var express = require('express');
var router = express.Router();

const connection = require('../db'); 

router.get('/', function(req, res, next) {

    connection.query('SELECT * FROM doctor', (err, results) => {
        if (err) {
          res.status(500).send('Greška pri dobijanju podataka.');
        } else {
         
          res.json(results)
          
        }
      });

});

router.get('/:id', (req, res) => {
    const userId = req.params.id; 
  
    const query = 'SELECT * FROM doctor WHERE id = ?'; 
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Greška pri izvršavanju upita:', err);
        res.status(500).send('Greška na serveru');
      } else if (results.length === 0) {
        res.status(404).send('Korisnik nije pronađen');
      } else {
        const doctor = results[0];
        const responseText = `
          
          First Name: ${doctor.first_name}<br>
          Last Name: ${doctor.last_name}<br>
          Email: ${doctor.email}<br>
          Subspecialization: ${doctor.subspecialization}
        `;
        res.send(responseText); 
      }
    });
  });

module.exports = router;
