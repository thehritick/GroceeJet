const Product = require('../models/Product');

// Add new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, image, stock, category } = req.body;

    const product = new Product({
      name,
      price,
      image,
      stock,
      category,
      shopOwner: req.user._id // ✅ from JWT
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('❌ Product creation error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get products created by this shop owner
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ shopOwner: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products (admin or open view)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('shopOwner', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      shopOwner: req.user._id
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, shopOwner: req.user._id }, // ✅ secure by ownership
      {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        stock: req.body.stock,
        category: req.body.category,
        shopOwner: req.user._id // ✅ keep shopOwner intact
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ message: err.message || 'Update failed' });
  }
};
