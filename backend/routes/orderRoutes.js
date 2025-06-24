const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  acceptOrder,
  markAsDelivered,
  getPendingOrders,
  getMyDeliveries,
  updateRiderLocation  // ✅ NEW
} = require('../controllers/orderController');

const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// Customer
router.post('/', auth, authorizeRoles('customer'), placeOrder);
router.get('/', auth, authorizeRoles('customer'), getMyOrders);

// Rider
router.get('/pending', auth, authorizeRoles('rider'), getPendingOrders);
router.get('/my-deliveries', auth, authorizeRoles('rider'), getMyDeliveries);
router.put('/:id/accept', auth, authorizeRoles('rider'), acceptOrder);
router.put('/:id/deliver', auth, authorizeRoles('rider'), markAsDelivered);
router.put('/:id/location', auth, authorizeRoles('rider'), updateRiderLocation); // ✅ New route

module.exports = router;
