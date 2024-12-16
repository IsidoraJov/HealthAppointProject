import React, { useState } from "react";
import { TextField, Button, Box, Typography, Link, Grid, Paper } from "@mui/material";
import logo from '../../assets/images/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    // Ovde dodaj logiku za autentifikaciju
    if (!formData.username || !formData.password) {
      setError("Molimo vas da popunite sva polja.");
      return;
    }
    alert("Prijavljeni ste!");
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
        height: "100%", // Slika pokriva celu visinu
        width: "100%",  // Slika pokriva celu širinu
        objectFit: "cover", // Slika se skalira bez izobličenja
      }}
      src={logo} // Koristi importovanu sliku
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
