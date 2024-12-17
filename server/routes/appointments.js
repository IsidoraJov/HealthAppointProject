var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  
    connection.query('SELECT * FROM appointments', (err, results) => {
        if (err) {
          res.status(500).send('Greška pri dobijanju podataka.');
        } else {
          res.json(results)
          console.log(results);
        }
      });
});

router.post("/add", (req, res) => {
    const {
        patient_id,
        doctor_id,
        type_id,
        start_time,
        end_time,
        status,
        reminder_sent,
        confirmation_sent,
        additional_text,
    } = req.body;


    if (!patient_id || !doctor_id || !type_id || !start_time || !end_time || !status) {
        return res.status(400).json({ error: "Missing required fields." });
    }


    const sql = `
        INSERT INTO appointments 
        (patient_id, doctor_id, type_id, start_time, end_time, status, reminder_sent, confirmation_sent, additional_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        patient_id,
        doctor_id,
        type_id,
        start_time,
        end_time,
        status,
        reminder_sent || 0, // Default to 0 if not provided
        confirmation_sent || 0, // Default to 0 if not provided
        additional_text || "", // Default to empty string if not provided
    ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error adding appointment:", err);
            return res.status(500).json({ error: "Database error." });
        }
        res.status(201).json({
            message: "Appointment added successfully!",
            appointment_id: result.insertId,
        });
    });
});

module.exports = router;
