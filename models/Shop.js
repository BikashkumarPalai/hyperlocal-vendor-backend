const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['grocery', 'food', 'fruit', 'bakery', 'dairy', 'stationary', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Shop', shopSchema)