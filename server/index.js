const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');

const app = express();
console.log('Environment PORT:', process.env.PORT);
console.log('Environment NODE_ENV:', process.env.NODE_ENV);
const PORT = process.env.PORT || 5001;
console.log('Using PORT:', PORT);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});


app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/health', require('./routes/health'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/dashboard', require('./routes/dashboard'));


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});