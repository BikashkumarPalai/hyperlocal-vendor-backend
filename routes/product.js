const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { addProduct, getMyProducts, updateProduct, deleteProduct, getProductsByShop } = require('../controllers/productController')

router.post('/add', authMiddleware, addProduct)
router.get('/my-products', authMiddleware, getMyProducts)
router.put('/update/:id', authMiddleware, updateProduct)
router.delete('/delete/:id', authMiddleware, deleteProduct)
router.get('/shop/:shopId', getProductsByShop)

module.exports = router