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
//ispravi za profile pacijenata
router.get('/perPatient', (req, res) => {
  
  const { firstName, lastName } = req.query; // Očekujemo query parametre

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }
  console.log('GET /reports called with:', req.query);
  // Prvo pronalazimo pacijenta po imenu i prezimenu
  const getPatientQuery = `
    SELECT id FROM patients 
    WHERE first_name = ? AND last_name = ?
  `;

  connection.query(getPatientQuery, [firstName, lastName], (err, patientResults) => {
    if (err) {
      console.error('Error querying patients:', err.message);
      return res.status(500).json({ error: 'Database error 1' });
    }

    if (patientResults.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patientId = patientResults[0].id;
  
    console.log(patientId);
    // Zatim dohvatamo sve termine za tog pacijenta
    const getAppointmentsQuery = `
      SELECT id FROM appointments 
      WHERE patient_id = ?
    `;

    connection.query(getAppointmentsQuery, [patientId], (err, appointmentResults) => {
      if (err) {
        console.error('Error querying appointments:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      if (appointmentResults.length === 0) {
        return res.status(404).json({ error: 'No appointments found for the patient' });
      }

      // Izvlačimo ID-jeve termina
      const appointmentIds = appointmentResults.map((appointment) => appointment.id);

      // Dohvatamo sve izveštaje za te termine
      const getReportsQuery = `
        SELECT * FROM reports 
        WHERE appointment_id IN (?)
      `;

      connection.query(getReportsQuery, [appointmentIds], (err, reportResults) => {
        if (err) {
          console.error('Error querying reports:', err.message);
          return res.status(500).json({ error: 'Database error' });
        }

        if (reportResults.length === 0) {
          return res.status(404).json({ error: 'No reports found for the appointments' });
        }

        // Vraćamo sve izveštaje u JSON formatu
        return res.json(reportResults);
      });
    });
  });
});

module.exports = router;
