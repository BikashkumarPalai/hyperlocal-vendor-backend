const Order = require('../models/Order')
const Product = require('../models/Product')
const Shop = require('../models/Shop')
const getDistanceInKm = require('../lib/distance')

const MAX_ORDER_RADIUS_KM = 10

// Customer places order
const placeOrder = async (req, res) => {
    try {
        const { shop, items, totalPrice, customerLat, customerLng } = req.body

        if (!shop || !items || items.length === 0) {
            return res.status(400).json({ message: 'Order details are required' })
        }

        // Check distance
        if (customerLat && customerLng) {
            const shopData = await Shop.findById(shop)
            if (shopData?.location?.coordinates) {
                const shopLng = shopData.location.coordinates[0]
                const shopLat = shopData.location.coordinates[1]

                const distance = getDistanceInKm(
                    customerLat,
                    customerLng,
                    shopLat,
                    shopLng
                )

                if (distance > MAX_ORDER_RADIUS_KM) {
                    return res.status(400).json({
                        message: `This shop is too far from your location. You can only order from shops within ${MAX_ORDER_RADIUS_KM}km.`,
                        distance: distance.toFixed(1)
                    })
                }
            }
        }

        // Check stock
        for (const item of items) {
            const product = await Product.findById(item.product)
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` })
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.name}. Available: ${product.stock}`
                })
            }
        }

        const order = await Order.create({
            customer: req.user.userId,
            shop,
            items,
            totalPrice
        })

        res.status(201).json({
            message: 'Order placed successfully',
            order
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}



// Customer gets their orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.userId })
            .populate('shop', 'name location')
            .sort({ createdAt: -1 })

        res.json({ orders })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


// Vendor gets orders (Vendor see order placed by customer in his shop)
const getShopOrders = async (req, res) => {
    try {
        const shop = await Shop.findOne({ vendor: req.user.userId })
        if (!shop) {
            return res.status(404).json({ message: 'No shop found' })
        }

        const orders = await Order.find({ shop: shop._id })
            .populate('customer', 'name email')
            .sort({ createdAt: -1 })

        res.json({ orders })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


// Vendor update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const validStatuses = ['accepted', 'rejected', 'completed']

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' })
        }

        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        // Deduct stock when order is accepted
        if (status === 'accepted') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                })
            }
        }

        // updating the status if order accepted 
        order.status = status
        await order.save()

        res.json({ message: `Order ${status}`, order })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


module.exports = { placeOrder, getMyOrders, getShopOrders, updateOrderStatus }