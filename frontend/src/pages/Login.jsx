import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Optional CSS

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      localStorage.setItem('token', `Bearer ${res.data.token}`);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === 'customer') navigate('/customer');
      else if (role === 'shop-owner') navigate('/shop');
      else if (role === 'rider') navigate('/rider');
      else navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891419.png"
            alt="GroceeJet Logo"
            style={{ width: '60px' }}
          />
          <h2 className="mt-2">Login</h2>
          <p className="text-muted">Access your GroceeJet account 🛒</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-success w-100">Login</button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-1">
            Don’t have an account?{' '}
            <Link to="/register" className="text-primary">
              Register
            </Link>
          </p>
          <Link to="/" className="text-muted">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
