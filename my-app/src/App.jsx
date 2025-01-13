import "./App.css";
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DoctorProfile from "./pages/DoctorProfile"
import Doctors from "./pages/doctor/index"
import Patient from "./pages/patients/PatientProfile"
import NewReport from "./pages/patients/NewReport";
import StaffDashboard from "./pages/StaffDashboard";
import PatientProfileStaff from "./pages/patients/PatientProfileStaff";
const ProtectedPage = () => <h1>Dobrodošli u zaštićenu stranicu!</h1>;

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<DoctorProfile />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/patient-profile" element={<Patient />} />
      <Route path="/new-report" element={<NewReport />} />
      <Route path="/staffDashboard" element={<StaffDashboard />} />
      <Route path="/staff-patient-profile" element={<PatientProfileStaff />} />
    </Routes>
  </Router>
);

export default App;