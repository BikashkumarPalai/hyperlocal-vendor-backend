const Product = require('../models/Product')
const Shop = require('../models/Shop')

// Adding product to the shop
const addProduct = async (req, res) => {
    try {
        const { name, price, unit, stock, description } = req.body

        if (!name || !price || !unit || !stock) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const shop = await Shop.findOne({ vendor: req.user.userId })
        if (!shop) {
            return res.status(404).json({ message: 'Create a shop first' })
        }

        const product = await Product.create({
            shop: shop._id,
            vendor: req.user.userId,
            name,
            price,
            unit,
            stock,
            description
        })

        res.status(201).json({
            message: 'Product added successfully',
            product
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}




// Get all products of vendor's shop
const getMyProducts = async (req, res) => {
    try {
        const shop = await Shop.findOne({ vendor: req.user.userId })
        if (!shop) {
            return res.status(404).json({ message: 'No shop found' })
        }

        // If there is shop then there is must be product
        const products = await Product.find({ shop: shop._id })

        res.json({ products })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Updating the product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, vendor: req.user.userId },
            req.body,
            { new: true }
        )

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json({ message: 'Product updated successfully', product })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


// Deleting the product 
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            vendor: req.user.userId
        })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json({ message: 'Product deleted successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { addProduct, getMyProducts, updateProduct, deleteProduct }

