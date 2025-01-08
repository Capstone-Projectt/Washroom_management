import React, { useEffect, useState } from 'react';//washroom threshold
import api from '../utils/api';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from '@mui/material';
const Index = () => {
  const [washrooms, setWashrooms] = useState([]);

  useEffect(() => {
    // Function to fetch washroom data
    const fetchWashrooms = () => {
      api.get('/api/washrooms')
        .then((response) => {
          setWashrooms(response.data); // Update state with fetched data
        })
        .catch((error) => {
          console.error('Error fetching washrooms:', error);
        });
    };

    // Fetch immediately on component mount
    fetchWashrooms();

    // Set up interval to fetch data every 2 seconds
    const intervalId = setInterval(fetchWashrooms, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only on mount/unmount

  return (
    <div>
    <Sidebar />
  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">

    <Navbar />
    <div class="container-fluid py-2">
      <div class="row">
      <center><h1>Washroom Data</h1></center>
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Washroom Name</strong></TableCell>
            <TableCell><strong>Department Name</strong></TableCell>
            <TableCell><strong>Floor</strong></TableCell>
            <TableCell><strong>Usage Count</strong></TableCell>
            <TableCell><strong>Remark</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {washrooms.map((washroom, index) => (
            <TableRow key={index}>
              <TableCell>{washroom.washroom_name}</TableCell>
              <TableCell>{washroom.department_name}</TableCell>
              <TableCell>{washroom.floor_number}</TableCell>
              <TableCell>{washroom.usage_count}</TableCell>
              {/* Remark column logic */}
              <TableCell  sx={{
          color: washroom.usage_count >= 30 ? 'red' : 'green',
          fontWeight: 'bold',
        }}>
                {washroom.usage_count >= 30 ? 'Not For Use' : 'Available'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
    </div>
  </main>
  {/* <Footer/> */}
  </div>
      
  
  );
};

export default Index;