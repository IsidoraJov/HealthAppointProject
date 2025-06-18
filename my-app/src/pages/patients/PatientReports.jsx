import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import React, { useState, useEffect } from "react";

const PatientReports = ({ patientId }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`https://healthappoint-backend.onrender.com/reports`);
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [patientId]);

  return (
    <div>
      <h2>Reports</h2>
      {reports.length === 0 ? (
        <div>No reports available</div>
      ) : (
        reports.map((report) => (
          <Accordion key={report.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography>{report.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{report.description}</Typography>
              <a href={report.file_url} target="_blank" rel="noopener noreferrer">
                View Report
              </a>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </div>
  );
};

export default PatientReports;