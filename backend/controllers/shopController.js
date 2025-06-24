const Product = require('../models/Product');
const Order = require('../models/Order');

// 🛒 Get all products of the shop owner
exports.getShopProducts = async (req, res) => {
  try {
    const products = await Product.find({ shopOwner: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// ➕ Create new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      shopOwner: req.user._id,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error creating product:', err);
    res.status(500).json({ message: 'Server error during product creation' });
  }
};

// 🖊️ Update product (includes image & category)
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, shopOwner: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// ❌ Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, shopOwner: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// 📦 Get orders containing this shop owner's products
exports.getShopOrders = async (req, res) => {
  try {
    const shopOwnerId = req.user._id.toString();
    const { status } = req.query; // optional filter

    const orders = await Order.find()
      .populate('items.productId')
      .populate('customer', 'name');

    const filtered = orders.filter(order =>
      order.items.some(item =>
        item?.productId?.shopOwner?.toString() === shopOwnerId
      )
    );

    const final = status ? filtered.filter(o => o.status === status) : filtered;

    res.json(final);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// 📊 Analytics endpoint (for shop-owner dashboard)
exports.getShopAnalytics = async (req, res) => {
  try {
    const shopOwnerId = req.user._id;

    const totalProducts = await Product.countDocuments({ shopOwner: shopOwnerId });
    const allOrders = await Order.find().populate('items.productId');
    const relatedOrders = allOrders.filter(order =>
      order.items.some(item =>
        item?.productId?.shopOwner?.toString() === shopOwnerId.toString()
      )
    );

    const deliveredCount = relatedOrders.filter(o => o.status === 'delivered').length;

    res.json({
      totalProducts,
      totalOrders: relatedOrders.length,
      deliveredCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Analytics fetch failed' });
  }
};
