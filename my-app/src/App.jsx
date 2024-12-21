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
const ProtectedPage = () => <h1>Dobrodošli u zaštićenu stranicu!</h1>;

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/protected"
        element={
          <ProtectedRoute>
            <ProtectedPage />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<DoctorProfile />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/patient-profile" element={<Patient />} />
    </Routes>
  </Router>
);

export default App;