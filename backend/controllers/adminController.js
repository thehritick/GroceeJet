const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// 👥 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🛍️ Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('shopOwner', 'name');
    console.log('Fetched products:', products.length);
    res.json(products);
  } catch (err) {
    console.error('Product fetch error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// 📦 Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name')
      .populate('items.productId', 'name')
      .populate('rider', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock ?? product.stock;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
