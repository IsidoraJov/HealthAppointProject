var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

require('dotenv').config();
const rateLimit = require("express-rate-limit");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var doctorsRouter = require('./routes/doctors');
var appointmentsRouter = require('./routes/appointments');
var patientsRouter = require('./routes/patients');
var reportsRouter = require('./routes/reports');
var { router: verify, scheduleEmail }  = require('./routes/verify');

var app = express();

const PORT = 8080;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const connection = require('./db'); 

//const plainPassword = 'pass123'; 
//const hashedPassword = bcrypt.hashSync(plainPassword, 10); // Generiše bcrypt hash sa 10 salt rounds
//console.log('Hashed password:', hashedPassword);

app.use(cors({
  origin: 'https://healthappoint.onrender.com' ,
  credentials: true,  
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reports', reportsRouter);
app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/patients', patientsRouter);
app.use('/verify', verify);

app.use(cookieParser());
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://healthappoint.onrender.com");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

function scheduleEmailsForUnverifiedAppointments() {
  connection.query(
    `
      SELECT a.id, a.start_time, a.confirmation_sent, 
             p.id AS patient_id, p.first_name, p.last_name, p.email 
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.id
      WHERE a.confirmation_sent = 0 
        AND a.start_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR)
    `,
    function (error, results) {
      if (error) {
        console.error("Greška pri preuzimanju termina:", error);
        return;
      }

      results.forEach((appointment) => {
        const patient = {
          id: appointment.patient_id,
          first_name: appointment.first_name,
          last_name: appointment.last_name,
          email: appointment.email
        };

        scheduleEmail(patient, appointment);
      });
    }
  );
}


// Ruta za zaštićene podatke
app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    res.json({ message: "Welcome to the protected route.", user });
  });
});

if (require.main === module) {
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  scheduleEmailsForUnverifiedAppointments();
});
}

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


module.exports = app;