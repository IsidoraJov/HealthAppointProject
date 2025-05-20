import React, { useState, useEffect, useCallback } from "react";
import { Divider, Grid, AppBar, Toolbar, Typography, Box, Container, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PatientProfileStaff = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("id");
  const [patientData, setPatientData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  
  const fetchPatientData = useCallback(async () => {
    try {
      const patientDetailsResponse = await axios.get(`http://localhost:8080/patients/${patientId}`);
      setPatientData(patientDetailsResponse.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  }, [patientId]);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/appointments/pId/${patientId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchAppointments();
    }
  }, [patientId, fetchPatientData, fetchAppointments]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/patients/update/${patientId}`, patientData);
      setIsEditing(false);
      fetchPatientData();
    } catch (error) {
      console.error("Error updating patient information:", error);
    }
  };


  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axios.post(`http://localhost:8080/appointments/cancel/${appointmentId}`);
        alert("Appointment canceled successfully!");
        window.location.reload(); 
      } catch (error) {
        console.error("Error canceling appointment:", error);
        alert("Failed to cancel the appointment.");
      }
    }
  };
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#006A6A" }}>
      <AppBar position="static" sx={{ backgroundColor: "#006A6A" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Patient Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ flexGrow: 2, marginY: 0.5 }}>
        <Box sx={{ display: "flex", gap: 4 }}>
          {/* Levo: Osnovni podaci */}
          <Box sx={{ flex: 1.2, backgroundColor: "white", borderRadius: 2, boxShadow: 3, padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Patient Information
            </Typography>

            <Grid container spacing={4}>
              {[
                "firstName",
                "lastName",
                "dateOfBirth",
                "jmbg",
                "phone",
                "email",
                "address",
                "gender",
                "emergencyContact",
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <Typography variant="body1" color="textSecondary">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      name={field}
                      value={patientData[field] || ""}
                      onChange={handleChange}
                      variant="outlined"
                      margin="dense"
                    />
                  ) : (
                    <Typography variant="body1">{patientData[field]}</Typography>
                  )}
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ marginY: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: isEditing ? "#2196F3" : "#4CAF50", marginTop: 2 }}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? "Save" : "Edit Information"}
              </Button>
            </Box>
          </Box>

 
{/* Desno: Lista termina */}
<Box sx={{ flex: 2, backgroundColor: "white", borderRadius: 2, boxShadow: 3, padding: 2 }}>
  <Typography variant="h5" gutterBottom>
    Appointments
  </Typography>
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ backgroundColor: "#006A6A", color: "white", fontWeight: "bold" }}>Appointment Type</TableCell>
          <TableCell sx={{ backgroundColor: "#006A6A", color: "white", fontWeight: "bold" }}>Date</TableCell>
          <TableCell sx={{ backgroundColor: "#006A6A", color: "white", fontWeight: "bold" }}>Doctor</TableCell>
          <TableCell sx={{ backgroundColor: "#006A6A", color: "white", fontWeight: "bold" }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {appointments
          .slice() 
          .sort((a, b) => new Date(a.date) - new Date(b.date)) 
          .sort((a, b) => (new Date(a.date) > new Date() ? -1 : 1))
          .map((appointment) => {
            const appointmentDate = new Date(appointment.date);
            const isFutureAppointment = appointmentDate > new Date();

            return (
              <TableRow 
                key={appointment.appointmentId} 
                sx={{ backgroundColor: isFutureAppointment ? "#E0F7FA" : "inherit" }} 
              >
                <TableCell>{appointment.type}</TableCell>
                <TableCell>{appointmentDate.toLocaleString()}</TableCell>
                <TableCell>{`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</TableCell>
                <TableCell>
                  {isFutureAppointment && (
                    <Button 
                      variant="contained" 
                      color="error" 
                      onClick={() => handleCancelAppointment(appointment.appointmentId)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  </TableContainer>
</Box>


        </Box>
      </Container>
    </Box>
  );
};


export default PatientProfileStaff;