const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Allows cross-origin requests from frontend
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Habit Tracker API is running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));