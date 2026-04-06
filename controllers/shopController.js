const Shop = require('../models/Shop')

// Creating the shop 
const createShop = async (req, res) => {
    try {
        const { name, category, description, location, contact } = req.body;

        if (!name || !category || !description || !location || !contact) {
            return res.status(400).json({ message: "All field are required" })
        }

        // If shop already exist 
        const existingShop = await Shop.findOne({ vendor: req.user.userId })
        if (existingShop) {
            return res.status(400).json({ message: 'You already have a shop' })
        }

        // If not exist then create one 
        const shop = await Shop.create({
            vendor: req.user.userId,
            name,
            category,
            description,
            location,
            contact
        })

        res.status(201).json({ message: 'Shop created successfully', shop })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Finding the shop which is owned by vendor

const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ vendor: req.user.userId })

        if (!shop) {
            return res.status(404).json({ message: 'No shop found' })
        }

        res.json({ shop })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


// Upadtion of shop
const updateShop = async (req, res) => {
    try {
        const shop = await Shop.findOneAndUpdate(
            { vendor: req.user.userId },
            req.body,      // updation occur with this data 
            { new: true }  // return the updated user
        )

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' })
        }

        res.json({ message: 'Shop updated successfully', shop })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


module.exports = { createShop, getMyShop, updateShop }