import "./App.css";
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";

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
    </Routes>
  </Router>
);

export default App;