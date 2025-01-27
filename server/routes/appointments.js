var express = require('express');
var router = express.Router();
const connection = require('../db');

function validateId(req, res, next) {
  const id = req.params.id || req.body.id;
  const maliciousPatterns = /(\bOR\b|\bAND\b|;|--|\/\*|\*\/|\bDROP\b|\bDELETE\b)/i;

  if (maliciousPatterns.test(id)) {
    return res.status(400).json({ error: "Invalid input detected." });
  }
  next();
};

router.get('/:id', validateId, function(req, res, next) {

  const userId = req.params.id;

    const query = `
    SELECT appointments.id, appointments.start_time, appointments.end_time, appointments.patient_id, patients.first_name, patients.last_name
    FROM appointments
    JOIN patients ON appointments.patient_id = patients.id
    WHERE appointments.doctor_id = ?
  `; 
  connection.query(query, [userId], (err, results) => {
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
function validateInput(req, res, next) {
  const { patientId, doctorId, typeId, start_time, end_time } = req.body;
  const maliciousPatterns = /(\bOR\b|\bAND\b|;|--|\/\*|\*\/|\bDROP\b|\bDELETE\b)/i;

  if (
    maliciousPatterns.test(patientId) ||
    maliciousPatterns.test(doctorId) ||
    maliciousPatterns.test(typeId) ||
    maliciousPatterns.test(start_time) ||
    maliciousPatterns.test(end_time)
  ) {
    return res.status(400).json({ error: "Invalid input detected." });
  }
  next();
}


router.post("/add", validateInput, (req, res) => {
  const { patientId, doctorId, typeId, start_time, end_time, additional_text } = req.body;

  if (!patientId || !doctorId || !typeId || !start_time || !end_time) {
      return res.status(400).json({ error: "Missing required fields." });
  }
  

      const sqlInsert = `
          INSERT INTO appointments 
          (patient_id, doctor_id, type_id, start_time, end_time, status, reminder_sent, confirmation_sent, additional_text)
          VALUES (?, ?, ?, ?, ?, 'scheduled', 0, 0, ?)
      `;

      connection.query(
          sqlInsert,
          [patientId, doctorId, typeId, start_time, end_time, additional_text],
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

router.post("/check-add", validateInput, (req, res) => {
  const { patientId, doctorId, typeId, start_time, end_time, additional_text } = req.body;

  if (!patientId || !doctorId || !typeId || !start_time || !end_time) {
    return res.status(400).json({ error: "Missing required fields." });
  }


  const sqlCheckAvailability = `
    SELECT *
    FROM appointments
    WHERE doctor_id = ?
      AND (
        (start_time BETWEEN ? AND ?) OR
        (end_time BETWEEN ? AND ?) OR
        (start_time <= ? AND end_time >= ?)
      )
  `;

  const availabilityValues = [
    doctorId,
    start_time,
    end_time,
    start_time,
    end_time,
    start_time,
    end_time,
  ];

  connection.query(sqlCheckAvailability, availabilityValues, (err, results) => {
    if (err) {
      console.error("Error checking doctor availability:", err);
      return res.status(500).json({ error: "Internal server error." });
    }

    if (results.length > 0) {
      // Doktor nije slobodan
      return res.status(409).json({ error: "Doctor is not available in the given time slot." });
    }

    // Doktor je slobodan
    const sqlInsert = `
      INSERT INTO appointments 
      (patient_id, doctor_id, type_id, start_time, end_time, status, reminder_sent, confirmation_sent, additional_text)
      VALUES (?, ?, ?, ?, ?, 'scheduled', 0, 0, ?)
    `;

    connection.query(
      sqlInsert,
      [patientId, doctorId, typeId, start_time, end_time, additional_text],
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
  console.log("Request received for /type");
    connection.query('SELECT * FROM appointments_type', (err, results) => {
        if (err) {
            console.error("Database error:", err);
            res.status(500).send('Greška pri dobijanju podataka.');
        } else {
            console.log("Query results:", results);
            res.json(results);
        }
    });
});

router.get('/type/:id',validateId, function(req, res, next) {
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
