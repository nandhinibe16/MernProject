const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes'); 

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected!'))
  .catch((err) => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));