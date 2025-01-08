import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import JobDetails from './JobDetails';
import api from '../utils/api'; // Assuming this is an Axios instance or similar

const LabBoyDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    // Fetch assigned jobs from the server
    const labboyId = sessionStorage.getItem('labboyid'); // Retrieve LabBoy ID from sessionStorage

    if (labboyId) {
      api.get(`/api/assigned_jobs?labboyId=${labboyId}`)
        .then((response) => {
          setJobs(response.data);
        })
        .catch((error) => {
          console.error('Error fetching jobs:', error);
        });
    } else {
      console.error('LabBoy ID not found in sessionStorage');
    }
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <>
    <Navbar />
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assigned Jobs
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <List>
            {jobs.map((job) => (
              <ListItem
                key={job.id}
                button
                onClick={() => handleJobClick(job)}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <ListItemText
                  primary={`Job ID: ${job.id}`}
                  secondary={`Department: ${job.department}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      {selectedJob && (
        <Card>
          <CardContent>
            {/* this is for the selected job to fetch */}
            <JobDetails job={selectedJob} /> 
          </CardContent>
        </Card>
      )}
    </Box>
    </>
  );
};

export default LabBoyDashboard;
