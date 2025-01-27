import React, { useState, useEffect } from "react";
import { Divider, Grid, AppBar, Toolbar, Typography, Box, Container, Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PatientProfileStaff = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("id");
  const [patientData, setPatientData] = useState({});
  const [reports, setReports] = useState([]);

  const fetchPatientData = async () => {
    try {
      const patientDetailsResponse = await axios.get(`http://localhost:8080/patients/${patientId}`);
      setPatientData(patientDetailsResponse.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:8080/reports/perPatient", {
        params: { id: patientId },
      });
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchReports();
    }
  }, [patientId]);

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
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="textSecondary">First Name</Typography>
                <Typography variant="body1">{patientData.firstName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="textSecondary">Last Name</Typography>
                <Typography variant="body1">{patientData.lastName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="textSecondary">Date of Birth</Typography>
                <Typography variant="body1">{patientData.dateOfBirth}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="textSecondary">JMBG</Typography>
                <Typography variant="body1">{patientData.jmbg}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="textSecondary">Phone</Typography>
                <Typography variant="body1">{patientData.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography variant="body1" color="textSecondary">Email</Typography>
                <Typography variant="body1">{patientData.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="textSecondary">Address</Typography>
                <Typography variant="body1">{patientData.address}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="textSecondary">Gender</Typography>
                <Typography variant="body1">{patientData.gender}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="textSecondary">Emergency Contact</Typography>
                <Typography variant="body1">{patientData.emergencyContact}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ marginY: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: "#4CAF50", marginTop: 2 }}
              >
                Edit Information
              </Button>
            </Box>
          </Box>

          {/* Desno: Lista reportova */}
          <Box sx={{ flex: 2, backgroundColor: "white", borderRadius: 2, boxShadow: 3, padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Reports
            </Typography>
            <Box>
              {reports.map((report) => (
                <Box key={report.id} sx={{ padding: 2, border: "1px solid #ccc", borderRadius: 2, marginBottom: 2 }}>
                  <Typography>Report ID: {report.id}</Typography>
                  <Typography>Appointment ID: {report.appointment_id}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PatientProfileStaff;
