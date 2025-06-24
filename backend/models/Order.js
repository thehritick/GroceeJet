const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'delivered'],
      default: 'pending',
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // 📍 Rider's mock live location
    riderLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // 🕓 Delivered at
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
