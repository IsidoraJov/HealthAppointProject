import React, { useState, useEffect, useCallback } from "react";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Menu, MenuItem, Tab, Tabs, TextField, Autocomplete, Badge, Popover, List, ListItem, ListItemText} from "@mui/material";
import { AccountCircle,Notifications } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
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
  const [activeTab, setActiveTab] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [additionalText, setAdditionalText] = useState("");
  const [appointmentTypes, setAppointmentTypes] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/verify/notVerified");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);
  
  const fetchAppointments = useCallback(async (doctorId) => {
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
  }, []);
  
  const fetchDoctors = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }, []);
  
  const fetchPatients = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, []);
  
  const fetchAppointmentTypes = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/users/t");
      setAppointmentTypes(response.data);
    } catch (error) {
      console.error("Error fetching appointment types:", error);
    }
  }, []);
  
  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchAppointmentTypes();
    fetchNotifications();
  }, [fetchDoctors, fetchPatients, fetchAppointmentTypes, fetchNotifications]);
  

  const handleNotifOpen = (event) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchor(null);
  };

  const handleDismissNotification = (index) => {
    setNotifications((prevNotifications) => prevNotifications.filter((_, i) => i !== index));
  };

  const handleConfirmNotification = async (id, index) => {
    try {
      const response = await fetch(`http://localhost:8080/verify/confirm/${id}`, {
        method: "POST",
      });
  
      if (response.ok) {
        handleDismissNotification(index);
      } else {
        console.error("Failed to confirm appointment");
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };

  const handleSearch = () => {
    const filtered = patients.filter((patient) => {
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
      return (
        patient.jmbg.includes(searchTerm) ||
        fullName.includes(searchTerm.toLowerCase())
      );
    });
    setFilteredPatients(filtered);
  };

  const handleNavigateToPatient = (patientId) => {
    navigate(`/staff-patient-profile?id=${patientId}`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
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
      patientId: selectedPatient.id,
      doctorId: selectedDoctor.id,
      typeId: selectedType.id,
      start_time: startTime.format("YYYY-MM-DDTHH:mm"),
      end_time: endTime.format("YYYY-MM-DDTHH:mm"),
      additional_text: additionalText,
    };

    try {
      console.log("Data sent to server:", appointmentData);
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
      typeId: 1, 
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
       await axios.post("http://localhost:8080/patients/add", patientData);
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
      fetchPatients();
     // window.location.reload();
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
          <IconButton color="inherit" onClick={handleNotifOpen}>
  <Badge badgeContent={notifications.length} color="error">
    <Notifications />
  </Badge>
</IconButton>
<Popover
  open={Boolean(notifAnchor)}
  anchorEl={notifAnchor}
  onClose={handleNotifClose}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
>
  <List sx={{ width: 380, maxHeight: 400, overflowY: "auto" }}> 
    {notifications.length > 0 ? (
      notifications.map((notif, index) => (
        <ListItem
  key={index}
  divider
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 1,
    padding: 2,
    backgroundColor: "#F9F9F9",
    borderRadius: "8px",
    margin: "8px",
    position: "relative",
  }}
>
  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
    <ListItemText
      primary={
        <Typography variant="body1" fontWeight="bold">
          {notif.patient_first_name} {notif.patient_last_name} ({notif.patient_phone})
        </Typography>
      }
      secondary={
        <>
          <Typography variant="body2" color="textSecondary">
            <strong>Time:</strong> {new Date(notif.start_time).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Doctor:</strong> Dr. {notif.doctor_first_name} {notif.doctor_last_name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Type:</strong> {notif.appointment_type}
          </Typography>
        </>
      }
    />
    
    <IconButton edge="end" onClick={() => handleDismissNotification(index)} sx={{ alignSelf: "flex-start" }}>
      <CloseIcon />
    </IconButton>
  </Box>

  <Box sx={{ display: "flex", justifyContent: "flex-start", width: "100%", marginTop: 1 }}>
    <Button
      variant="contained"
      color="success"
      size="small"
      sx={{ textTransform: "none", fontSize: "0.8rem", padding: "4px 10px" }}
      onClick={() => handleConfirmNotification(notif.appointment_id,index)}
    >
      Confirm
    </Button>
  </Box>
</ListItem>

      ))
    ) : (
      <ListItem>
        <ListItemText primary="No pending verifications" />
      </ListItem>
    )}
  </List>
</Popover>


          <Typography variant="body1" sx={{ marginRight: 2 }}>
           John Doe
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar alt="John Doe">
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
          placeholder="Search Patiente by JMBG or Name"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 1, flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ backgroundColor: "#FF7043" }}
        >
          Search
        </Button>
      </Box>
 {/* Search Results */}
 {filteredPatients.length > 0 && (
        <Box sx={{ backgroundColor: "white", padding: 2, marginY: 2, borderRadius: 2, marginX: 2 }}>
          <Typography variant="h6">Search Results:</Typography>
          {filteredPatients.map((patient) => (
            <Box
              key={patient.id}
              sx={{ display: "flex", justifyContent: "space-between", padding: 1, borderBottom: "1px solid #ccc" }}
            >
              <Typography>{`${patient.first_name} ${patient.last_name} - ${patient.jmbg}`}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleNavigateToPatient(patient.id)}
              >
                View Profile
              </Button>
            </Box>
          ))}
        </Box>
      )}


      {/* Add Appointment Section */}
      <Box sx={{ backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 3, marginX: 2 }}>
  <Tabs value={activeTab} onChange={handleTabChange} centered>
    <Tab label="Add Appointment" />
    <Tab label="Add Patient" />
  </Tabs>

  {activeTab === 0 && (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>Add Appointment</Typography>
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
        getOptionLabel={(option) => `${option.first_name} ${option.last_name} -  ${option.jmbg}`}
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
      <Button variant="contained" color="primary" onClick={handleSaveAppointment}>Save Appointment</Button>
      <Button variant="contained" color="error" onClick={handleUrgentAppointment}>Urgent Appointment</Button>
    </Box>
  )}

  {activeTab === 1 && (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>Add Patient</Typography>
      <TextField label="First Name" variant="outlined" value={patientData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
      <TextField label="Last Name" variant="outlined" value={patientData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Birthday" value={patientData.birthday} onChange={(newValue) => handleInputChange("birthday", newValue)} renderInput={(params) => <TextField {...params} />} />
      </LocalizationProvider>
      <TextField label="JMBG" variant="outlined" value={patientData.jmbg} onChange={(e) => handleInputChange("jmbg", e.target.value)} />
      <TextField label="Phone" variant="outlined" value={patientData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
      <TextField label="Email" variant="outlined" value={patientData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
      <TextField label="Address" variant="outlined" value={patientData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
      <Autocomplete options={["Male", "Female"]} renderInput={(params) => <TextField {...params} label="Gender" />} value={patientData.gender} onChange={(event, value) => handleInputChange("gender", value)} />
      <TextField label="Marital Status" variant="outlined" value={patientData.maritalStatus} onChange={(e) => handleInputChange("maritalStatus", e.target.value)} />
      <TextField label="Emergency Contact" variant="outlined" value={patientData.emergencyContact} onChange={(e) => handleInputChange("emergencyContact", e.target.value)} />
      <TextField label="Language" variant="outlined" value={patientData.language} onChange={(e) => handleInputChange("language", e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleSavePatient}>Add Patient</Button>
    </Box>
  )}
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
