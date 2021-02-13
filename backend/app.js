const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

dotenv.config();

const connectDB = require('./config/db');
connectDB();


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const linkRoutes = require('./routes/linkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json({
  limit: '5mb',
  type: 'application/json'
}));

app.use(cors({ origin: process.env.CLIENT_URL }));

app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', linkRoutes);
app.use('/api', userRoutes);



const port = process.env.PORT || 8000;
console.log(process.env.PORT)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

