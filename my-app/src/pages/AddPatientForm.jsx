import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import axios from "axios";

const AddPatientForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    jmbg: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    maritalStatus: "",
    emergencyContact: "",
    language: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (formData.jmbg.length !== 13) {
      setError("JMBG must be 13 digits long.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/patients/add", formData);
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        birthday: "",
        jmbg: "",
        phone: "",
        email: "",
        address: "",
        gender: "",
        maritalStatus: "",
        emergencyContact: "",
        language: "",
      });
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while adding the patient.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Patient</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              label="Date of Birth"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="JMBG"
              name="jmbg"
              value={formData.jmbg}
              onChange={handleChange}
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <TextField
              label="Gender"
              name="gender"
              select
              value={formData.gender}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
            <TextField
              label="Marital Status"
              name="maritalStatus"
              select
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </TextField>
            <TextField
              label="Emergency Contact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
            />
            <TextField
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleChange}
            />
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Patient added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddPatientForm;
