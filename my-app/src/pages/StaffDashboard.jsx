import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Container, Grid, Button, IconButton, Avatar, Menu, MenuItem, Tab, Tabs, TextField, Autocomplete, TextareaAutosize } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import logo from "../assets/images/logoB.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LocalizationProvider, DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const StaffDashboard = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [tabValue, setTabValue] = useState(0); // (0 - mesecni, 1 - dnevni)

  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [additionalText, setAdditionalText] = useState("");
  const [appointmentTypes, setAppointmentTypes] = useState([]);

  const fetchAppointments = async (doctorId) => {
    if (!doctorId) return;
    try {
      const response = await axios.get(`http://localhost:8080/appointments/${doctorId}`);
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

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchAppointmentTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users/t");
      setAppointmentTypes(response.data);
    } catch (error) {
      console.error("Error fetching appointment types:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchAppointmentTypes();
  }, []);

  const handleDoctorChange = async (doctor) => {
    setSelectedDoctor(doctor);
    if (doctor) {
      await fetchAppointments(doctor.id);
      try {
        const response = await axios.get(`http://localhost:8080/doctors/doctor/${doctor.id}`);
        const serverData = response.data;
        const busySlots = serverData.map((appointment) => ({
            id: appointment.id, 
            patientId: appointment.patient_id,
            title: appointment.title, 
            start: appointment.start, 
            end: appointment.end,   
        }));
        setEvents(busySlots);
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
      }
    } else {
      setEvents([]);
    }
    
  };

  const handleSaveAppointment = async () => {
    if (!selectedDoctor || !selectedPatient || !selectedType || !startTime || !endTime) {
      alert("All fields are required!");
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor.id,
      patientId: selectedPatient.id,
      typeId: selectedType.id,
      startTime: startTime.format("YYYY-MM-DDTHH:mm"),
      endTime: endTime.format("YYYY-MM-DDTHH:mm"),
      additionalText: additionalText,
    };

    try {
      await axios.post("http://localhost:8080/appointments/add", appointmentData);
      alert(`Appointment successfully scheduled with Dr. ${selectedDoctor.first_name} ${selectedDoctor.last_name} for patient ${selectedPatient.first_name} ${selectedPatient.last_name} at ${startTime.format("HH:mm on DD-MM-YYYY")}.`);
      setSelectedDoctor(null);
      setSelectedPatient(null);
      setSelectedType(null);
      setStartTime(null);
      setEndTime(null);
      setAdditionalText("");
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment.");
    }
  };

  const handleUrgentAppointment = async () => {
    if (!selectedDoctor || !selectedPatient) {
      alert("Doctor and Patient must be selected for an urgent appointment!");
      return;
    }

    const urgentAppointmentData = {
      doctorId: selectedDoctor.id,
      patientId: selectedPatient.id,
      typeId: 1, // Assume 1 is the ID for a default urgent appointment type
      startTime: dayjs().format("YYYY-MM-DDTHH:mm"),
      endTime: dayjs().add(30, 'minute').format("YYYY-MM-DDTHH:mm"),
      additionalText: "Urgent appointment automatically scheduled.",
    };

    try {
      await axios.post("http://localhost:8080/appointments/add", urgentAppointmentData);
      alert(`Urgent appointment successfully scheduled with Dr. ${selectedDoctor.first_name} ${selectedDoctor.last_name} for patient ${selectedPatient.first_name} ${selectedPatient.last_name}.`);
    } catch (error) {
      console.error("Error saving urgent appointment:", error);
      alert("Failed to save urgent appointment.");
    }
  };

  const handleDateSelect = (selectInfo) => {
    const start = dayjs(selectInfo.start); // Konvertovanje starta u dayjs objekat
    const end = dayjs(selectInfo.end);     // Konvertovanje enda u dayjs objekat
  
    setStartTime(start);
    setEndTime(end);
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
            <MenuItem onClick={() => navigate("/staff-profile")}>Profile</MenuItem>
            <MenuItem onClick={() => navigate("/login")}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    
    {/* Search and Navigation */}
    <Box sx={{ backgroundColor: "#004D4D", padding: 2, display: "flex", gap: 2, marginX: 2, borderRadius: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search Patiente"
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
            options={doctors}
            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
            renderInput={(params) => <TextField {...params} label="Doctor" />}
            onChange={(event, value) => handleDoctorChange(value)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            events={events}
            editable={false}
            selectable={true}
            selectMirror={true}
            select={handleDateSelect}
            height="auto"
            slotDuration="00:30:00"
          />
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
            renderInput={(params) => <TextField {...params} label="Patient" />}
            onChange={(event, value) => setSelectedPatient(value)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
          <Autocomplete
            options={appointmentTypes}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Appointment Type" />}
            onChange={(event, value) => setSelectedType(value)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            label="Additional Text"
            multiline
            rows={4}
            value={additionalText}
            onChange={(e) => setAdditionalText(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAppointment}
          >
            Save Appointment
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleUrgentAppointment}
          >
            Urgent Appointment
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
