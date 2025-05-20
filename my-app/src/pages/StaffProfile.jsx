import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Card, CardContent, Typography, TextField } from "@mui/material";

const StaffProfile = () => {
const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const userId = localStorage.getItem("userId");
  useEffect(() => {
  
    if (userId) {
      axios.get(`http://localhost:8080/users/${userId}`)
        .then(response => {
    
          setUserData(response.data);
        })
        .catch(error => {
          console.error("Error fetching doctor data:", error);
        });
    }
  }, [userId]);


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
              Staff Information
            </Typography>

            {isEditing ? (
              <>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={userData.firstName}
                  //onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={userData.lastName}
                 // onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={userData.email}
                 // onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>First Name:</strong> {userData.firstName}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Last Name:</strong> {userData.lastName}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Email:</strong> {userData.email}
                </Typography>
                
              </>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
              <Button variant="contained" color="primary" sx={{ backgroundColor: "#004D4D" }}
               onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default StaffProfile;
