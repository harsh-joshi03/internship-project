const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Private route to create order and fetch all user orders
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);

// Private route to fetch specific order by ID and cancel order
router.route('/:id').get(protect, getOrderById);
router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;
