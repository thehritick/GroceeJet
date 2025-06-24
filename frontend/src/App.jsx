import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


// 🔐 Auth Pages
import Register from './pages/Register';
import Login from './pages/Login';

// 🧑‍💼 Role-based Dashboards
import CustomerDashboard from './pages/CustomerDashboard';
import ShopDashboard from './pages/ShopDashboard';
import RiderDashboard from './pages/RiderDashboard';
import AdminDashboard from './pages/AdminDashboard';

// 📦 Customer Pages
import CustomerOrderHistory from './pages/CustomerOrderHistory';
import PaymentPage from './pages/PaymentPage';

// 🏠 Home Page
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Public Home */}
        <Route path="/" element={<HomePage />} />

        {/* 🔐 Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🧑‍💼 Dashboards */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/shop" element={<ShopDashboard />} />
        <Route path="/rider" element={<RiderDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 📦 Customer Order History */}
        <Route path="/customer/orders" element={<CustomerOrderHistory />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}
