const Order = require('../models/Order');

// 🛒 Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must include at least one item.' });
    }

    const order = new Order({
      customer: req.user._id,
      items,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('❌ placeOrder error:', err);
    res.status(500).json({ message: err.message });
  }
};

// 📜 Get My Orders with ETA
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.productId', 'name price')
      .populate('rider', 'name');

    const enhanced = orders.map(order => ({
      ...order.toObject(),
      estimatedDelivery: getETA(order.createdAt)
    }));

    res.json(enhanced);
  } catch (err) {
    console.error('❌ getMyOrders error:', err);
    res.status(500).json({ message: err.message });
  }
};

// 🧮 Helper to generate delivery time estimate
function getETA(createdAt) {
  const etaMinutes = 30;
  const etaTime = new Date(new Date(createdAt).getTime() + etaMinutes * 60000);
  return etaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// 🚚 Accept Order
exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'pending') return res.status(400).json({ message: 'Order not available for acceptance' });

    order.status = 'accepted';
    order.rider = req.user._id;
    await order.save();

    res.json({ message: 'Order accepted', order });
  } catch (err) {
    console.error('❌ acceptOrder error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Rider Location (new!)
exports.updateRiderLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.rider?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }

    order.riderLocation = { lat, lng };
    await order.save();

    res.json({ message: 'Location updated', riderLocation: order.riderLocation });
  } catch (err) {
    console.error('❌ updateRiderLocation error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Mark as Delivered
exports.markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.rider?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }

    order.status = 'delivered';
    order.deliveredAt = new Date();
    await order.save();

    res.json({ message: 'Order marked as delivered' });
  } catch (err) {
    console.error('❌ markAsDelivered error:', err);
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get Pending Orders
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' })
      .populate('customer', 'name')
      .populate('items.productId', 'name');
    res.json(orders);
  } catch (err) {
    console.error('❌ getPendingOrders error:', err);
    res.status(500).json({ message: err.message });
  }
};

// 📦 Rider: My Deliveries
exports.getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({ rider: req.user._id })
      .populate('items.productId', 'name')
      .populate('customer', 'name');
    res.json(orders);
  } catch (err) {
    console.error('❌ getMyDeliveries error:', err);
    res.status(500).json({ message: err.message });
  }
};
