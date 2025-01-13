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

router.get('/getDoctorId', (req, res) => {

  
  const { firstName, lastName } = req.query;

  
  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  
  const query = `
    SELECT id FROM doctor 
    WHERE first_name = ? AND last_name = ?
    LIMIT 1
  `;

  connection.query(query, [firstName, lastName], (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const patientId = results[0].id;
    res.json({ doctorId });
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
 
  router.get("/oo", (req, res) => {
    res.send("Backend radi!");
  });

  router.get("/available-slots", async (req, res) => {
    const { doctorId, date } = req.query;
  
    // Provera obaveznih parametara
    if (!doctorId || !date) {
      return res.status(400).json({ message: "Missing required query parameters." });
    }
  
    // Validacija formata datuma
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }
  
    try {
      // Izračunavamo početak i kraj dana za zadati datum
      const startOfDay = `${date} 00:00:00`;
      const endOfDay = `${date} 23:59:59`;
  
      // SQL upit
      const appointmentsQuery = `
        SELECT start_time, end_time 
        FROM appointments 
        WHERE doctor_id = ? AND start_time BETWEEN ? AND ?
      `;
  
      console.log("Executing query:", appointmentsQuery, [doctorId, startOfDay, endOfDay]);
  
      // Izvršavanje upita
      connection.query(appointmentsQuery, [doctorId, startOfDay, endOfDay], (err, rows) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ message: "Server error" });
        }
  
        console.log("Query results:", rows);
  
        // Formatiranje rezultata
        const appointments = rows.map((appointment) => ({
          start: new Date(appointment.start_time).toISOString().slice(11, 16),
          end: new Date(appointment.end_time).toISOString().slice(11, 16),
        }));
  
        console.log("Formatted appointments:", appointments);
  
        // Definišemo radno vreme
        const workingHours = {
          start: "08:00",
          end: "20:00",
        };
  
        // Generišemo slotove
        const allSlots = generateTimeSlots(workingHours.start, workingHours.end, 30);
  
        // Filtriramo dostupne slotove
        const availableSlots = allSlots.filter((slot) => {
          return !appointments.some((appointment) =>
            isTimeOverlap(slot.start, slot.end, appointment.start, appointment.end)
          );
        });
  
        console.log("Available slots:", availableSlots);
  
        // Vraćamo rezultat
        res.json(availableSlots);
      });
    } catch (error) {
      console.error("Error fetching available slots:", error.message);
      res.status(500).json({ message: "Server error." });
    }
  });
  
  // Pomoćne funkcije (ostaju iste)
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
  
  router.get('/doctor/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'SELECT * FROM doctor WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Greška pri izvršavanju upita:', err);
            res.status(500).send('Greška na serveru');
        } else if (results.length === 0) {
          console.log("ovde bacio gresku");
            res.status(404).send('Korisnik nije pronađen');
        } else {
            const doctor = results[0];
            res.json({
                firstName: doctor.first_name,
                lastName: doctor.last_name,
                email: doctor.email,
                specialization: doctor.subspecialization
            });
        }
    });
});

module.exports = router;
