import React, { useState } from 'react';
import api from '../utils/api'; // Assuming this is an Axios instance or similar

const JobDetails = ({ job }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [checklist, setChecklist] = useState({
    task1: false,
    task2: false,
    task3: false,
  });
  const [error, setError] = useState(null); // State to handle errors

  const handleStart = () => {
    api.post('/api/start_job', { jobId: job.id, washroom_name: job.washroom })
        .then(() => {
            console.log('Door locked, job started');
            setCurrentStep(2);
            setError(null);
        })
        .catch((err) => {
            console.error('Error starting job:', err);
            if (err.response) {
                // Server responded with a status code outside 2xx
                setError(`Failed to start the job: ${err.response.data.message || 'Server error'}`);
            } else if (err.request) {
                // No response was received from server
                setError('No response from server. Please check your connection.');
            } else {
                // Something else caused the error
                setError(`Unexpected error: ${err.message}`);
            }
        });
};

const handleFinish = () => {
  // Send signal to ESP32 to unlock door
  api.post('/api/finish_job', { jobId: job.id, washroom_name: job.washroom })
      .then((response) => {
          // Axios automatically resolves for 2xx responses
          console.log('Door unlocked, job finished');
          setError(null); // Clear any previous errors

          // Reload the page after successful job finish
          window.location.reload();
      })
      .catch((err) => {
          console.error('Error finishing job:', err);
          if (err.response) {
              // Server responded with a status code outside 2xx
              setError(`Failed to finish the job: ${err.response.data.message || 'Server error'}`);
          } else if (err.request) {
              // No response was received from server
              setError('No response from server. Please check your connection.');
          } else {
              // Something else caused the error
              setError(`Unexpected error: ${err.message}`);
          }
      });
};

  const toggleChecklistItem = (item) => {
    setChecklist({
      ...checklist,
      [item]: !checklist[item],
    });
  };

  return (
    <div className="job-details">
      <h3>Job Details</h3>
      <p>{`Department: ${job.department}`}</p>
      <p>{`Washroom name: ${job.washroom}`}</p>
      <p>{`labboy name: ${job.lab_boy}`}</p>

      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

      {currentStep === 1 && (
        <div className="step-1">
          <h4>Step 1: Instructions</h4>
          <p>Please ensure you have all necessary cleaning materials before starting.</p>
          <button onClick={handleStart}>Start Job</button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="step-2">
          <h4>Step 2: Perform Tasks</h4>
          <ul>
            <li>
              <input
                type="checkbox"
                checked={checklist.task1}
                onChange={() => toggleChecklistItem('task1')}
              />
              Clean mirrors
            </li>
            <li>
              <input
                type="checkbox"
                checked={checklist.task2}
                onChange={() => toggleChecklistItem('task2')}
              />
              Refill soap dispensers
            </li>
            <li>
              <input
                type="checkbox"
                checked={checklist.task3}
                onChange={() => toggleChecklistItem('task3')}
              />
              Mop floors
            </li>
          </ul>
          <button onClick={handleFinish}>Finish Job</button>
        </div>
      )}
    </div>
  );
};

export default JobDetails;