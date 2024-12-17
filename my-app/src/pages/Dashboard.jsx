import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Container, Grid, Button, IconButton, Avatar, Menu, MenuItem , Tab, Tabs} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import logo from "../assets/images/logoB.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Dashboard = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const [tabValue, setTabValue] = useState(0); // (0 - mesecni, 1 - dnevni)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue); 
  };

  const handleNavigate = (path) => {
    console.log(`Navigacija ka: ${path}`);
    //  logiku 
  }; 
  const navigate = useNavigate();


  const [events, setEvents] = useState([]);
  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/appointments");
      const serverData = response.data;

    
      const formattedEvents = serverData.map((appointment) => ({
            id: appointment.id, 
            title: appointment.title, 
            start: appointment.start, 
            end: appointment.end,   
        }));

        setEvents(formattedEvents); 
        } catch (error) {
        console.error("Error fetching appointments:", error);
        }
    };

    
    useEffect(() => {
        fetchAppointments();
    }, []);

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
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <MenuItem onClick={() => handleNavigate("/login")}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Bar sa dugmićima ispod headera */}
      <Box sx={{ backgroundColor: "#004D4D", padding: 1, display: "flex", justifyContent: "center" }}>
        <Button color="inherit" onClick={() => handleNavigate("/patients")} sx={{ color: "white", marginX: 2 }}>
          Patients
        </Button>
        <Button color="inherit" onClick={() => navigate("/doctors")} sx={{ color: "white", marginX: 2 }}>
          Doctors
        </Button>
        <Button color="inherit" onClick={() => handleNavigate("/departments")} sx={{ color: "white", marginX: 2 }}>
          Departments
        </Button>
      </Box>
    
        
      {/* Kalendar */}
      <Container sx={{ flexGrow: 1, marginY: 2 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h4" gutterBottom align="center" color="white">
            Scheduled Appointments
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
             {/* <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                editable
                selectable
                height="80vh"
              />*/}
              <Box sx={{ width: '100%' }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Monthly view" />
        <Tab label="Daily view" />
      </Tabs>

      <Box sx={{ padding: '20px' }}>
       
        {tabValue === 0 && (
          <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                editable
                selectable
                height="80vh"
          />
        )}

        {/* FullCalendar za dnevni prikaz */}
        {tabValue === 1 && (
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay" // Dnevni prikaz
            events={events}
          />
        )}
      </Box>
    </Box>
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