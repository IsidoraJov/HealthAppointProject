var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var doctorsRouter = require('./routes/doctors');
var appointmentsRouter = require('./routes/appointments');
var patientsRouter = require('./routes/patients');
var reportsRouter = require('./routes/reports');


var app = express();

const PORT = 8080;

const jwt = require("jsonwebtoken"); // Za generisanje tokena
const bcrypt = require("bcrypt"); // Za šifrovanje lozinki

const connection = require('./db'); 




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reports', reportsRouter);
app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/patients', patientsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const users = [
  { id: 1, username: "user1", password: bcrypt.hashSync("password1", 10) },
  { id: 2, username: "user2", password: bcrypt.hashSync("password2", 10) },
];

// Tajna za JWT
const JWT_SECRET = "tajni_kljuc";

// Ruta za logovanje
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Nevažeći podaci za logovanje." });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Nevažeći podaci za logovanje." });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Ruta za zaštićene podatke
app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Nedostaje token." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Nevažeći token." });
    res.json({ message: "Dobrodošli u zaštićenu rutu.", user });
  });
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
})

module.exports = app;
