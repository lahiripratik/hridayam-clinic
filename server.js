const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5001;

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://pratiklahiri21:Pl%4008034830@hridayamappointments.xowmir6.mongodb.net/hridayamappointments?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  connectTimeoutMS: 30000 // Increase the timeout to 30 seconds
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if connection fails
  });

// Define a schema and model for appointments
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to get all appointments
app.get('/appointments', async (req, res) => {
  try {
    console.log('Fetching appointments...');
    const appointments = await Appointment.find();
    console.log('Appointments fetched:', appointments);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new appointment
app.post('/appointments', async (req, res) => {
  const { name, date } = req.body;
  
  if (!name || !date) {
    return res.status(400).json({ message: 'Name and date are required' });
  }

  const appointment = new Appointment({ name, date });
  try {
    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(400).json({ message: error.message });
  }
});

// Route to get a specific appointment by ID
app.get('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route to update an appointment by ID
app.put('/appointments/:id', async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(400).json({ message: error.message });
  }
});

// Route to delete an appointment by ID
app.delete('/appointments/:id', async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
