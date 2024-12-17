import React from "react";
import { AppBar, Toolbar, Typography, Box, Container, Grid, Button, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Mesečni prikaz kalendara
import interactionPlugin from "@fullcalendar/interaction";
import logo from "../assets/images/logoB.png";

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNavigate = (path) => {
    console.log(`Navigacija ka: ${path}`);
    // Ovde dodaj logiku za navigaciju, npr. navigate('/path')
  };

  const events = [
    { title: "Pregled kod dr. Jovana", start: new Date(), end: new Date() },
    { title: "Kontrola - dr. Marija", start: "2024-06-20T10:00:00", end: "2024-06-20T11:00:00" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#006A6A" }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#006A6A" }}>
        <Toolbar>
          <Box
            component="img"
            src={logo}
            alt="HealthAppoint Logo"
            sx={{ height: 50, marginRight: 2 }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HealthAppoint Dashboard
          </Typography>

          {/* Profil i dugme za navigaciju */}
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            Dr. John Doe
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar alt="Dr. John Doe">
              <AccountCircle />
            </Avatar>
          </IconButton>

          {/* Meni za profil */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleNavigate("/profile")}>Profile</MenuItem>
            <MenuItem onClick={() => handleNavigate("/login")}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Bar sa dugmićima ispod headera */}
      <Box sx={{ backgroundColor: "#004D4D", padding: 1, display: "flex", justifyContent: "center" }}>
        <Button color="inherit" onClick={() => handleNavigate("/patients")} sx={{ color: "white", marginX: 2 }}>
          Patients
        </Button>
        <Button color="inherit" onClick={() => handleNavigate("/doctors")} sx={{ color: "white", marginX: 2 }}>
          Doctors
        </Button>
        <Button color="inherit" onClick={() => handleNavigate("/departments")} sx={{ color: "white", marginX: 2 }}>
          Departments
        </Button>
      </Box>
    
        
      {/* Kalendar */}
      <Container sx={{ flexGrow: 1, marginY: 4 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
            <Typography variant="h5" gutterBottom align="center" color="white">
              Zakazani termini
            </Typography>

            <Box sx={{ marginBottom: 4 }}>
                
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginBottom: 2 }}>
                    <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => console.log("Add Patient")}
                    sx={{ backgroundColor: "#FF7043" }}
                    >
                    Add Patient
                    </Button>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={() => console.log("Add Appointment")}
                    sx={{ backgroundColor: "#4CAF50" }}
                    >
                    Add Appointment
                    </Button>
                </Box>
                </Box>  
            <Box sx={{ backgroundColor: "white", borderRadius: 2, boxShadow: 3, padding: 2 }}>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                editable
                selectable
                height="80vh"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ backgroundColor: "#004D4D", padding: 2, marginTop: "auto" }}>
        <Typography variant="body2" align="center" color="white">
          © 2024 HealthAppoint. 
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
