import React, { useState } from 'react';
import api from '../utils/api';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DepartmentDetails from './DepartmentDetails';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';


const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [block, setBlock] = useState('');
  const [workerHeadName, setWorkerHeadName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a FormData object and append all fields
    const formData = new FormData();
    formData.append('department_name', departmentName);//data are sent from here 
    formData.append('block', block);
    formData.append('worker_head_name', workerHeadName);
  
    try {
      // Send the POST request with FormData using Axios
      const response = await api.post('/adddepartment', formData);//api 
  
      // Access response data directly
      setMessage(response.data.status);
  
      // Clear form fields
      setDepartmentName('');
      setBlock('');
      setWorkerHeadName('');
      window.location.reload();
    } catch (error) {
      console.error('There was an error adding the department!', error);
  
      // Handle error responses
      if (error.response) {
        setMessage(`Error: ${error.response.data.message || 'Failed to add department'}`);
      } else if (error.request) {
        setMessage('Error: No response received from server');
      } else {
        setMessage(`Error: ${error.message}`);
      }
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
      <h2>Add Department</h2>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
        <TextField
          label="Department Name"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Block"
          value={block}
          onChange={(e) => setBlock(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Worker Head Name"
          value={workerHeadName}
          onChange={(e) => setWorkerHeadName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
      {message && <Alert severity="success">{message}</Alert>}

      <DepartmentDetails/>
      </center>
      </div>

    </div>
  </main>
  {/* <Footer/> */}
  </div>
    
  );
};

export default AddDepartment;