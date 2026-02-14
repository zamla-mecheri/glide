const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  passengerId: { type: String, required: true },
  passengerName: { type: String, default: '' },
  type: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' }
}, { timestamps: true });

complaintSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.createdAt = ret.createdAt?.toISOString?.() || ret.createdAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
