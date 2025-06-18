var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../db');


router.post('/create-user', async (req, res) => {
  
  const {
    role,
    first_name,
    last_name,
    username,
    password,
    email,
    specialization,
    subspecialization,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const working_hours = null;

    if (role === 'doctor') {
      const query = `
        INSERT INTO doctor 
        (first_name, last_name, username, password, email, specialization, subspecialization, working_hours)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
       connection.query(query, [
        first_name,
        last_name,
        username,
        hashedPassword,
        email,
        specialization,
        subspecialization,
        working_hours,
      ]);
    } else if (role === 'medical_staff') {
      const query = `
        INSERT INTO user 
        (first_name, last_name, username, password, email, role, working_hours)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
       connection.query(query, [
        first_name,
        last_name,
        username,
        hashedPassword,
        email,
        'staff',
        working_hours,
      ]);
      
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


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
