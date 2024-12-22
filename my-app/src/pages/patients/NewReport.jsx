import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Container,
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
    diagnosis_code: "",
    terapija: "",
    preporuka: "",
    medical_history: "",
    additional_text: "",
  });

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
  
  const handleAutocompleteChange = (event, value) => {
    setFormData({
      ...formData,
      diagnosis_code: value ? value.code : "", 
    });
  };

   
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/reports", {
        appointmentId,
        ...formData,
      });
      alert("Report successfully created!");
      navigate(-1); // Return to the previous page
    } catch (error) {
      console.error("Error creating report:", error);
      alert("Failed to create report. Please try again.");
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF();


    const img = new Image();
    img.src = logo;
    doc.addImage(img, 'PNG', 10, 10, 40, 20);

     // Trenutni datum i vreme
     const now = new Date();
     const dateTime = now.toLocaleString();
     doc.setFontSize(10);
     doc.rect(140, 10, 50, 15); 
     doc.text(dateTime, 165, 20, { align: "center" });
 
     // Naslov "Medical Report"
     doc.setFontSize(18);
     doc.text("MEDICAL REPORT", 105, 40, { align: "center" });
 
     // Tabela sa osnovnim informacijama
     doc.setFontSize(12);
     doc.rect(10, 50, 190, 20); 
     doc.text("Name:", 12, 58);
     doc.text(patientData.firstName + " " + patientData.lastName || "", 30, 58);
     doc.text("JMBG:", 12, 66);
     doc.text(patientData.jmbg || "", 30, 66);
 
     doc.text("Birth Date:", 110, 58);
     doc.text(patientData.dateOfBirth || "", 140, 58);
     doc.text("Email/Phone:", 110, 66);
     doc.text(patientData.email || "", 140, 66);
 
     // Polje za dijagnozu
     doc.setFontSize(12);
     doc.text("Diagnosis:", 12, 80);
     doc.rect(10, 82, 190, 15); 
     doc.setFontSize(12);
     doc.text((formData.diagnosis_code ? formData.diagnosis_code + " " : "") + (formData.diagnosis_name || ""), 12, 90);
 
     // Polja za terapiju, preporuku, i istoriju
     const sections = [
         { title: "Therapy", y: 105, value: formData.terapija },
         { title: "Recommendation", y: 130, value: formData.preporuka },
         { title: "Medical History", y: 155, value: formData.medical_history }
     ];
 
     sections.forEach((section) => {
         doc.setFontSize(12);
         doc.text(section.title + ":", 12, section.y);
         doc.rect(10, section.y + 2, 190, 15); 
         doc.setFontSize(12);
         doc.text(section.value || "", 12, section.y + 10);
     });
 
     // Polje za dodatni tekst
     doc.setFontSize(12);
     doc.text("Additional Text:", 12, 180);
     doc.rect(10, 182, 190, 60); 
     doc.setFontSize(10);
     doc.text(formData.additional_text || "", 12, 190);
 
     // Linija za potpis
     doc.line(140, 255, 190, 255); 
     doc.setFontSize(10);
     doc.text("John Doe", 140, 260);
     doc.text("Cardiology", 140, 265);
 
     
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
        maxWidth: "500px", 
      }}
    >
      <Typography variant="h5" gutterBottom>
        New Report
      </Typography>
  
      <Autocomplete
          options={diagnosisList}
          getOptionLabel={(option) => `${option.code} - ${option.name}`}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          onChange={(event, value) =>
            setFormData({
              ...formData,
              diagnosis_code: value ? value.code : "",
              diagnosis_name: value ? value.name : "",
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

    
      <TextField
        label="Therapy"
        name="terapija"
        value={formData.terapija}
        onChange={handleChange}
        fullWidth
      />
  
      <TextField
        label="Recommendation"
        name="preporuka"
        value={formData.preporuka}
        onChange={handleChange}
        fullWidth
      />
  
      <TextField
        label="Medical History"
        name="medical_history"
        value={formData.medical_history}
        onChange={handleChange}
        fullWidth
      />
  
      <TextField
        label="Additional Text"
        name="additional_text"
        value={formData.additional_text}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
      />
  
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
