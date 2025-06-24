const express = require('express');
const router = express.Router();

const {
  createProduct,
  getMyProducts,
  deleteProduct,
  updateProduct, // ✅ Import update
  getAllProducts
} = require('../controllers/productController');

const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// 🔐 Routes for shop-owner
router.post('/', auth, authorizeRoles('shop-owner'), createProduct);
router.get('/', auth, authorizeRoles('shop-owner'), getMyProducts);
router.put('/:id', auth, authorizeRoles('shop-owner'), updateProduct); // ✅ Add this
router.delete('/:id', auth, authorizeRoles('shop-owner'), deleteProduct);

// 🌐 Open/public route
router.get('/all', getAllProducts);

module.exports = router;
