import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { TextField, Box, Button, Select, MenuItem,FormControl, InputLabel, Grid, Alert } from "@mui/material";

const AddWashroom = () => {
  const [departments, setDepartments] = useState([]); // State for departments dropdown
  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
    floor: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/api/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setResponseMessage('Error loading departments. Please try again.');
      }
    };

    fetchDepartments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.departmentId || !formData.floor) {
      setResponseMessage('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setResponseMessage('');

    try {
      // Send POST request to add washroom
      const response = await api.post('/addwashroom', formData);
      setResponseMessage('Washroom added successfully!');
      setFormData({ name: '', departmentId: '', floor: '' }); // Reset form
      window.location.reload();
    } catch (error) {
      console.error('Error adding washroom:', error);
      if (error.response) {
        setResponseMessage(error.response.data.message || 'Error adding washroom.');
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
      <h2>Add Washroom</h2>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
      <TextField
            fullWidth
            label="Washroom Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
                  <FormControl fullWidth margin="normal">
            <InputLabel id="department-label">Select Department:</InputLabel>
            <Select
              labelId="department-label"
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <MenuItem value="">-- Select Department --</MenuItem>
              {departments.map((department) => (
              <MenuItem key={department.id} value={department.id}>{department.department_name}</MenuItem>
            ))}
            </Select>
          </FormControl>

        <TextField
            fullWidth
            label="Floor Name"
            type="number"
            id="floor"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            required
          />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        {isSubmitting ? 'Adding...' : 'Add Washroom'}
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

export default AddWashroom;