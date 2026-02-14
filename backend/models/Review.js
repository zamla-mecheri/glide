const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  driverId: { type: String, required: true },
  passengerId: { type: String, required: true },
  passengerName: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' }
}, { timestamps: true });

reviewSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.date = ret.createdAt?.toISOString?.() || ret.createdAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Review', reviewSchema);
