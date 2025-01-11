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

module.exports = router;
