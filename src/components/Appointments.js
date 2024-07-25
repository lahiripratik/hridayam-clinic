// src/components/Appointments.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Appointments.css'; // Import the CSS file

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ name: '', date: '' });
  const [showCompleted, setShowCompleted] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userMode = new URLSearchParams(location.search).get('mode') || 'customer';

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

  const addAppointment = (e) => {
    e.preventDefault();
    if (!newAppointment.name) {
      alert('Patient name is required');
      return;
    }
    const appointmentToAdd = {
      ...newAppointment,
      date: newAppointment.date || new Date().toISOString().split('T')[0],
      status: userMode === 'customer' ? 'request' : 'active'
    };
    fetch('http://localhost:5001/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentToAdd),
    })
      .then(response => response.json())
      .then(data => {
        const updatedAppointments = [...appointments, data];
        const sortedAppointments = updatedAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointments(sortedAppointments);
        setNewAppointment({ name: '', date: '' });
        setRequestSuccess(true);
    
        // Clear the success message after 3 seconds
        setTimeout(() => setRequestSuccess(false), 5000);
    
        if (showCompleted || showRequests) {
          setShowCompleted(false);
          setShowRequests(false);
        }
      })
    .catch(error => console.error('Error adding appointment:', error));
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
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const markAsCompleted = (id) => {
    fetch(`http://localhost:5001/appointments/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'completed' }),
    })
      .then(response => response.json())
      .then(data => {
        const updatedAppointments = appointments.map(appointment =>
          appointment._id === id ? data : appointment
        );
        setAppointments(updatedAppointments);
      })
      .catch(error => console.error('Error marking appointment as completed:', error));
  };

  const handleShowCompleted = () => {
    setShowCompleted(true);
    setShowRequests(false);
  };
  
  const handleShowActive = () => {
    setShowCompleted(false);
    setShowRequests(false);
  };
  
  const handleShowRequests = () => {
    setShowCompleted(false);
    setShowRequests(true);
  };

  const makeActive = (id) => {
    fetch(`http://localhost:5001/appointments/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'active' }),
    })
      .then(response => response.json())
      .then(updatedAppointment => {
        // Update the appointments state to include the appointment with status 'active'
        const updatedAppointments = appointments.map(appointment =>
          appointment._id === id ? updatedAppointment : appointment
        );
        setAppointments(updatedAppointments);
      })
      .catch(error => console.error('Error making appointment active:', error));
  };
  

  const filteredAppointments = appointments.filter(appointment => {
    if (showRequests) {
      return appointment.status === 'request';
    } else if (showCompleted) {
      return appointment.status === 'completed';
    } else {
      return appointment.status === 'active';
    }
  });

  return (
    <div className="appointments-container">
      <h1>Appointments</h1>
      <button className="home-button" onClick={goHome}>Go to Home</button>
      {userMode === 'customer' ? (
        <div className="customer-form">
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
            <button type="submit" className="submit-button" disabled={!newAppointment.name}>Request Appointment</button>
          </form>
          {userMode === 'customer' && requestSuccess && <p>Request has been sent</p>}
        </div>
      ) : (
        <div className="admin-content">
          <div className='form-header'>
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
              <button type="submit" className="submit-button" disabled={!newAppointment.name}>Add Appointment</button>
            </form>
            
            <button 
              className={`filter-button ${!showCompleted && !showRequests ? 'selected' : ''}`} 
              onClick={handleShowActive}
            >
              Active
            </button>

            <button 
              className={`filter-button ${showCompleted ? 'selected' : ''}`} 
              onClick={handleShowCompleted}
            >
              Completed
            </button>

            <button 
              className={`filter-button ${showRequests ? 'selected' : ''}`} 
              onClick={handleShowRequests}
            >
              Requests
            </button>

          </div>
          <ul className="appointment-list">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <li key={appointment._id} className={`appointment-item ${isToday(appointment.date) ? 'today' : ''}`}>
                  {appointment.name} - {formatDate(appointment.date)}
                  <div>
                    {appointment.status === 'request' && (
                      <button 
                        className="make-active-button"
                        onClick={() => makeActive(appointment._id)}
                      >
                        Make Active
                      </button>
                    )}
                    {appointment.status !== 'request' && (
                      <button 
                        className="completed-button"
                        onClick={() => markAsCompleted(appointment._id)}
                        disabled={appointment.status === 'completed'}
                      >
                        Mark as Completed
                      </button>
                    )}
                    
                    <button className="delete-button" onClick={() => deleteAppointment(appointment._id)}>Delete</button>
                  </div>
                </li>
              ))
            ) : (
              <p>No appointments {showCompleted ? 'completed' : showRequests ? 'requested' : 'pending'}.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Appointments;
