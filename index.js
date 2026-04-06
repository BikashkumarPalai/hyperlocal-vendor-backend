const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./lib/mongodb')
const authRoutes = require('./routes/auth')
const shopRoutes = require('./routes/shop')
const productRoutes = require('./routes/product')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Conecting the database
connectDB()

// /api/auth
app.use('/api/auth', authRoutes)
// For shop routers
app.use('/api/shop', shopRoutes)
// For product routers
app.use('/api/product', shopRoutes)

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})