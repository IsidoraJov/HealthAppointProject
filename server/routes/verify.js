const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
require('dotenv').config();
var express = require('express');
const connection = require('../db');
const moment = require('moment');
require('moment/locale/sr');
var router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

function sendVerificationEmail(patient, appointmentId) {
  const token = jwt.sign({ patientId: patient.id, appointmentId }, JWT_SECRET, {
    expiresIn: '24h',
  });

  const query = `
    SELECT a.id, a.start_time, a.type_id, a.doctor_id, p.last_name, p.gender, 
           d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, 
           at.name AS appointment_type
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctor d ON a.doctor_id = d.id
    JOIN appointments_type at ON a.type_id = at.id
    WHERE a.id = ?
  `;

  connection.query(query, [appointmentId], (err, results) => {
    if (err || results.length === 0) {
      console.error('Greška pri dobijanju podataka:', err);
      return;
    }
    
    const appointment = results[0];
    const formattedDate = moment(appointment.start_time).locale('sr').format('dddd, D. MMMM YYYY. u HH:mm');
    const greeting = appointment.gender === 'female' ? 'Poštovana' : 'Poštovani';
    const title = appointment.gender === 'female' ? 'gospođo' : 'gospodine';

    const verifyUrl = `http://localhost:3000/verify?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: 'Potvrda zakazanog termina',
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
        <h2 style="color: #007f7f;">${greeting} ${title} ${appointment.last_name},</h2>
        <p style="font-size: 16px; color: #333;">Imate zakazan termin:</p>
        <p style="font-size: 18px; font-weight: bold; color: #007f7f;">${appointment.appointment_type}</p>
        <p style="font-size: 16px; color: #333;">Datum i vreme: <strong>${formattedDate}h</strong></p>
        <p style="font-size: 16px; color: #333;">Kod doktora: <strong>Dr ${appointment.doctor_first_name} ${appointment.doctor_last_name}</strong></p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; text-decoration: none; color: white; background-color: #007f7f; border-radius: 5px; font-size: 16px;">Potvrdi termin</a>
        <p style="font-size: 14px; color: #666;">Ako niste vi zakazali ovaj termin, ignorišite ovu poruku.</p>
      </div>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('Greška pri slanju emaila:', err);
      else console.log(`Email poslat: ${info.response}`);
    });
  });
}

router.post("/confirm/:id", (req, res) => {
  const appointmentId = req.params.id;

  const checkQuery = "SELECT confirmation_sent FROM appointments WHERE id = ?";
  const updateQuery = "UPDATE appointments SET confirmation_sent = 1 WHERE id = ?";

  connection.query(checkQuery, [appointmentId], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: "Appointment not found" });
      }

      if (results[0].confirmation_sent === 1) {
          return res.status(200).json({ message: "Appointment already confirmed" });
      }

      connection.query(updateQuery, [appointmentId], (err) => {
          if (err) {
              console.error("Error updating confirmation:", err);
              return res.status(500).json({ error: "Database update error" });
          }
          res.status(200).json({ message: "Appointment confirmed successfully" });
      });
  });
});


router.get('/test', (req, res) => {
  const testPatient = {
    id: 23,
    email: 'isidorajov97@gmail.com' 
  };
  const testAppointmentId = 62; 

  sendVerificationEmail(testPatient, testAppointmentId);
  res.send('Testni email je poslat!');
});

router.get('/notVerified', (req, res) => {
  const query = `
      SELECT a.id AS appointment_id, a.start_time, a.patient_id, a.doctor_id, a.type_id,
             p.first_name AS patient_first_name, p.last_name AS patient_last_name, p.phone AS patient_phone,
             d.first_name AS doctor_first_name, d.last_name AS doctor_last_name,
             t.name AS appointment_type
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctor d ON a.doctor_id = d.id
      JOIN appointments_type t ON a.type_id = t.id
      WHERE a.confirmation_sent = 0 
        AND a.start_time BETWEEN NOW() + INTERVAL 1 HOUR 
        AND DATE_ADD(NOW(), INTERVAL 25 HOUR)
  `;

  connection.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching unverified appointments:", err);
          return res.status(500).json({ error: "Internal server error" });
      }


      res.json(results);
  });
});


router.get('/verify', (req, res) => {
  const { token } = req.query;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {

    if (err) return res.status(400).send('Invalid or expired link.');
    const { patientId, appointmentId } = decoded;

    connection.query(
      'UPDATE appointments SET confirmation_sent = 1 WHERE id = ? AND patient_id = ?',
      [appointmentId, patientId],
      (err, result) => {
        if (err || result.affectedRows === 0) {
          return res.status(400).send('Verification failed.');
        }
        res.send('Termin je uspešno potvrđen.');

      }
    );
  });
});



function scheduleEmail(patient, appointment) {
  const appointmentDate = new Date(appointment.start_time);
  const now = new Date();
  const diffInHours = (appointmentDate - now) / (1000 * 60 * 60); // Razlika u satima

  if (diffInHours > 24) {
    console.log(`Termin ${appointment.id} nije u narednih 24h, preskačem.`);
    return;
  }

  console.log(`Šaljem email odmah za termin ${appointment.id}, zakazan u ${appointment.start_time}`);

  try {
    sendVerificationEmail(patient, appointment.id);
    console.log(`Email poslat za termin ${appointment.id}`);
  } catch (error) {
    console.error(`Greška pri slanju emaila za termin ${appointment.id}:`, error);
  }
}


module.exports = { router, scheduleEmail };