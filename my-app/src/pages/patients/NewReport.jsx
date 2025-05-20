import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf"; 
import logo from "../../assets/images/logo.png";

const NewReport = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appointmentId = searchParams.get("appointmentId");
  const firstName = searchParams.get("patientName");
  const lastName = searchParams.get("patientLastName");
  const [patientData, setPatientData] = useState({});
  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
  });
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [formData, setFormData] = useState({
    diagnosis_code: [],
    terapija: "",
    preporuka: "",
    medical_history: "",
    additional_text: "",
  });
  const [activeTab, setActiveTab] = useState(0);

  const fetchPatientData = useCallback(async () => {
    try {
      const patientIdResponse = await axios.get("http://localhost:8080/patients/getPatientId", {
        params: { firstName, lastName },
      });
      const patientId = patientIdResponse.data.patientId;
  
      const patientDetailsResponse = await axios.get(`http://localhost:8080/patients/${patientId}`);
  
      setPatientData(patientDetailsResponse.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  }, [firstName, lastName]); 
  
  const fetchDoctorData = useCallback(async () => {
    const doctorId = localStorage.getItem("userId");
    if (doctorId) {
      try {
        const response = await axios.get(`http://localhost:8080/doctors/doctor/${doctorId}`);
        setDoctorData(response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    }
  }, []); 

  useEffect(() => {
    fetchPatientData();
    fetchDoctorData();
  
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.get("http://localhost:8080/reports/diagnosis");
        console.log(response.data);
        setDiagnosisList(response.data);
      } catch (error) {
        console.error("Error fetching diagnosis codes:", error);
      }
    };
  
    fetchDiagnosis();
  }, [fetchPatientData, fetchDoctorData]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/reports", {
        appointmentId,
        ...formData,
      });
      alert("Report successfully created!");
      navigate(-1); 
    } catch (error) {
      console.error("Error creating report:", error);
      alert("Failed to create report. Please try again.");
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const marginLeft = 12;
    const textWidth = 180;
    let y = 20;
  
    // Dodavanje logotipa
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 10, 10, 40, 20);
  
    // Datum i vreme
    const now = new Date();
    const dateTime = now.toLocaleString();
    doc.setFontSize(10);
    doc.rect(140, 10, 50, 15);
    doc.text(dateTime, 165, 20, { align: "center" });
  
    // Naslov
    doc.setFontSize(18);
    doc.setTextColor("#006A6A");
    doc.text("MEDICAL REPORT", 105, 40, { align: "center" });
    y = 50;
  
    // Osnovne informacije o pacijentu
    doc.setFontSize(12);
    doc.setFillColor("#E6F2F2");
    doc.rect(marginLeft - 2, y, textWidth + 4, 20, "F");
    doc.setTextColor("black");
    doc.text("Name:", marginLeft, y + 8);
    doc.text(`${patientData.firstName} ${patientData.lastName || ""}`, marginLeft + 25, y + 8);
    doc.text("JMBG:", marginLeft, y + 16);
    doc.text(patientData.jmbg || "", marginLeft + 25, y + 16);
    doc.text("Birth Date:", 110, y + 8);
    doc.text(patientData.dateOfBirth || "", 140, y + 8);
    doc.text("Email/Phone:", 110, y + 16);
    doc.text(patientData.email || "", 140, y + 16);
    y += 30;
  
    // Dijagnoze
    doc.setTextColor("#006A6A");
    doc.text("Diagnosis:", marginLeft, y);
    y += 7;
  
    const diagStartY = y;
    formData.diagnosis_code.forEach((diagnosis) => {
      const text = `${diagnosis.code} - ${diagnosis.name}`;
      const lines = doc.splitTextToSize(text, textWidth);
      lines.forEach(line => {
        if (y + 10 > pageHeight) {
          doc.addPage();
          y = 10;
        }
        doc.setTextColor("black");
        doc.text(line, marginLeft, y);
        y += 5;
      });
    });
    doc.setDrawColor("#004D4D");
    doc.rect(marginLeft - 2, diagStartY - 5, textWidth + 4, y - diagStartY + 10);
    y += 10;
  
    // Sekcije: Therapy, Recommendation, Medical History, Report
    const sections = [
      { title: "Therapy", value: formData.terapija },
      { title: "Recommendation", value: formData.preporuka },
      { title: "Medical History", value: formData.medical_history },
      { title: "Report", value: formData.additional_text },
    ];
  
    sections.forEach((section) => {
      if (!section.value) return;
  
      if (y + 30 > pageHeight) {
        doc.addPage(); y = 10;
      }
  
      doc.setFontSize(12);
      doc.setTextColor("#006A6A");
      doc.setFont("helvetica", "normal");
doc.setFontSize(12);
      doc.text(`${section.title}:`, marginLeft, y);
      y += 7;
  
      const safeText = section.value.replace(/(.{100})/g, "$1 ");
      const lines = doc.splitTextToSize(safeText, textWidth);
      const sectionHeight = lines.length * 5 + 5;
  
      doc.setDrawColor("#004D4D");
      doc.setFillColor("#F7FAFA");
      doc.rect(marginLeft - 2, y - 5, textWidth + 4, sectionHeight, "FD");
  
      doc.setTextColor("black");
      lines.forEach(line => {
        if (y + 10 > pageHeight) {
          doc.addPage(); y = 10;
        }
        doc.setFont("helvetica", "normal");
doc.setFontSize(12);
        doc.text(line, marginLeft, y);
        y += 5;
      });
  
      y += 10; // razmak između sekcija
    });
  
    // Potpis lekara
    if (y + 25 > pageHeight) {
      doc.addPage(); y = 10;
    }
  
    doc.setDrawColor("#004D4D");
    doc.line(140, y + 10, 190, y + 10);
    doc.text(`Dr. ${doctorData.firstName} ${doctorData.lastName}`, 140, y + 15);
    doc.text(`${doctorData.specialization}`, 140, y + 20);
  
    // Otvaranje PDF-a
    doc.output("dataurlnewwindow");
  };
  

  return (
    <Container
      maxWidth={false} 
      disableGutters 
      sx={{
        backgroundColor: "#006A6A", 
        minHeight: "100vh", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw", 
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 3,
          backgroundColor: "white", 
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          maxWidth: "800px", 
        }}
      >
        <Typography variant="h5" gutterBottom>
          New Report
        </Typography>
        
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mb: 3,
          p: 2,
          backgroundColor: "#E6F2F2",
          borderRadius: 2,
        }}
      >
        <Typography><strong>Name:</strong> {patientData.firstName} {patientData.lastName}</Typography>
        <Typography><strong>JMBG:</strong> {patientData.jmbg}</Typography>
        <Typography><strong>Birth Date:</strong> {patientData.dateOfBirth}</Typography>
        <Typography><strong>Email:</strong> {patientData.email}</Typography>
      </Box>

        <Autocomplete
          multiple
          options={diagnosisList}
          getOptionLabel={(option) => `${option.code} - ${option.name}`}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          onChange={(event, value) =>
            setFormData({
              ...formData,
              diagnosis_code: value,
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Diagnosis Code"
              placeholder="Start typing to search..."
            />
          )}
        />

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Therapy" />
          <Tab label="Recommendation" />
          <Tab label="Medical History" />
          <Tab label="Report" />
        </Tabs>

        {activeTab === 0 && (
          <TextField
            label="Therapy"
            name="terapija"
            value={formData.terapija}
            onChange={handleChange}
            fullWidth
            multiline
            rows={8}
          />
        )}

        {activeTab === 1 && (
          <TextField
            label="Recommendation"
            name="preporuka"
            value={formData.preporuka}
            onChange={handleChange}
            fullWidth
            multiline
            rows={8}
          />
        )}

        {activeTab === 2 && (
          <TextField
            label="Medical History"
            name="medical_history"
            value={formData.medical_history}
            onChange={handleChange}
            fullWidth
            multiline
            rows={8}
          />
        )}

        {activeTab === 3 && (
          <TextField
            label="Report"
            name="additional_text"
            value={formData.additional_text}
            onChange={handleChange}
            fullWidth
            multiline
            rows={8}
          />
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Save Report
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handlePrint}>
            Print
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NewReport;