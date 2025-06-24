const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getAllProducts,
  getAllOrders,
  deleteProduct,
  updateProduct
} = require('../controllers/adminController');


router.get('/users', auth, authorizeRoles('admin'), getAllUsers);
router.get('/products', auth, authorizeRoles('admin'), getAllProducts);
router.get('/orders', auth, authorizeRoles('admin'), getAllOrders);

router.delete('/products/:id', auth, authorizeRoles('admin'), deleteProduct);
router.put('/products/:id', auth, authorizeRoles('admin'), updateProduct);


module.exports = router;
