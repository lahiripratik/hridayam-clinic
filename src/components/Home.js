import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Clinic Appointment Manager</h1>
      <Link to="/appointments">Manage Appointments</Link>
    </div>
  );
}

export default Home;
