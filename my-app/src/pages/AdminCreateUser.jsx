import React, { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  InputLabel,
  FormControl,
  Typography,
  Paper,
} from '@mui/material';

const AdminCreateUser = () => {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: '',
    specialization: '',
    subspecialization: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async () => {
    try {
        console.log('Sending request to backend...');
      const response = await fetch(`https://healthappoint-backend.onrender.com/users/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, ...formData }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
  
      const data = await response.json();
      console.log('User created:', data);
      alert('User successfully created!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating user');
    }
  };

  return (
    <Paper elevation={3} sx={{ backgroundColor: '#F9F9F9', p: 4, maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" sx={{ color: '#006A6A', mb: 3 }}>
        Create New Profile
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="role-label">Select Role</InputLabel>
        <Select
          labelId="role-label"
          value={role}
          onChange={handleRoleChange}
          label="Select Role"
        >
          <MenuItem value="doctor">Doctor</MenuItem>
          <MenuItem value="medical_staff">Medical Staff</MenuItem>
        </Select>
      </FormControl>

      {role && (
        <Box component="form" noValidate autoComplete="off">
         

          <TextField
            fullWidth
            name="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {role === 'doctor' && (
            <>
              <TextField
                fullWidth
                name="specialization"
                label="Specialization"
                value={formData.specialization}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                name="subspecialization"
                label="Subspecialization"
                value={formData.subspecialization}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            </>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#006A6A', color: 'white' }}
            onClick={handleSubmit}
          >
            Create Profile
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default AdminCreateUser;
