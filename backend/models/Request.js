const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  passengerId: { type: String, required: true },
  passengerName: { type: String, default: '' },
  passengerPhone: { type: String, default: '' },
  driverId: { type: String, required: true },
  driverName: { type: String, default: '' },
  pickup: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number, default: 0 },
  fare: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' }
}, { timestamps: true });

requestSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.createdAt = ret.createdAt?.toISOString?.() || ret.createdAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Request', requestSchema);
