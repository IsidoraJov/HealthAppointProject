var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM reports', (err, results) => {
        if (err) {
          res.status(500).send('Greška pri dobijanju podataka.');
        } else {
          res.json(results)
          
        }
      });
});

module.exports = router;