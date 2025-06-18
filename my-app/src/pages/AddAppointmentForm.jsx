import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";

const AddAppointmentForm = ({ open, onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [additionalText, setAdditionalText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("https://healthappoint-backend.onrender.com/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axios.get("https://healthappoint-backend.onrender.com/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    const fetchAppointmentTypes = async () => {
      try {
        const response = await axios.get("https://healthappoint-backend.onrender.com/users/t");
        setAppointmentTypes(response.data);
      } catch (error) {
        console.error("Error fetching appointment types:", error);
      }
    };

    fetchDoctors();
    fetchPatients();
    fetchAppointmentTypes();
  }, []);

  const checkDoctorAvailability = async () => {
    if (!selectedDoctor || !startTime || !endTime) {
      alert("Please select a doctor, start time, and end time!");
      return false;
    }

    try {
      const response = await axios.post("https://healthappoint-backend.onrender.com/doctors/check-availability", {
        doctor_id: selectedDoctor.id,
        start_time: startTime,
        end_time: endTime,
      });

      if (response.data.available) {
        return true;
      } else {
        alert("The doctor is not available in the selected time slot.");
        return false;
      }
    } catch (error) {
      console.error("Error checking doctor availability:", error);
      alert("Failed to check doctor availability. Please try again.");
      return false;
    }
  };

  const handleSave = async () => {
    if (!selectedDoctor || !selectedPatient || !selectedType || !startTime || !endTime) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    const isAvailable = await checkDoctorAvailability();
    if (!isAvailable) {
      setLoading(false);
      return;
    }

    const appointmentData = {
      doctor: `${selectedDoctor.first_name} ${selectedDoctor.last_name}`,
      patient: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
      type: selectedType.name,
      start_time: startTime,
      end_time: endTime,
      additional_text: additionalText,
    };

    try {
      const response = await axios.post("https://healthappoint-backend.onrender.com/appointments/add", appointmentData);
      console.log("Appointment saved successfully:", response.data);
      alert("Appointment added successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to add appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ zIndex: 1300 }}>
      <DialogTitle>Add Appointment</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Doctors dropdown */}
          <Autocomplete
            options={doctors}
            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
            renderInput={(params) => <TextField {...params} label="Doctor" />}
            onChange={(event, value) => setSelectedDoctor(value)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />

          {/* Patients dropdown */}
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
            renderInput={(params) => <TextField {...params} label="Patient" />}
            onChange={(event, value) => setSelectedPatient(value)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />

          {/* Appointment type dropdown */}
          <Autocomplete
            options={appointmentTypes}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Appointment Type" />}
            onChange={(event, value) => setSelectedType(value)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />

          {/* Start Time Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          {/* End Time Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          {/* Additional Text Field */}
          <TextField
            label="Additional Text"
            multiline
            rows={4}
            value={additionalText}
            onChange={(e) => setAdditionalText(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAppointmentForm;
