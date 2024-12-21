import { Typography } from "@mui/material";
import PatientProfile from "./PatientProfile";
import PatientReports from "./PatientReports"

const Patients = ({ patientId }) => {
    return (
      <div>
        <PatientProfile patientId={patientId} />
        <PatientReports patientId={patientId} />
      </div>
    );
  };

  

export default Patients;

