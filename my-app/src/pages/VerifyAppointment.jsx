import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const VerifyAppointment = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Proveravamo vaš termin...');

  useEffect(() => {
    const token = searchParams.get('token');

    axios
      .get(`http://localhost:8080/verify?token=${token}`)
      .then((response) => {
        setMessage(response.data);
      })
      .catch(() => {
        setMessage('Link je nevalidan ili je istekao.');
      });
  }, [searchParams]);

  return <div>{message}</div>;
};

export default VerifyAppointment;
