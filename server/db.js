const mysql = require('mysql2');

/*
const connection = mysql.createConnection({
  host: 'localhost', 
  database: 'healthappoint'  ,
  user: 'root',       
  password: ''
});
*/
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
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