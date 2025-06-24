const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

const {
  getShopProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getShopOrders,
  getShopAnalytics  // ✅ Added analytics controller
} = require('../controllers/shopController');

// 🔒 Protect all routes with auth + shop-owner role

// 🛍 Product Routes
router.get('/products', auth, authorizeRoles('shop-owner'), getShopProducts);
router.post('/products', auth, authorizeRoles('shop-owner'), createProduct);
router.put('/products/:id', auth, authorizeRoles('shop-owner'), updateProduct);
router.delete('/products/:id', auth, authorizeRoles('shop-owner'), deleteProduct);

// 📦 Order Route
router.get('/orders', auth, authorizeRoles('shop-owner'), getShopOrders);

// 📊 Analytics Route (🔥 Needed for Dashboard)
router.get('/analytics', auth, authorizeRoles('shop-owner'), getShopAnalytics);

module.exports = router;
