var express = require('express');
var router = express.Router();
const connection = require('../db');


router.get('/', function(req, res, next) {
  
    const query = `
    SELECT appointments.id, appointments.start_time, appointments.end_time, appointments.patient_id, patients.first_name, patients.last_name
    FROM appointments
    JOIN patients ON appointments.patient_id = patients.id
  `; 
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Greška pri dobijanju podataka.');
    } else {
      
      const formattedResults = results.map((appointment) => ({
        id: appointment.id,
        patient_id: appointment.patient_id,
        title: `${appointment.first_name} ${appointment.last_name}`,
        start: appointment.start_time,
        end: appointment.end_time,  
      }));

      res.json(formattedResults);  
     
    }
  });
});

/*router.get('/', function(req, res, next) {
  const query = `
    SELECT 
      appointments.id, 
      appointments.start_time, 
      appointments.end_time, 
      patients.first_name, 
      patients.last_name, 
      appointment_type.type_name  -- Dodajte ovo za tip
    FROM appointments
    JOIN patients ON appointments.patient_id = patients.id
    JOIN appointment_type ON appointments.type_id = appointment_type.id  -- JOIN sa tabelom appointment_type
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Greška pri dobijanju podataka.');
    } else {
      const formattedResults = results.map((appointment) => ({
        id: appointment.id,
        title: `${appointment.first_name} ${appointment.last_name} - ${appointment.type_name}`,  // Dodajemo tip u title
        start: appointment.start_time,
        end: appointment.end_time,  
      }));

      res.json(formattedResults);  
    }
  });
}); */

router.post("/add", (req, res) => {
  const { patient, doctor, type, start_time, end_time, additional_text } = req.body;

  if (!patient || !doctor || !type || !start_time || !end_time) {
      return res.status(400).json({ error: "Missing required fields." });
  }

  const sqlFindIds = `
      SELECT 
          (SELECT id FROM patients WHERE CONCAT(first_name, ' ', last_name) = ?) AS patient_id,
          (SELECT id FROM doctor WHERE CONCAT(first_name, ' ', last_name) = ?) AS doctor_id,
          (SELECT id FROM appointments_type WHERE name = ?) AS type_id
  `;

  connection.query(sqlFindIds, [patient, doctor, type], (err, results) => {
      if (err) {
          console.error("Error finding IDs:", err);
          return res.status(500).json({ error: "Database error." });
      }

      const { patient_id, doctor_id, type_id } = results[0];
      if (!patient_id || !doctor_id || !type_id) {
          return res.status(404).json({ error: "One or more entities not found." });
      }

      const sqlInsert = `
          INSERT INTO appointments 
          (patient_id, doctor_id, type_id, start_time, end_time, status, reminder_sent, confirmation_sent, additional_text)
          VALUES (?, ?, ?, ?, ?, 'scheduled', 0, 0, ?)
      `;

      connection.query(
          sqlInsert,
          [patient_id, doctor_id, type_id, start_time, end_time, additional_text],
          (err, result) => {
              if (err) {
                  console.error("Error adding appointment:", err);
                  return res.status(500).json({ error: "Database error." });
              }
              res.status(201).json({
                  message: "Appointment added successfully!",
                  appointment_id: result.insertId,
              });
          }
      );
  });
});


router.get('/type', function(req, res, next) {

    connection.query('SELECT * FROM appointments_type', (err, results) => {
        if (err) {
          res.status(500).send('Greška pri dobijanju podataka.');
        } else {
         
          res.json(results)
          
        }
      });

});

router.get('/type/:id', function(req, res, next) {
  const typeId = req.params.id; 
  
  const query = 'SELECT appointments_type.name FROM appointments LEFT JOIN  appointments_type ON appointments.type_id = appointments_type.id WHERE appointments.id = ?'; 
  connection.query(query, [typeId], (err, results) => {
    if (err) {
      console.error('Greška pri izvršavanju upita:', err);
      res.status(500).send('Greška na serveru');
    } else if (results.length === 0) {
      res.status(404).send('Tip nije pronadjen');
    } else {
      const name = results[0];
      const responseText = `name: ${name.name}`;
      res.send(results[0]); 
     
    }
  });
});

module.exports = router;
