require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connect } = require('./db');
const Driver = require('./models/Driver');
const Passenger = require('./models/Passenger');
const Request = require('./models/Request');
const Review = require('./models/Review');
const Complaint = require('./models/Complaint');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/backend', express.static(__dirname));

// --- Drivers ---
app.get('/api/drivers', async (req, res) => {
  try {
    const filter = req.query.available === 'true' ? { available: true } : {};
    const drivers = await Driver.find(filter).lean();
    res.json(drivers.map(d => ({ ...d, id: d._id.toString() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/drivers', async (req, res) => {
  try {
    const { name, phone, password, autoNumber, license, location } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
    const existing = await Driver.findOne({ phone });
    if (existing) return res.status(400).json({ error: 'Phone already registered' });
    const driver = await Driver.create({
      name, phone, password: password || '1234',
      autoNumber: autoNumber || '', license: license || '', location: location || ''
    });
    res.status(201).json({ ...driver.toJSON(), id: driver._id.toString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/drivers/:id', async (req, res) => {
  try {
    const d = await Driver.findById(req.params.id);
    if (!d) return res.status(404).json({ error: 'Driver not found' });
    res.json({ ...d.toJSON(), id: d._id.toString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/drivers/:id', async (req, res) => {
  try {
    const { available, rating, totalRides } = req.body;
    const updates = {};
    if (typeof available === 'boolean') updates.available = available;
    if (rating != null) updates.rating = rating;
    if (totalRides != null) updates.totalRides = totalRides;
    const d = await Driver.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!d) return res.status(404).json({ error: 'Driver not found' });
    res.json({ ...d.toJSON(), id: d._id.toString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/drivers/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const driver = await Driver.findOne({ phone, password });
    if (!driver) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ ...driver.toJSON(), id: driver._id.toString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Passengers ---
app.get('https://glide-aa8l.onrender.com/api/passengers', async (req, res) => {
  try {
    const list = await Passenger.find().lean();
    res.json(list.map(p => ({ ...p, id: p._id.toString() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('https://glide-aa8l.onrender.com/api/passengers', async (req, res) => {
  try {
    const { name, phone, password, email, emergencyContact } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ error: 'Name, phone, password required' });
    const existing = await Passenger.findOne({ phone });
    if (existing) return res.status(400).json({ error: 'Phone already registered' });
    const passenger = await Passenger.create({ name, phone, password, email: email || '', emergencyContact: emergencyContact || '' });
    res.status(201).json({ ...passenger.toJSON(), id: passenger._id.toString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('https://glide-aa8l.onrender.com/api/passengers/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const passenger = await Passenger.findOne({ phone, password });
    if (!passenger) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ ...passenger.toJSON(), id: passenger._id.toString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Requests ---
app.get('/api/requests', async (req, res) => {
  try {
    const q = {};
    if (req.query.passengerId) q.passengerId = req.query.passengerId;
    if (req.query.driverId) q.driverId = req.query.driverId;
    if (req.query.status) q.status = req.query.status;
    const list = await Request.find(q).sort({ createdAt: -1 }).lean();
    res.json(list.map(r => ({ ...r, id: r._id.toString(), createdAt: r.createdAt?.toISOString?.() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const { passengerId, passengerName, passengerPhone, driverId, pickup, destination, distance, fare } = req.body;
    if (!passengerId || !driverId || !pickup || !destination || fare == null) return res.status(400).json({ error: 'Missing required fields' });
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    const reqDoc = await Request.create({
      passengerId, passengerName: passengerName || '', passengerPhone: passengerPhone || '',
      driverId, driverName: driver.name,
      pickup, destination, distance: parseFloat(distance) || 0, fare: parseFloat(fare) || 0
    });
    res.status(201).json({ ...reqDoc.toJSON(), id: reqDoc._id.toString(), createdAt: reqDoc.createdAt?.toISOString?.() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/requests/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const r = await Request.findByIdAndUpdate(req.params.id, status ? { status } : {}, { new: true });
    if (!r) return res.status(404).json({ error: 'Request not found' });
    res.json({ ...r.toJSON(), id: r._id.toString(), createdAt: r.createdAt?.toISOString?.() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Reviews ---
app.get('/api/reviews', async (req, res) => {
  try {
    const q = req.query.driverId ? { driverId: req.query.driverId } : {};
    const list = await Review.find(q).sort({ createdAt: -1 }).lean();
    res.json(list.map(r => ({ ...r, id: r._id.toString(), date: r.createdAt?.toISOString?.() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { driverId, passengerId, passengerName, rating, comment } = req.body;
    if (!driverId || !passengerId || !rating) return res.status(400).json({ error: 'driverId, passengerId, rating required' });
    const review = await Review.create({ driverId, passengerId, passengerName: passengerName || '', rating: parseInt(rating, 10), comment: comment || '' });
    const reviews = await Review.find({ driverId });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Driver.findByIdAndUpdate(driverId, { rating: Math.round(avg * 10) / 10, $inc: { totalRides: 1 } });
    res.status(201).json({ ...review.toJSON(), id: review._id.toString(), date: review.createdAt?.toISOString?.() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Complaints ---
app.get('/api/complaints', async (req, res) => {
  try {
    const list = await Complaint.find().sort({ createdAt: -1 }).lean();
    res.json(list.map(c => ({ ...c, id: c._id.toString(), createdAt: c.createdAt?.toISOString?.() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const { passengerId, passengerName, type, description } = req.body;
    if (!passengerId || !type || !description) return res.status(400).json({ error: 'passengerId, type, description required' });
    const complaint = await Complaint.create({ passengerId, passengerName: passengerName || '', type, description });
    res.status(201).json({ ...complaint.toJSON(), id: complaint._id.toString(), createdAt: complaint.createdAt?.toISOString?.() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/complaints/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const c = await Complaint.findByIdAndUpdate(req.params.id, status ? { status } : {}, { new: true });
    if (!c) return res.status(404).json({ error: 'Complaint not found' });
    res.json({ ...c.toJSON(), id: c._id.toString(), createdAt: c.createdAt?.toISOString?.() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

async function start() {
  await connect();
  app.listen(PORT, () => {
    console.log(`AutoConnect API running at http://localhost:${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}/`);
    console.log(`Backend UI: http://localhost:${PORT}/backend/backend.html`);
  });
}

start().catch(console.error);
