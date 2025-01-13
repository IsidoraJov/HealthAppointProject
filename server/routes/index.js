var express = require('express');
var router = express.Router();
const connection = require('../db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var cookieParser = require('cookie-parser');
require('dotenv').config();
const rateLimit = require("express-rate-limit");
const JWT_SECRET = process.env.JWT_SECRET; 
const cors = require("cors");
const CryptoJS = require("crypto-js");

router.use(cors({
  origin: 'http://localhost:3000' ,
  credentials: true,  
}));

router.use(cookieParser());
// Ručni CORS kao dodatak
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Preflight zahtevi
  }
  next();
});

// Rate limiter for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: "Too many login attempts. Please try again later.",
});


// Ruta za logovanje sa rate limiterom
router.post("/login",loginLimiter, (req, res) => {

  console.log("Login route hit");
  console.log("Request body:", req.body); 
  const { username, password } = req.body;

  // Dešifrovanje podataka
  try {
    const decryptedUsername = CryptoJS.AES.decrypt(username, "tajni_kljuc").toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(password, "tajni_kljuc").toString(CryptoJS.enc.Utf8);
   

    connection.query(
      "SELECT id, password, '2' as role_id FROM user WHERE username = ? UNION SELECT id, password, '1' as role_id FROM doctor WHERE username = ?",
      [decryptedUsername, decryptedUsername],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Internal server error." });
        }

        if (results.length === 0) {
          
          return res.status(401).json({ message: "Invalid username or password." });
        }

        const user = results[0];
        const userPassword = CryptoJS.AES.decrypt(user.password, "tajni_kljuc").toString(CryptoJS.enc.Utf8);
        const isPasswordValid = bcrypt.compareSync(decryptedPassword, user.password);
     
        if (!isPasswordValid) {
      
          
          return res.status(401).json({ message: "Invalid username or password." });
        }

        const token = jwt.sign({ id: user.id, role_id: user.role_id }, JWT_SECRET, {
          expiresIn: "1h",
        });

        // Postavljanje httpOnly kolačića
        res.cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Koristi secure samo u produkciji
          sameSite: "strict",
          maxAge: 60 * 60 * 1000, // 1 sat
        });

        // Vraćanje role_id kao odgovor (ako je potrebno)
        res.json({ role_id: user.role_id, 
                   id: user.id
                   
        });
      }
    );
  } catch (err) {
    console.error("Decryption error:", err);
    return res.status(400).json({ message: "Invalid encrypted data." });
  }
});

router.post('/logout', (req, res) => {
  console.log("req");
  res.cookie('auth_token', '', {
    httpOnly: true,      // HttpOnly za sigurnost
    secure: true,        // Secure ako koristite HTTPS
    sameSite: 'strict',  // Sprečava CSRF napade
    expires: new Date(0) // Datum isteka postavljen na prošlost
  });

  // Slanje odgovora o uspešnoj odjavi
  return res.status(200).json({ message: 'Logout successful' });
});
router.get("/test", (req, res) => {
  res.send("Backend radi!");
});
module.exports = router;