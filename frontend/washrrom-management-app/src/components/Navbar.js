import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import '../styles/navbar.css'; // Adjust path based on your folder structure


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens or session data
    sessionStorage.removeItem('userRole'); // Clear user role from sessionStorage
    sessionStorage.clear(); // Optionally clear all session storage
    navigate('/'); // Redirect to login page
    window.location.reload(); // Reload the page
  };

  return (
    <>
        <nav class="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
      <div class="container-fluid py-1 px-3">
        <nav aria-label="breadcrumb">

        </nav>
        <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
          <div class="ms-md-auto pe-md-3 d-flex align-items-center">
            <div class="input-group input-group-outline">

            </div>
          </div>
          <ul class="navbar-nav d-flex align-items-center  justify-content-end">


            <li class="nav-item d-flex align-items-center">
            <Link to="/login" onClick={handleLogout} className="nav-link text-dark">
                <i className="material-symbols-rounded opacity-5">logout</i>
                <span className="nav-link-text ms-1">logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </>
  
  );
};

export default Navbar;
