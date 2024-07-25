// src/components/Home.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file for styling

function Home() {
  const navigate = useNavigate(); // Create a navigate function

  // Function to navigate to appointments page
  const goToAppointments = () => {
    navigate('/appointments');
  };

  return (
    <div className="home-container">
      <h1>Hridayam Clinic Appointment Manager</h1>
      <p>Manage appointments efficiently. Click below to view or add appointments.</p>
      <button className="appointments-button" onClick={goToAppointments}>View Appointments</button>
    </div>
  );
}

export default Home;
