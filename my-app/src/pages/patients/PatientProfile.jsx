import React, { useState, useEffect, useCallback } from "react";
import {Divider,Grid, AppBar, Toolbar, Typography, Box, Container, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSearchParams,useNavigate } from "react-router-dom";
import axios from "axios";
//import { format } from 'date-fns';
//import ReactToPrint from "react-to-print";


const PatientProfile = () => {
  const [searchParams] = useSearchParams();
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  const appointmentId = searchParams.get("appointmentId");
  const [appointmentTypes, setAppointmentTypes] = useState({}); 

  const [patientData, setPatientData] = useState({});
  const [reports, setReports] = useState([]);
 // const [isDialogOpen, setIsDialogOpen] = useState(false);
 // const [newReportContent, setNewReportContent] = useState("");
  const [isAppointmentsFetched, setIsAppointmentsFetched] = useState(false); 
 // const [editingReport, setEditingReport] = useState(null);
  //const printableRef = useRef();
  const navigate = useNavigate();

 
  const fetchPatientData = useCallback( async () => {
    try {
      const patientIdResponse = await axios.get("https://healthappoint-backend.onrender.com/patients/getPatientId", {
        params: { firstName, lastName },
      });
      const patientId = patientIdResponse.data.patientId;
   
      
      const patientDetailsResponse = await axios.get(`https://healthappoint-backend.onrender.com/patients/${patientId}`);
      
      setPatientData(patientDetailsResponse.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  },[firstName, lastName]);



  const fetchReports = useCallback(async () => {
    try {
      const response = await axios.get("https://healthappoint-backend.onrender.com/reports/perPatient", {
        params: { firstName, lastName },
      });
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  }, [firstName, lastName]);

  const fetchAppointments = useCallback(async () => {
    try {
      console.log('fetch appointments')
      const types = {};
      for (const report of reports) {
        const typeResponse = await axios.get(`https://healthappoint-backend.onrender.com/appointments/type/${report.appointment_id}`);
        types[report.id] = typeResponse.data.name;
      }
      setAppointmentTypes(types);
    } catch (error) {
      console.error("Error fetching appointment types:", error);
    }
  }, [reports]);

  // Kreiranje novog izveštaja
  /*const handleCreateReport = async () => {
    try {
      await axios.post("https://healthappoint-backend.onrender.com/reports", {
        appointmentId,
        content: newReportContent,
      });
      setIsDialogOpen(false);
      setNewReportContent("");
      fetchReports(); // Osvježavamo listu izveštaja
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };*/

 /*const handleEditReport = (report) => {
    setEditingReport(report);
  };*/

  /*const handleSaveEdit = async () => {
    try {
      await axios.put(`https://healthappoint-backend.onrender.com/reports/${editingReport.id}`, editingReport);
      setEditingReport(null);
      fetchReports();
    } catch (error) {
      console.error("Error saving edited report:", error);
    }
  };*/

  useEffect(() => {
    fetchPatientData();
    fetchReports();
  }, [fetchPatientData, fetchReports]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    if (reports.length > 0 && !isAppointmentsFetched) {
      fetchAppointments();
      setIsAppointmentsFetched(true);
    }
  }, [reports, isAppointmentsFetched, fetchAppointments]);

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

  {/* Divider za vizuelno odvajanje */}
  <Divider sx={{ marginY: 2 }} />

  {/* Dugme za novi izveštaj */}
  <Box sx={{ display: "flex", justifyContent: "center" }}>
    <Button
      variant="contained"
      color="primary"
      sx={{ backgroundColor: "#4CAF50" , marginTop: 2 }}
      onClick={() => navigate(`/new-report?appointmentId=${appointmentId}&patientName=${patientData.firstName}&patientLastName=${patientData.lastName}`)}
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
              <Accordion  key={report.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Report - {appointmentTypes[report.id]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Dg:{report.diagnosis_code}</Typography>
                  <Typography>Therapy: {report.terapija}</Typography>
                  <Typography>Recommendation: {report.preporuka}</Typography>
                  <Typography>Medical history: {report.medical_history}</Typography>
                  <Typography>Additonal text: {report.additional_text}</Typography>
                  <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button variant="contained" color="primary" sx={{ backgroundColor: "#FF7043" }} 
                  //onClick={() => handleEditReport(report)}
                  >
                      Edit
                    </Button>
                    <Button variant="contained" color="primary" sx={{ backgroundColor: "#4CAF50" }} 
                    //onClick={() => handleEditReport(report)}
                    >
                      Print
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>

  
    </Box>
  );
};

export default PatientProfile;
