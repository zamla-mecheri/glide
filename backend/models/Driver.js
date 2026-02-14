const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  autoNumber: { type: String, default: '' },
  license: { type: String, default: '' },
  location: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  totalRides: { type: Number, default: 0 },
  available: { type: Boolean, default: false }
}, { timestamps: true });

driverSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Driver', driverSchema);
