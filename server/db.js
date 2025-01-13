const mysql = require('mysql2');

// Kreiranje konekcije sa MySQL bazom
const connection = mysql.createConnection({
  host: 'localhost', 
  database: 'healthappoint'  ,
  user: 'root',       
  password: ''
});


connection.connect((err) => {
  if (err) {
    console.error('Greška prilikom povezivanja sa bazom: ', err);
  } else {
    console.log('Povezivanje sa bazom uspešno!');
  }
});

module.exports = connection;

module.exports.closeConnection = () => {
  connection.end((err) => {
    if (err) console.error("Error closing database connection:", err);
  });
};