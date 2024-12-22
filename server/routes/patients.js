var express = require('express');
var router = express.Router();
const connection = require('../db');
const { format } = require('date-fns');


router.get('/', function(req, res, next) {

    connection.query('SELECT * FROM patients', (err, results) => {
        if (err) {
          res.status(500).send('Greška pri dobijanju podataka.');
        } else {
          res.json(results)
          
        }
      });
});

router.get('/getPatientId', (req, res) => {

  
  const { firstName, lastName } = req.query;

  
  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  
  const query = `
    SELECT id FROM patients 
    WHERE first_name = ? AND last_name = ?
    LIMIT 1
  `;

  connection.query(query, [firstName, lastName], (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patientId = results[0].id;
    res.json({ patientId });
  });
});

router.get('/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'SELECT * FROM patients WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Greška pri izvršavanju upita:', err);
            return res.status(500).json({ error: 'Greška na serveru' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Pacijent nije pronađen' });
        }

        const patient = results[0];

        const formattedDateOfBirth = patient.birthday 
            ? format(new Date(patient.birthday), 'dd.MM.yyyy') 
            : null;

        const response = {
            firstName: patient.first_name,
            lastName: patient.last_name,
            jmbg: patient.jmbg,
            dateOfBirth: formattedDateOfBirth,
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            gender: patient.gender,
            emergencyContact: patient.emergency_contact,
        };
      
        res.json(response); 
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
