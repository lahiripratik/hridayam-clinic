import React, { useState, useEffect } from 'react';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ name: '', date: '' });

  // Fetch appointments from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5001/appointments')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched appointments:', data);
        setAppointments(Array.isArray(data) ? data : []);
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
      .then(data => setAppointments([...appointments, data]))
      .catch(error => console.error('Error adding appointment:', error));

    setNewAppointment({ name: '', date: '' });
  };

  return (
    <div>
      <h1>Manage Appointments</h1>
      <form onSubmit={addAppointment}>
        <input
          type="text"
          placeholder="Patient Name"
          value={newAppointment.name}
          onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
        />
        <input
          type="date"
          value={newAppointment.date}
          onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
        />
        <button type="submit">Add Appointment</button>
      </form>
      <ul>
        {Array.isArray(appointments) ? (
          appointments.map((appointment, index) => (
            <li key={index}>
              {appointment.name} - {appointment.date}
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
