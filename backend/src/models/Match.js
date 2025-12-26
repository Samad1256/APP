const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['liked', 'passed', 'matched'],
    required: true
  },
  matchedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure unique combination of from and to
matchSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
