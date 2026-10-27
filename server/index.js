require('dotenv').config();
const express = require('express'), mongoose = require('mongoose'), cors = require('cors'), sanitize = require('express-mongo-sanitize');
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) { console.error('Missing JWT_SECRET or MONGO_URI in server/.env'); process.exit(1); }
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.use(sanitize());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/roommates', require('./routes/roommates'));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.status) return res.status(err.status).json({ message: err.message });
  console.error(err); res.status(500).json({ message: 'Something went wrong on the server' });
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('API ready on port ' + (process.env.PORT || 5000))))
  .catch(e => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
