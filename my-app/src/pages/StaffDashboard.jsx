import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Container, Grid, Button, IconButton, Avatar, Menu, MenuItem, Tab, Tabs, TextField, Autocomplete } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import logo from "../assets/images/logoB.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const StaffDashboard = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const [tabValue, setTabValue] = useState(0); // (0 - mesecni, 1 - dnevni)

  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/appointments");
      const serverData = response.data;
      const formattedEvents = serverData.map((appointment) => ({
        id: appointment.id, 
        patientId: appointment.patient_id,
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

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const handleSaveAppointment = () => {
    if (!selectedDoctor || !selectedPatient || !selectedType || !startTime || !endTime) {
      alert("All fields are required!");
      return;
    }
    const appointmentData = {
      doctor: selectedDoctor,
      patient: selectedPatient,
      type: selectedType,
      start_time: startTime,
      end_time: endTime,
    };
    console.log("Appointment Data:", appointmentData);
  };

  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    birthday: null,
    jmbg: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    maritalStatus: "",
    emergencyContact: "",
    language: "",
  });

  const handleInputChange = (field, value) => {
    setPatientData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSavePatient = async () => {
    try {
      const response = await axios.post("http://localhost:8080/patients/add", patientData);
      alert("Patient added successfully!");
      setPatientData({
        firstName: "",
        lastName: "",
        birthday: null,
        jmbg: "",
        phone: "",
        email: "",
        address: "",
        gender: "",
        maritalStatus: "",
        emergencyContact: "",
        language: "",
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("An error occurred while adding the patient.");
    }
  };

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
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            Dr. John Doe
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar alt="Dr. John Doe">
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <MenuItem onClick={() => navigate("/login")}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Search and Navigation */}
      <Box sx={{ backgroundColor: "#004D4D", padding: 2, display: "flex", gap: 2, marginX: 2, borderRadius: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search Doctor"
          size="small"
          sx={{ backgroundColor: "white", borderRadius: 1, flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Search Doctor")}
          sx={{ backgroundColor: "#FF7043" }}
        >
          Search
        </Button>
      </Box>

      {/* Add Appointment Section */}
      <Box sx={{ backgroundColor: "white", padding: 4, marginY: 2, borderRadius: 2, boxShadow: 3, marginX: 2 }}>
        <Typography variant="h6" gutterBottom>Add Appointment</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Autocomplete
            options={[]}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Doctor" />}
            onChange={(event, value) => setSelectedDoctor(value)}
          />
          <Autocomplete
            options={[]}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Patient" />}
            onChange={(event, value) => setSelectedPatient(value)}
          />
          <Autocomplete
            options={[]}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Appointment Type" />}
            onChange={(event, value) => setSelectedType(value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAppointment}
          >
            Save Appointment
          </Button>
        </Box>
      </Box>

      {/* Add Patient Section */}
      <Box sx={{ backgroundColor: "white", padding: 4, marginY: 2, borderRadius: 2, boxShadow: 3, marginX: 2 }}>
        <Typography variant="h6" gutterBottom>Add Patient</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="First Name"
            variant="outlined"
            value={patientData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={patientData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Birthday"
              value={patientData.birthday}
              onChange={(newValue) => handleInputChange("birthday", newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            label="JMBG"
            variant="outlined"
            value={patientData.jmbg}
            onChange={(e) => handleInputChange("jmbg", e.target.value)}
          />
          <TextField
            label="Phone"
            variant="outlined"
            value={patientData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={patientData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <TextField
            label="Address"
            variant="outlined"
            value={patientData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
          <Autocomplete
            options={["Male", "Female"]}
            renderInput={(params) => <TextField {...params} label="Gender" />}
            value={patientData.gender}
            onChange={(event, value) => handleInputChange("gender", value)}
          />
          <TextField
            label="Marital Status"
            variant="outlined"
            value={patientData.maritalStatus}
            onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
          />
          <TextField
            label="Emergency Contact"
            variant="outlined"
            value={patientData.emergencyContact}
            onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
          />
          <TextField
            label="Language"
            variant="outlined"
            value={patientData.language}
            onChange={(e) => handleInputChange("language", e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSavePatient}
          >
            Add Patient
          </Button>
        </Box>
      </Box>

      {/* Search Doctor Section */}
      <Box sx={{ backgroundColor: "white", padding: 4, marginY: 2, borderRadius: 2, boxShadow: 3, marginX: 2 }}>
        <Typography variant="h6" gutterBottom>Search Doctor</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Enter Doctor Name"
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log("Search Doctor")}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ backgroundColor: "#004D4D", padding: 2, marginTop: "auto" }}>
        <Typography variant="body2" align="center" color="white">
          © 2024 HealthAppoint. 
        </Typography>
      </Box>
    </Box>
  );
};

export default StaffDashboard;
