import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Paper, Typography, CircularProgress, Box } from '@mui/material';

const VerifyAppointment = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Proveravamo vaš termin...');
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');

    axios
      .get(`https://healthappoint-backend.onrender.com/verify/verify?token=${token}`)
      .then((response) => {
        setMessage(response.data);
        setConfirmed(true);
      })
      .catch(() => {
        setMessage('Link je nevalidan ili je istekao.');
        setConfirmed(false);
      });
  }, [searchParams]);

  return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color={confirmed === true ? 'success.main' : 'error.main'}>
          {message}
        </Typography>
        {confirmed === null && (
          <Box display="flex" justifyContent="center" marginTop={2}>
            <CircularProgress />
          </Box>
        )}
        {confirmed && (
          <Typography variant="body1" color="success.main" marginTop={2}>
            ✅ Vaš termin je potvrđen.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyAppointment;
