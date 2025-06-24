import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('http://localhost:5000/api/products/all');
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Welcome, Customer 👤</h2>

      {/* 📍 Track Orders */}
      <div className="mb-4">
        <button className="btn btn-outline-dark" onClick={() => navigate('/customer/orders')}>
          📍 Track My Orders
        </button>
      </div>

      <h4>Products</h4>
      <div className="row">
        {products.map(product => (
          <div className="col-md-4 mb-3" key={product._id}>
            <div className="card p-2">
              <h5>{product.name}</h5>
              <p>₹{product.price} | {product.category}</p>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr />

      <h4>Your Cart</h4>
      {cart.length === 0 ? (
        <p>No items yet</p>
      ) : (
        <ul className="list-group">
          {cart.map(item => (
            <li key={item._id} className="list-group-item d-flex justify-content-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <button className="btn btn-success mt-3" onClick={() => navigate('/payment')}>
          Proceed to Payment
        </button>
      )}
    </div>
  );
}
