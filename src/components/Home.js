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
      <h1>Welcome to the Appointment Scheduler</h1>
      <p>Manage your appointments efficiently with our easy-to-use system. Click below to view or add appointments.</p>
      <button className="appointments-button" onClick={goToAppointments}>View Appointments</button>
    </div>
  );
}

export default Home;
