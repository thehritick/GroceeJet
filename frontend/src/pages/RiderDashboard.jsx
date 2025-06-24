import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RiderDashboard() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, accepted: 0, delivered: 0 });
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  // 🚚 Simulate location update every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.01,
        lng: prev.lng + (Math.random() - 0.5) * 0.01,
      }));
      localStorage.setItem('mockRiderLocation', JSON.stringify(location));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/pending', { headers });
      setPendingOrders(res.data);
    } catch (err) {
      alert('Error loading pending orders');
    }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my-deliveries', { headers });
      setMyOrders(res.data);
      const accepted = res.data.filter(o => o.status === 'accepted').length;
      const delivered = res.data.filter(o => o.status === 'delivered').length;
      setStats({ total: res.data.length, accepted, delivered });
    } catch (err) {
      alert('Error loading your orders');
    }
  };

  useEffect(() => {
    fetchPendingOrders();
    fetchMyOrders();
  }, []);

  const acceptOrder = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/accept`, {}, { headers });
      alert('Order accepted!');
      fetchPendingOrders();
      fetchMyOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept order');
    }
  };

  const deliverOrder = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, { headers });
      alert('Order marked as delivered');
      fetchMyOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as delivered');
    }
  };

  const renderOrderItems = (items) =>
    items.map(i => `${i.productId?.name || 'Unknown'} x ${i.quantity}`).join(', ');

  return (
    <div className="container mt-5">
      <h2 className="text-center">GROCEEJET DELIVERY</h2>
      
      <div className="mb-3">
        <strong>📍 Your Location:</strong><br />
        Latitude: {location.lat.toFixed(4)}, Longitude: {location.lng.toFixed(4)}
      </div>

      <div className="orders-summary border p-4 mb-4">
        <h4>📊 Analytics</h4>
        <ul className="list-unstyled">
          <li>Total Orders: <strong>{stats.total}</strong></li>
          <li>Accepted: <strong>{stats.accepted}</strong></li>
          <li>Delivered: <strong>{stats.delivered}</strong></li>
        </ul>
      </div>

      <div className="pending-orders">
        <h4>Pending Orders</h4>
        {pendingOrders.length === 0 ? (
          <p>No pending orders.</p>
        ) : (
          pendingOrders.map(order => (
            <div key={order._id} className="order-card border rounded p-3 mb-3 shadow-sm">
              <div className="d-flex justify-content-between">
                <strong>Order ID: #{order._id.slice(-5)}</strong>
                <span className="badge badge-pill badge-warning">Pending</span>
              </div>
              <p>Customer: {order.customer?.name}</p>
              <p>Items: {renderOrderItems(order.items)}</p>
              <button className="btn btn-primary" onClick={() => acceptOrder(order._id)}>Accept Order</button>
            </div>
          ))
        )}
      </div>

      <div className="accepted-orders mt-4">
        <h4>Your Accepted & Delivered Orders</h4>
        {myOrders.length === 0 ? (
          <p>You have no deliveries yet.</p>
        ) : (
          myOrders.map(order => (
            <div key={order._id} className="order-card border rounded p-3 mb-3">
              <div className="d-flex justify-content-between">
                <strong>Order ID: #{order._id.slice(-5)}</strong>
                <span className={`badge badge-${order.status === 'delivered' ? 'success' : 'warning'}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p>Customer: {order.customer?.name}</p>
              <p>Items: {renderOrderItems(order.items)}</p>
              {order.status === 'accepted' && (
                <button className="btn btn-success" onClick={() => deliverOrder(order._id)}>Mark as Delivered</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
