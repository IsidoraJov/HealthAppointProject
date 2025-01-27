const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

const JWT_SECRET = process.env.JWT_SECRET;


function sendVerificationEmail(patient, appointmentId) {
  const token = jwt.sign({ patientId: patient.id, appointmentId }, JWT_SECRET, {
    expiresIn: '24h',
  });

  const verifyUrl = `http://localhost:3000/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: patient.email,
    subject: 'Potvrda termina',
    html: `<p>Potvrdite termin klikom na link:</p><a href="${verifyUrl}">Potvrdi termin</a>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log(`Email sent: ${info.response}`);
  });
}


app.get('/verify', (req, res) => {
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
  const appointmentDate = new Date(appointment.time);
  const emailTime = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);

  schedule.scheduleJob(emailTime, () => {
    sendVerificationEmail(patient, appointment.id);
  });
}
