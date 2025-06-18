import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Card, CardContent, Typography, TextField } from "@mui/material";

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    specialization: "",
  });

  useEffect(() => {
    const doctorId = localStorage.getItem("userId");
    if (doctorId) {
      axios.get(`https://healthappoint-backend.onrender.com/doctors/doctor/${doctorId}`)
        .then(response => {
    
          setDoctorData(response.data);
        })
        .catch(error => {
          console.error("Error fetching doctor data:", error);
        });
    }
  }, []);

  const handleEdit = () => {
    if (isEditing) {
      const doctorId = localStorage.getItem("doctorId");
      axios.post("https://healthappoint-backend.onrender.com/doctors/update", doctorData)
        .then(response => {
          console.log("Doctor data updated successfully:", response.data);
          setIsEditing(false);
        })
        .catch(error => {
          console.error("Error updating doctor data:", error);
        });
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });
  };

  return (
    <Box sx={{ height: "100vh", backgroundColor: "#E0F2F1" }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "#004D4D", padding: 2, color: "white", display: "flex", justifyContent: "center" }}>
        <Typography variant="h4" fontWeight="bold">Doctor Profile</Typography>
      </Box>

      {/* Profile Data */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <Card sx={{ maxWidth: 600, width: "100%", boxShadow: 3, padding: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
              Doctor Information
            </Typography>

            {isEditing ? (
              <>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={doctorData.firstName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={doctorData.lastName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={doctorData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Specialization"
                  name="specialization"
                  value={doctorData.specialization}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>First Name:</strong> {doctorData.firstName}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Last Name:</strong> {doctorData.lastName}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Email:</strong> {doctorData.email}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Specialization:</strong> {doctorData.specialization}
                </Typography>
              </>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
              <Button variant="contained" color="primary" onClick={handleEdit} sx={{ backgroundColor: "#004D4D" }}>
                {isEditing ? "Save" : "Edit"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DoctorProfile;
