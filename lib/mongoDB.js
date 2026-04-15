// const mongoose = require('mongoose')

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI)
//     console.log('MongoDB connected successfully')
//   } catch (error) {
//     console.error('MongoDB connection failed:', error.message)
//     process.exit(1)
//   }
// }

// module.exports = connectDB




const mongoose = require('mongoose')

let isConnected = false

const connectDB = async () => {
  try {
    if (isConnected) return

    const db = await mongoose.connect(process.env.MONGODB_URI)

    isConnected = db.connections[0].readyState === 1

    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
  }
}

module.exports = connectDB