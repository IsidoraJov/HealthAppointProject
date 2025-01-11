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

  router.post("/check-availability", (req, res) => {
    const { doctor_id, start_time, end_time } = req.body;
  
    if (!doctor_id || !start_time || !end_time) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    const sql = `
      SELECT *
      FROM appointments
      WHERE doctor_id = ?
        AND (
          (start_time BETWEEN ? AND ?) OR
          (end_time BETWEEN ? AND ?) OR
          (start_time <= ? AND end_time >= ?)
        )
    `;
  
    const values = [doctor_id, start_time, end_time, start_time, end_time, start_time, end_time];
  
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error checking doctor availability:", err);
        return res.status(500).json({ message: "Internal server error." });
      }
  
      if (results.length > 0) {
        // Ako postoji preklapanje termina
        return res.status(200).json({ available: false });
      }
  
      // Ako nema preklapanja termina
      return res.status(200).json({ available: true });
    });
  });

  router.get("/available-slots", async (req, res) => {
    const { firstName, lastName, date } = req.query;
  
    try {
      // Pronađi doktora prema imenu i prezimenu
      const doctorQuery = `
        SELECT id 
        FROM doctors 
        WHERE first_name = ? AND last_name = ?
      `;
      const [doctor] = await db.execute(doctorQuery, [firstName, lastName]);
  
      if (doctor.length === 0) {
        return res.status(404).json({ error: "Doctor not found" });
      }
  
      const doctorId = doctor[0].id;
  
      // Pronađi sve termine doktora za zadati datum
      const appointmentsQuery = `
        SELECT start_time, end_time 
        FROM appointments 
        WHERE doctor_id = ? AND DATE(start_time) = ?
      `;
      const [appointments] = await db.execute(appointmentsQuery, [doctorId, date]);
  
      // Definiši radno vreme (primer: 08:00 - 16:00)
      const workingHours = {
        start: "08:00",
        end: "16:00",
      };
  
      // Generiši sve slotove u radnom vremenu
      const allSlots = generateTimeSlots(workingHours.start, workingHours.end, 30); // 30 minuta po slotu
  
      // Filtriraj slobodne slotove
      const availableSlots = allSlots.filter((slot) => {
        return !appointments.some((appointment) => 
          isTimeOverlap(slot.start, slot.end, appointment.start_time, appointment.end_time)
        );
      });
  
      res.json(availableSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Pomoćne funkcije
  function generateTimeSlots(start, end, duration) {
    const slots = [];
    let current = start;
  
    while (current < end) {
      const next = addMinutes(current, duration);
      slots.push({ start: current, end: next });
      current = next;
    }
  
    return slots;
  }
  
  function addMinutes(time, minutes) {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes, 0);
    return date.toTimeString().slice(0, 5);
  }
  
  function isTimeOverlap(start1, end1, start2, end2) {
    return !(end1 <= start2 || start1 >= end2);
  }

module.exports = router;
