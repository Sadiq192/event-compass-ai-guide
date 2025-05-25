const express = require('express');
const connectDB = require('./db');
const cors = require('cors'); // Import cors
require('dotenv').config();

const app = express();
connectDB(); // connect to MongoDB

app.use(express.json());
app.use(cors()); // Use cors middleware
// Define Routes
app.use('/api/events', require('./routes/events'));
app.use('/api/tasks', require('./routes/tasks')); // New route for tasks

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
