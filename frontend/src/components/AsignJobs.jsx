import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Container, Typography, TextField, Button, MenuItem, CircularProgress, Alert, Box } from '@mui/material';

const AssignJob = () => {
  const [labBoys, setLabBoys] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [washrooms, setWashrooms] = useState([]);
  const [formData, setFormData] = useState({
    labBoyId: '',
    departmentId: '',
    washroomId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');



  // Fetch lab boys, departments, and washrooms for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const labBoysResponse = await api.get('/api/labboys');
        const departmentsResponse = await api.get('/api/departments');
        const washroomsResponse = await api.get('/api/washrooms');

        setLabBoys(labBoysResponse.data);
        setDepartments(departmentsResponse.data);
        setWashrooms(washroomsResponse.data);
      } catch (error) {
        console.error('Error loading data:', error);
        setResponseMessage('Error loading data. Please try again.');
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.labBoyId || !formData.departmentId || !formData.washroomId) {
      setResponseMessage('Please select a lab boy, a department, and a washroom.');
      return;
    }

    setIsSubmitting(true);
    setResponseMessage('');
    
    try {
      await api.post('/assignjob', formData);
      setResponseMessage('Job assigned successfully!');
      setFormData({ labBoyId: '', departmentId: '', washroomId: '' });
    } catch (error) {
      console.error('Error assigning job:', error);
      if (error.response) {
        setResponseMessage(error.response.data.message || 'Error assigning job.');
      } else if (error.request) {
        setResponseMessage('No response received from server.');
      } else {
        setResponseMessage(`Error: ${error.message}`);
      }
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
      <h1>Assign Job</h1>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
      <TextField
          select
          label="Select Lab Boy"
          name="labBoyId"
          value={formData.labBoyId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {labBoys.map((labBoy) => (
            <MenuItem key={labBoy.id} value={labBoy.id}>
              {labBoy.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Select Department"
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {departments.map((department) => (
            <MenuItem key={department.id} value={department.id}>
              {department.department_name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Select Washroom"
          name="washroomId"
          value={formData.washroomId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {washrooms.map((washroom) => (
            <MenuItem key={washroom.id} value={washroom.id}>
              {washroom.washroom_name}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Assign Job'}
        </Button>

        
      </Box>

      {responseMessage && <Alert severity="success">{responseMessage}</Alert>}
      </center>
      </div>
    </div>
  </main>
  {/* <Footer/> */}
  </div>

  );
};

export default AssignJob;