const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Pre-Launch', 'Completed', 'Planning'],
    default: 'Planning'
  },
  longDescription: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    default: []
  },
  gallery: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
