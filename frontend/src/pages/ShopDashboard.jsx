import { useState, useEffect } from 'react';
import axios from 'axios';
import './ShopDashboard.css'; // <-- Optional custom styles

export default function ShopDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filter, setFilter] = useState('');

  const [form, setForm] = useState({ name: '', price: '', image: '', stock: '', category: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', image: '', stock: '', category: '' });

  const headers = {
    Authorization: localStorage.getItem('token') || '',
  };

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products', { headers });
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const url = `http://localhost:5000/api/shop/orders${filter ? `?status=${filter}` : ''}`;
    const res = await axios.get(url, { headers });
    setOrders(res.data);
  };

  const fetchAnalytics = async () => {
    const res = await axios.get('http://localhost:5000/api/shop/analytics', { headers });
    setAnalytics(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchAnalytics();
  }, [filter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    editId ? setEditForm({ ...editForm, [name]: value }) : setForm({ ...form, [name]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/products', form, { headers });
    setForm({ name: '', price: '', image: '', stock: '', category: '' });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`http://localhost:5000/api/products/${id}`, { headers });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditForm({ ...product });
  };

  const handleEditSubmit = async () => {
    await axios.put(`http://localhost:5000/api/products/${editId}`, editForm, { headers });
    setEditId(null);
    fetchProducts();
  };

  return (
    <div className="container my-4">
      <h2 className="dashboard-header">🛍️ Shop Owner Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center p-3">
            <div className="card-header">Total Products</div>
            <h4 className="mt-2">{analytics.totalProducts || 0}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3">
            <div className="card-header">Total Orders</div>
            <h4 className="mt-2">{analytics.totalOrders || 0}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3">
            <div className="card-header">Delivered</div>
            <h4 className="mt-2">{analytics.deliveredCount || 0}</h4>
          </div>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="card p-4 mb-5">
        <div className="card-header">Add Product</div>
        <form onSubmit={handleAdd} className="row g-3 mt-2">
          {['name', 'price', 'image', 'stock', 'category'].map(field => (
            <div className="col-md-6" key={field}>
              <input
                className="form-control"
                name={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                onChange={handleChange}
                value={form[field]}
                type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                required={field !== 'image'}
              />
            </div>
          ))}
          <div className="col-12">
            <button className="btn btn-primary w-100">Add Product</button>
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="card p-4 mb-5">
        <div className="card-header">Your Products</div>
        <ul className="list-group mt-3">
          {products.map(p => (
            <li key={p._id} className="list-group-item">
              {editId === p._id ? (
                <div className="row g-2 align-items-center">
                  {['name', 'price', 'image', 'stock', 'category'].map(field => (
                    <div className="col-md-2" key={field}>
                      <input
                        className="form-control"
                        name={field}
                        value={editForm[field]}
                        onChange={handleChange}
                        type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                      />
                    </div>
                  ))}
                  <div className="col-md-2 d-flex gap-2">
                    <button className="btn btn-success btn-sm w-50" onClick={handleEditSubmit}>Save</button>
                    <button className="btn btn-secondary btn-sm w-50" onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{p.name}</strong> - ₹{p.price} | Stock: {p.stock} | {p.category}
                  </div>
                  <div>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Orders */}
      <div className="card p-4 mb-5">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Your Orders</span>
          <select onChange={(e) => setFilter(e.target.value)} className="form-select w-auto" value={filter}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        {orders.length === 0 ? (
          <p className="mt-3">No orders yet</p>
        ) : (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>#</th><th>Customer</th><th>Status</th><th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <tr key={o._id}>
                  <td>{idx + 1}</td>
                  <td>{o.customer?.name || 'N/A'}</td>
                  <td>
                    <span className={`badge bg-${o.status === 'delivered' ? 'success' : o.status === 'accepted' ? 'primary' : 'warning'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    {o.items.map(i => `${i.productId?.name} x ${i.quantity}`).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
