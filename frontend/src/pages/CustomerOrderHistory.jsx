import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CustomerOrderHistory() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', { headers });
      setOrders(res.data);
    } catch (err) {
      alert('Failed to load your orders');
    }
  };

  const renderMap = (order) => {
    const mockLoc = JSON.parse(localStorage.getItem('mockRiderLocation'));
    const lat = mockLoc?.lat || 28.6139;
    const lng = mockLoc?.lng || 77.2090;

    if (order.status === 'delivered') {
      return (
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=India&zoom=4&size=300x200&key=YOUR_API_KEY`}
          alt="Map"
          className="img-fluid"
        />
      );
    }

    if (order.rider) {
      return (
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=300x200&markers=color:blue|label:R|${lat},${lng}&key=YOUR_API_KEY`}
          alt="Rider Live Location"
          className="img-fluid"
        />
      );
    }

    return <div className="text-muted text-center bg-light py-3">Rider not yet assigned</div>;
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📦 My Order History</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="border rounded p-3 mb-4 shadow-sm">
            <div className="d-flex justify-content-between">
              <strong>Order #{order._id.slice(-5)}</strong>
              <span className={`badge bg-${order.status === 'delivered' ? 'success' : 'warning'}`}>
                {order.status}
              </span>
            </div>
            <p><strong>Rider:</strong> {order.rider?.name || 'Not assigned'}</p>
            <p><strong>ETA:</strong> {order.estimatedDelivery || 'Pending...'}</p>
            <p>
              <strong>Items:</strong>{" "}
              {order.items.map(i => `${i.productId?.name || 'Item'} x ${i.quantity}`).join(', ')}
            </p>
            <div className="map-preview mt-3">{renderMap(order)}</div>
          </div>
        ))
      )}
    </div>
  );
}
