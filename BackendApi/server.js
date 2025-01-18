const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas connected!'))
  .catch((err) => console.error(err));

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
