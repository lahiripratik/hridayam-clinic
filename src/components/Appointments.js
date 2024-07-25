import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Appointments.css'; // Import the CSS file

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ name: '', date: '' });
  const navigate = useNavigate();

  // Fetch appointments from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5001/appointments')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched appointments:', data);
        const sortedAppointments = Array.isArray(data)
          ? data.sort((a, b) => new Date(a.date) - new Date(b.date))
          : [];
        setAppointments(sortedAppointments);
      })
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  // Add a new appointment and post it to the backend
  const addAppointment = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAppointment),
    })
      .then(response => response.json())
      .then(data => {
        // Add the new appointment to the list
        const updatedAppointments = [...appointments, data];
        // Sort the appointments
        const sortedAppointments = updatedAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        // Update the state
        setAppointments(sortedAppointments);
      })
      .catch(error => console.error('Error adding appointment:', error));
  
    // Reset the form
    setNewAppointment({ name: '', date: '' });
  };

  const deleteAppointment = (id) => {
    fetch(`http://localhost:5001/appointments/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setAppointments(appointments.filter(appointment => appointment._id !== id));
      })
      .catch(error => console.error('Error deleting appointment:', error));
  };

  const goHome = () => {
    navigate('/');
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="appointments-container">
      <h1>Manage Appointments</h1>
      <button className="home-button" onClick={goHome}>Go to Home</button>
      <form onSubmit={addAppointment} className="appointment-form">
        <input
          type="text"
          placeholder="Patient Name"
          value={newAppointment.name}
          onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
          className="input-field"
        />
        <input
          type="date"
          value={newAppointment.date}
          onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
          className="input-field"
        />
        <button type="submit" className="submit-button">Add Appointment</button>
      </form>
      <ul>
        {Array.isArray(appointments) ? (
          appointments.map((appointment) => (
            <li
              key={appointment._id}
              className="appointment-item"
              style={{ backgroundColor: isToday(appointment.date) ? '#e9f5ff' : 'white' }}
            >
              {appointment.name} - {formatDate(appointment.date)}
              <button className="delete-button" onClick={() => deleteAppointment(appointment._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No appointments found.</p>
        )}
      </ul>
    </div>
  );
}

export default Appointments;
