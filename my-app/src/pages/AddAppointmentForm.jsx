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

 
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8080/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    const fetchAppointmentTypes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/appointments/type");
        setAppointmentTypes(response.data);
      } catch (error) {
        console.error("Error fetching appointment types:", error);
      }
    };

    fetchDoctors();
    fetchPatients();
    fetchAppointmentTypes();
  }, []);

  const handleSave = () => {
    
    if (!selectedDoctor || !selectedPatient || !selectedType || !startTime || !endTime) {
        alert("All fields are required!");
        return;
      }

    const appointmentData = {
      doctor: selectedDoctor,
      patient: selectedPatient,
      type: selectedType,
      start_time: startTime,
      end_time: endTime,
    };
    console.log("Appointment Data:", appointmentData);
    //  POST 
    onClose();

    console.log("Dialog open prop:", open);
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth  sx={{ zIndex: 1300 }}>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAppointmentForm;
