import React from 'react';
import { Link } from 'react-router-dom';

// Assuming userRole is passed as a prop or fetched from sessionStorage
const Sidebar = () => {
  // Retrieve userRole from sessionStorage (if needed)
  const userRole = sessionStorage.getItem('userRole');

  return (
    <>
      <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-radius-lg fixed-start ms-2 bg-white my-2" id="sidenav-main">
        <div className="sidenav-header">
          <i className="fas fa-times p-3 cursor-pointer text-dark opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
          <a className="navbar-brand px-4 py-3 m-0" href="https://demos.creative-tim.com/material-dashboard/pages/dashboard" target="_blank" rel="noopener noreferrer">
            <img src="../assets/img/logo-ct-dark.png" className="navbar-brand-img" width="26" height="26" alt="main_logo" />
            <span className="ms-1 text-sm text-dark">WMS</span>
          </a>
        </div>
        <hr className="horizontal dark mt-0 mb-2" />
        <div className="collapse navbar-collapse w-auto" id="sidenav-collapse-main">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/index" className="nav-link text-dark">
                <i className="material-symbols-rounded opacity-5">dashboard</i>
                <span className="nav-link-text ms-1">Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/addlabboy" className="nav-link text-dark">
                <i className="material-symbols-rounded opacity-5">boy</i>
                <span className="nav-link-text ms-1">Add Lab Boy</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/addwashroom" className="nav-link text-dark">
                <i className="material-symbols-rounded opacity-5">wash</i>
                <span className="nav-link-text ms-1">Add Washroom</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/adddepartment" className="nav-link text-dark">
                <i className="material-symbols-rounded opacity-5">house</i>
                <span className="nav-link-text ms-1">Add Department</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/assignjob" className="nav-link text-dark">
                <i className="material-symbols-rounded opacity-5">AJ</i>
                <span className="nav-link-text ms-1">Assign Job</span>
              </Link>
            </li>


            



          </ul>
        </div>



      </aside>

    </>
  );
};

export default Sidebar;