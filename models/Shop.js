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
    type: {             
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    },
    address: String   // Readable address
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

shopSchema.index({ location: '2dsphere' })


module.exports = mongoose.model('Shop', shopSchema)