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

var app = express();

const PORT = 8080;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const connection = require('./db'); 

//const plainPassword = 'pass13!'; // Primer lozinke
//const hashedPassword = bcrypt.hashSync(plainPassword, 10); // Generiše bcrypt hash sa 10 salt rounds
//console.log('Hashed password:', hashedPassword);

app.use(cors({
  origin: 'http://localhost:3000' ,
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
app.use(cookieParser());
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

module.exports = app;