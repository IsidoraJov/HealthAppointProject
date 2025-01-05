import React, { useState } from "react";
import { Box, Button, Card, CardContent, Typography, TextField } from "@mui/material";

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);


  const [doctorData, setDoctorData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    specialization: "Cardiology",
  });

  const handleEdit = () => setIsEditing((prev) => !prev);
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

      {/* Profil podaci */}
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
