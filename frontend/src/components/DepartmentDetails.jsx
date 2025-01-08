import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import api from '../utils/api'; // Assuming api is configured to handle requests

const LabBoyDetails = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/api/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching Departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Department Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Department Name</TableCell>
              <TableCell>Block</TableCell>
              <TableCell>Worker Head Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.id}</TableCell>
                <TableCell>{department.department_name}</TableCell>
                <TableCell>{department.block}</TableCell>
                <TableCell>{department.worker_head_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LabBoyDetails;
