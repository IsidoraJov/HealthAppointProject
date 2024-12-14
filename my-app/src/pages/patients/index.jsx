import { Typography } from "@mui/material";

const Patients = ({patientsList, color}) => {
    return (
        <>
        {patientsList.map(x => <Typography variant="h3" color="red">{x.name}</Typography>)}
        </>
    );
}

export default Patients;

