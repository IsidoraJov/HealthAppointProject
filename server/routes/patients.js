var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {

    connection.query('SELECT * FROM patients', (err, results) => {
        if (err) {
          res.status(500).send('Greška pri dobijanju podataka.');
        } else {
          res.json(results)
          
        }
      });
});

router.get('/:id', (req, res) => {
    const userId = req.params.id; 
  
    const query = 'SELECT * FROM patients WHERE id = ?'; 
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Greška pri izvršavanju upita:', err);
        res.status(500).send('Greška na serveru');
      } else if (results.length === 0) {
        res.status(404).send('Korisnik nije pronađen');
      } else {
        const patient = results[0];
        const responseText = `
          
          First Name: ${patient.first_name}<br>
          Last Name: ${patient.last_name}<br>
          JMBG: ${patient.jmbg}
         
        `;
        res.send(responseText); 
      }
    });
  });

  const addNewPatient = (firstName, lastName, username, birthday, jmbg, phone, email, address, gender, maritalStatus, emergencyContact, language, res) => {
    const query = `
        INSERT INTO patients (first_name, last_name, username, birthday, jmbg, phone, email, address, gender, marital_status, emergency_contact, language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    connection.execute(query, [firstName, lastName, username, birthday, jmbg, phone, email, address, gender, maritalStatus, emergencyContact, language], (err, results) => {
        if (err) {
            console.error("Error while adding user:", err);
            res.status(500).send("Error adding user");
            return;
        }
        res.status(200).send(`User added successfully with ID: ${results.insertId}`);
    });
};

router.post('/add', (req, res) => {
    const { firstName, lastName, username, birthday, jmbg, phone, email, address, gender, maritalStatus, emergencyContact, language } = req.body;

    if (!firstName || !lastName || !username || !birthday || !jmbg || !phone || !email || !address || !gender || !maritalStatus || !emergencyContact || !language) {
        return res.status(400).send('All fields are required');
    }


    addNewPatient(firstName, lastName, username, birthday, jmbg, phone, email, address, gender, maritalStatus, emergencyContact, language, res);
});

router.delete('/delete/:id', (req, res) => {
    const patientId = req.params.id;  

    
    const query = 'DELETE FROM patients WHERE id = ?';

    connection.execute(query, [patientId], (err, results) => {
        if (err) {
            console.error('Error deleting patient:', err);
            res.status(500).send('Error deleting patient');
            return;
        }

       
        if (results.affectedRows === 0) {
            return res.status(404).send('Patient not found');
        }

        res.status(200).send(`Patient with ID ${patientId} has been deleted.`);
    });
});    

router.put('/update/:id', (req, res) => {
    const patientId = req.params.id;  
    const { firstName, lastName, phone, email, address, gender, maritalStatus, emergencyContact, language } = req.body;


    if (!firstName || !lastName || !phone || !email || !address || !gender || !maritalStatus || !emergencyContact || !language) {
        return res.status(400).send('All fields are required');
    }

    
    const query = `
        UPDATE patients
        SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, gender = ?, marital_status = ?, emergency_contact = ?, language = ?
        WHERE id = ?
    `;

   
    connection.execute(query, [firstName, lastName, phone, email, address, gender, maritalStatus, emergencyContact, language, patientId], (err, results) => {
        if (err) {
            console.error('Error updating patient:', err);
            return res.status(500).send('Error updating patient');
        }

        
        if (results.affectedRows === 0) {
            return res.status(404).send('Patient not found');
        }

        
        res.status(200).send(`Patient with ID ${patientId} has been updated.`);
    });
});

module.exports = router;
