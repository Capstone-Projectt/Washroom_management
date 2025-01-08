import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddLabBoy from './components/AddLabBoy';
import LabBoyDashboard from './components/LabBoyDashboard';
import AssignJob from './components/AsignJobs';
import Sidebar from './components/Sidebar';
import Index from './components/Index';
import JobDetails from './components/JobDetails';
import AddDepartment from './components/AddDepartment';
import AddWashroom from './components/AddWahroom';
import Login from './components/Login';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/addwashroom" element={<AddWashroom />} />
                <Route path="/addlabboy" element={<AddLabBoy />} />
                <Route path="/assignjob" element={<AssignJob />} />
                <Route path="/adddepartment" element={<AddDepartment />} />
                <Route path="/sidebar" element={<Sidebar />} />
                <Route path="/jobdetails" element={<JobDetails />} />
                <Route path="/index" element={<Index />} />
                <Route path="/labboydashboard" element={<LabBoyDashboard />} />

            </Routes>
        </Router>
    );
};

export default App;
