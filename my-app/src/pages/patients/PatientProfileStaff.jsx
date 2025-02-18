import React, { useState, useEffect } from "react";
import { Divider, Grid, AppBar, Toolbar, Typography, Box, Container, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PatientProfileStaff = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("id");
  const [patientData, setPatientData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchPatientData = async () => {
    try {
      const patientDetailsResponse = await axios.get(`http://localhost:8080/patients/${patientId}`);
      setPatientData(patientDetailsResponse.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/appointments/pId/${patientId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchAppointments();
    }
  }, [patientId]);

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#006A6A" }}>
      <AppBar position="static" sx={{ backgroundColor: "#006A6A" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Patient Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ flexGrow: 1, marginY: 2 }}>
        <Box sx={{ display: "flex", gap: 4 }}>
          {/* Levo: Osnovni podaci */}
          <Box sx={{ flex: 1, backgroundColor: "white", borderRadius: 2, boxShadow: 3, padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Patient Information
            </Typography>

            <Grid container spacing={2}>
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
                    <TableCell sx={{ backgroundColor: "#006A6A", color: "white", fontWeight: "bold" }} >Appoinment type</TableCell>
                    <TableCell sx={{ backgroundColor: "#006A6A", color: "white", fontWeight: "bold" }}  >Date</TableCell>
                    <TableCell sx={{ backgroundColor: "#006A6A", color: "white", fontWeight: "bold" }}  >Doctor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.appointmentId}>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                      <TableCell>{`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</TableCell>
                    </TableRow>
                  ))}
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