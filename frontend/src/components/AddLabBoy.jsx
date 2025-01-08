import React, { useState } from 'react';
import api from '../utils/api';
import LabBoyDetails from './LabBoyDetails';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { TextField, Button, Typography, Container, Box, CircularProgress, Alert } from '@mui/material';
const AddLabBoy = () => {
  const [formData, setFormData] = useState({ name: '', number: '', age: '', password:'' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!formData.name || !formData.number || !formData.age || !formData.password) {
      setResponseMessage('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setResponseMessage('');

    try {
      const response = await api.post('/addlabboy', formData);

      if (response.status === 200) {
        setResponseMessage('Lab boy added successfully!');
        setFormData({ name: '', number: '', age: '', password:'' });
        window.location.reload();
      } else {
        setResponseMessage(response.data.message || 'Error adding lab boy.');
      }
    } catch (error) {
      setResponseMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
    <Sidebar />
  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">

    <Navbar />
    <div class="container-fluid py-2">
      <div class="row">
        <center>
      <h1>Add Lab Boy</h1>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>
      
      {responseMessage && <Alert severity="success">{responseMessage}</Alert>}

      <LabBoyDetails/>
      </center>
      </div>
    </div>
  </main>
  {/* <Footer/> */}
  </div>

  );
};

export default AddLabBoy;