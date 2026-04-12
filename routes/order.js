const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { placeOrder, getMyOrders, getShopOrders, updateOrderStatus } = require('../controllers/orderController')

router.post('/place', authMiddleware, placeOrder)
router.get('/my-orders', authMiddleware, getMyOrders)
router.get('/shop-orders', authMiddleware, getShopOrders)
router.put('/status/:id', authMiddleware, updateOrderStatus)

module.exports = router