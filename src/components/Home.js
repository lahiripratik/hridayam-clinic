// src/components/Home.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file for styling

function Home() {
  const navigate = useNavigate(); // Create a navigate function

  // Function to navigate to appointments page with mode
  const goToAppointments = (mode) => {
    navigate(`/appointments?mode=${mode}`);
  };

  return (
    <div className="home-container">
      <h1>Hridayam Clinic Appointment Manager</h1>
      <p>Manage appointments efficiently. Choose the user mode.</p>
      <div className='user-mode-buttons'>
        <button className="appointments-button" onClick={() => goToAppointments('customer')}>Customer Mode</button>
        <button className="appointments-button" onClick={() => goToAppointments('admin')}>Admin Mode</button>
      </div>
    </div>
  );
}

export default Home;
