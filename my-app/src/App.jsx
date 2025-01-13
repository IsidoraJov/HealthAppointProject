import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Dashboard from "./pages/Dashboard";
import DoctorProfile from "./pages/DoctorProfile";
import Doctors from "./pages/doctor/index";
import Patient from "./pages/patients/PatientProfile";
import NewReport from "./pages/patients/NewReport";
import StaffDashboard from "./pages/StaffDashboard";
import StaffProfile from "./pages/StaffProfile";
import PatientProfileStaff from "./pages/patients/PatientProfileStaff";

const ProtectedRoute = ({ children, allowedUserIds }) => {
  const userId = localStorage.getItem("role_id");

  if (!userId || !allowedUserIds.includes(parseInt(userId, 10))) {
    return <Navigate to="/login" replace />;
    
  }
  
  return children;
};

const App = () => (
  <Router>
    <Routes>
      <Route
        path="/login"
        element={
          <Login />
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedUserIds={[1]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staffDashboard"
        element={
          <ProtectedRoute allowedUserIds={[2]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedUserIds={[1, 2]}>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors"
        element={
          <ProtectedRoute allowedUserIds={[1, 2]}>
            <Doctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient-profile"
        element={
          <ProtectedRoute allowedUserIds={[1]}>
            <Patient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new-report"
        element={
          <ProtectedRoute allowedUserIds={[1]}>
            <NewReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-patient-profile"
        element={
          <ProtectedRoute allowedUserIds={[2]}>
            <PatientProfileStaff />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-profile"
        element={
          <ProtectedRoute allowedUserIds={[2]}>
            <StaffProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
