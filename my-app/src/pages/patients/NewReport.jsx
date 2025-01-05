import React, { useState, useEffect } from "react";
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

  const [diagnosisList, setDiagnosisList] = useState([]);
  const [formData, setFormData] = useState({
    diagnosis_code: [],
    terapija: "",
    preporuka: "",
    medical_history: "",
    additional_text: "",
  });
  const [activeTab, setActiveTab] = useState(0);

  const fetchPatientData = async () => {
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
  };

  useEffect(() => {
    fetchPatientData();
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
  }, [firstName,lastName]);

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
    const pageHeight = doc.internal.pageSize.height; // Visina stranice
    let y = 20; // Početna Y koordinata

    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 10, 10, 40, 20);

    const now = new Date();
    const dateTime = now.toLocaleString();
    doc.setFontSize(10);
    doc.rect(140, 10, 50, 15);
    doc.text(dateTime, 165, 20, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor("#006A6A");
    doc.text("MEDICAL REPORT", 105, 40, { align: "center" });
    y = 50;

    // Osnovne informacije
    doc.setFontSize(12);
    doc.setDrawColor("#004D4D");
    doc.setFillColor("#E6F2F2");
    doc.rect(10, y, 190, 20, "F");
    doc.setTextColor("black");
    doc.text("Name:", 12, y + 8);
    doc.text(patientData.firstName + " " + patientData.lastName || "", 30, y + 8);
    doc.text("JMBG:", 12, y + 16);
    doc.text(patientData.jmbg || "", 30, y + 16);

    doc.text("Birth Date:", 110, y + 8);
    doc.text(patientData.dateOfBirth || "", 140, y + 8);
    doc.text("Email/Phone:", 110, y + 16);
    doc.text(patientData.email || "", 140, y + 16);
    y += 30;

    // Dinamičko ispisivanje dijagnoza
    doc.setFontSize(12);
    doc.setTextColor("#006A6A");
    doc.text("Diagnosis:", 12, y);
    y += 7;//razmak između naslova i teksta za dijagnozu

    const diagnosisHeight = formData.diagnosis_code.reduce((height, diagnosis) => {
      const diagnosisText = diagnosis.code + " - " + diagnosis.name;
      const splitDiagnosis = doc.splitTextToSize(diagnosisText, 180);
      return height + splitDiagnosis.length * 5; // Svaka linija povećava visinu
    }, 5);

    doc.setDrawColor("#004D4D");
    doc.rect(10, y - 5, 190, diagnosisHeight); // Crtanje okvira

    doc.setTextColor("black");
    formData.diagnosis_code.forEach((diagnosis) => {
      const diagnosisText = diagnosis.code + " - " + diagnosis.name;
      const splitDiagnosis = doc.splitTextToSize(diagnosisText, 180);
      splitDiagnosis.forEach((line) => {
        if (y + 10 > pageHeight) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 12, y);
        y += 5;
      });
    });
    y += 5;

    const sections = [
      { title: "Therapy", value: formData.terapija },
      { title: "Recommendation", value: formData.preporuka },
      { title: "Medical History", value: formData.medical_history },
      { title: "Report", value: formData.additional_text },
    ];

    sections.forEach((section) => {
      if (y + 20 > pageHeight) {
        doc.addPage();
        y = 10;
      }
    
      doc.setFontSize(12);
      doc.setTextColor("#006A6A");
      doc.text(`${section.title}:`, 12, y);
      y += 7;
    
      doc.setFontSize(12);
      doc.setTextColor("black");
      const splitText = doc.splitTextToSize(section.value || "", 180);
      const sectionHeight = splitText.length * 5 + 5;
    
      doc.setDrawColor("#004D4D");
      doc.rect(10, y - 5, 190, sectionHeight);
    
      splitText.forEach((line) => {
        if (y + 10 > pageHeight) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 12, y);
        y += 5;
      });
      y += 5;
    });

    if (y + 20 > pageHeight) {
      doc.addPage();
      y = 10;
    }
    doc.setDrawColor("#004D4D");
    doc.line(140, y + 10, 190, y + 10);
    doc.text("John Doe", 140, y + 15);
    doc.text("Cardiology", 140, y + 20);

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
