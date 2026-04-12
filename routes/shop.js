const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { createShop, getMyShop, updateShop, getAllShops, getShopById } = require('../controllers/shopController')

router.post('/create', authMiddleware, createShop)
router.get('/my-shop', authMiddleware, getMyShop)
router.put('/update', authMiddleware, updateShop)
router.get('/all', getAllShops)
router.get('/:id', getShopById)

module.exports = router