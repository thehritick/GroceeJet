import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PaymentPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const headers = { Authorization: token };
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePay = async () => {
    setLoading(true);
    try {
      const payload = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity,
        }))
      };

      await axios.post('http://localhost:5000/api/orders', payload, { headers });

      alert('✅ Payment successful and order placed!');
      localStorage.removeItem('cart');
      setCart([]);
      navigate('/customer/orders');
    } catch (err) {
      alert(err.response?.data?.message || '❌ Payment or order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>🧾 Review & Pay</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {cart.map(item => (
              <li key={item._id} className="list-group-item d-flex justify-content-between">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </li>
          </ul>

          <div className="card p-4 shadow-sm">
            <h5>🧾 Mock Payment Gateway</h5>
            <p>This simulates Razorpay/Stripe for demo purposes.</p>
            <button className="btn btn-primary" onClick={handlePay} disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${total}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
