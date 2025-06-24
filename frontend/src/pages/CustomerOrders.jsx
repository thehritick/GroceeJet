import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: token }
        });
        setOrders(res.data);
      } catch (err) {
        alert('Error fetching order history');
      }
    };

    fetchOrders();
  }, [token]);

  const renderItems = (items) =>
    items.map(i => `${i.productId?.name || 'Item'} x ${i.quantity}`).join(', ');

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🧾 My Order History</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Order #{order._id.slice(-5)}</h5>
              <p><strong>Status:</strong> 
                <span className={`badge bg-${order.status === 'delivered' ? 'success' : 'warning'} ms-2`}>
                  {order.status}
                </span>
              </p>
              <p><strong>Items:</strong> {renderItems(order.items)}</p>
              <p><strong>Rider:</strong> {order.rider?.name || 'Not assigned'}</p>
              <p><strong>Estimated Delivery:</strong> 30 mins</p>

              {/* 🔍 Dummy Google Map View */}
              <div className="mt-3">
                <img
                  src="https://maps.googleapis.com/maps/api/staticmap?center=Delhi,IN&zoom=12&size=600x300&key=YOUR_API_KEY"
                  alt="Delivery Area"
                  className="img-fluid border rounded"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
