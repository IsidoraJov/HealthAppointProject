import React, { useState, useEffect } from "react";
import {Divider,Grid, AppBar, Toolbar, Typography, Box, Container, Accordion, AccordionSummary, AccordionDetails, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { format } from 'date-fns';


const PatientProfile = () => {
  const [searchParams] = useSearchParams();
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  const appointmentId = searchParams.get("appointmentId");

  const [patientData, setPatientData] = useState({});
  const [reports, setReports] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReportContent, setNewReportContent] = useState("");

  // Fetch osnovne podatke
  const fetchPatientData = async () => {
    try {
      const patientIdResponse = await axios.get("http://localhost:8080/patients/getPatientId", {
        params: { firstName, lastName },
      });
      const patientId = patientIdResponse.data.patientId;
   
      
      const patientDetailsResponse = await axios.get(`http://localhost:8080/patients/${patientId}`);
      console.log(patientDetailsResponse)
      setPatientData(patientDetailsResponse.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  // Fetch reporte
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:8080/reports/perPatient", {
        params: { firstName, lastName },
      });
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // Kreiranje novog izveštaja
  const handleCreateReport = async () => {
    try {
      await axios.post("http://localhost:8080/reports", {
        appointmentId,
        content: newReportContent,
      });
      setIsDialogOpen(false);
      setNewReportContent("");
      fetchReports(); // Osvježavamo listu izveštaja
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  useEffect(() => {
    fetchPatientData();
    fetchReports();
  }, [firstName, lastName]);

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
  {/* Naslov */}
  <Typography variant="h5" gutterBottom>
    Patient Information
  </Typography>

  {/* Informacije o pacijentu u Grid layoutu */}
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
    <Grid item xs={12} sm={6}>
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

  {/* Divider za vizuelno odvajanje */}
  <Divider sx={{ marginY: 2 }} />

  {/* Dugme za novi izveštaj */}
  <Box sx={{ display: "flex", justifyContent: "center" }}>
    <Button
      variant="contained"
      color="primary"
      sx={{ marginTop: 2 }}
      onClick={() => setIsDialogOpen(true)}
    >
      New Report
    </Button>
  </Box>
</Box>


          {/* Desno: Accordion za reporte */}
          <Box sx={{ flex: 2, backgroundColor: "white", borderRadius: 2, boxShadow: 3, padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Reports
            </Typography>
            {reports.map((report) => (
              <Accordion key={report.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Report {report.id}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{report.content}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Modal za kreiranje novog izveštaja */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Create New Report</DialogTitle>
        <DialogContent>
          <TextField
            label="Report Content"
            multiline
            rows={4}
            fullWidth
            value={newReportContent}
            onChange={(e) => setNewReportContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateReport} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientProfile;
