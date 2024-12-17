import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);  // Za prikazivanje loadera
    const [error, setError] = useState(null);      // Za eventualne greške
  
   
    useEffect(() => {
      axios
        .get("http://localhost:8080/doctors")  // Putanja do servera
        .then((response) => {
          setDoctors(response.data);  // Postavljanje odgovora u state
          setLoading(false);           // Završava učitavanje
        })
        .catch((err) => {
          setError("Došlo je do greške pri učitavanju podataka");
          setLoading(false);           // Završava učitavanje u slučaju greške
        });
    }, []); // Prazan niz znači da će se poziv izvršiti samo jednom pri učitavanju komponente
  
    // Ako se podaci učitavaju, prikazuje loader
    if (loading) {
      return <div>Učitavam podatke...</div>;
    }
  
    // Ako dođe do greške, prikazuje grešku
    if (error) {
      return <div>{error}</div>;
    }
  
    return (
      <div>
        <h1>Lista doktora</h1>
        <ul>
          {/* Prikazivanje liste doktora */}
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              {doctor.first_name} - {doctor.last_name}
            </li>
          ))}
        </ul>
      </div>
    );

};
export default Dashboard;