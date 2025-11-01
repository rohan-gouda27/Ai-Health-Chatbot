const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  notes: { type: String, default: '' },
  timeOfDay: { type: String, required: true }, // e.g., "20:00"
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  weekday: { type: Number, min: 0, max: 6 }, // for weekly (0=Sun)
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

reminderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Reminder', reminderSchema);




