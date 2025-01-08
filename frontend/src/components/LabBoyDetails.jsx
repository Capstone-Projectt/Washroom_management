import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import api from '../utils/api'; // Assuming api is configured to handle requests

const LabBoyDetails = () => {
  const [labBoys, setLabBoys] = useState([]);

  useEffect(() => {
    const fetchLabBoys = async () => {
      try {
        const response = await api.get('/api/labboys');
        setLabBoys(response.data);
      } catch (error) {
        console.error('Error fetching lab boys:', error);
      }
    };

    fetchLabBoys();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lab Boy Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labBoys.map((labBoy) => (
              <TableRow key={labBoy.id}>
                <TableCell>{labBoy.id}</TableCell>
                <TableCell>{labBoy.name}</TableCell>
                <TableCell>{labBoy.age}</TableCell>
                <TableCell>{labBoy.number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LabBoyDetails;
