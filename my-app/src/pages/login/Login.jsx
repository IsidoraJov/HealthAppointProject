import React, { useState } from "react";
import { TextField, Button, Box, Typography, Link, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import logo from '../../assets/images/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Molimo vas da popunite sva polja.");
      return;
    }

    try {
      // Šifrovanje podataka
      const encryptedData = {
        username: CryptoJS.AES.encrypt(formData.username, "tajni_kljuc").toString(),
        password: CryptoJS.AES.encrypt(formData.password, "tajni_kljuc").toString(),
      };
      
      // Slanje zahteva na backend
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(encryptedData),
        credentials: "include", // Omogućava slanje i primanje kolačića
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Greška prilikom logovanja.");
      }

      localStorage.setItem('role_id', data.role_id);
      localStorage.setItem('userId', data.id);

      if (data.role_id === "1") {
       
        navigate("/dashboard",  { replace: true });
      } else if (data.role_id === "2") {
        navigate("/staffDashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Levi deo */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
      >
        <Box
          component="img"
          sx={{
            height: "100%", 
            width: "100%",  
            objectFit: "cover", 
          }}
          src={logo} 
          alt="Opis slike"
        />
      </Grid>
      {/* Desni deo */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Prijavite se
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Korisničko ime"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Lozinka"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#1976d2" }}
            >
              Prijavi se
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Zaboravili ste lozinku?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Nemate nalog? Registrujte se"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
