import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  const [tab, setTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    stock: '',
    category: ''
  });

  const [categoryFilter, setCategoryFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');

  useEffect(() => {
    fetchAll();
  }, [token]);

  const fetchAll = async () => {
    try {
      const usersRes = await axios.get('http://localhost:5000/api/admin/users', { headers });
      setUsers(usersRes.data);

      const productsRes = await axios.get('http://localhost:5000/api/admin/products', { headers });
      setProducts(productsRes.data);

      const ordersRes = await axios.get('http://localhost:5000/api/admin/orders', { headers });
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Admin fetch error:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, { headers });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/products/${id}`, editForm, { headers });
      setEditId(null);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const uniqueOwners = [...new Set(products.map(p => p.shopOwner?.name).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchCategory = categoryFilter ? p.category === categoryFilter : true;
    const matchOwner = ownerFilter ? p.shopOwner?.name === ownerFilter : true;
    return matchCategory && matchOwner;
  });

  const renderUsers = () => (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th><th>Name</th><th>Email</th><th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <tr key={user._id}>
            <td>{idx + 1}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderProducts = () => (
    <>
      <div className="d-flex gap-3 mb-3">
        <div>
          <label>Filter by Category:</label>
          <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">All</option>
            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label>Filter by Shop Owner:</label>
          <select className="form-select" value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)}>
            <option value="">All</option>
            {uniqueOwners.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {(categoryFilter || ownerFilter) && (
          <button className="btn btn-outline-secondary align-self-end" onClick={() => {
            setCategoryFilter('');
            setOwnerFilter('');
          }}>
            Reset Filters
          </button>
        )}
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Shop Owner</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p, idx) => (
            <tr key={p._id}>
              <td>{idx + 1}</td>
              <td>
                {editId === p._id ? (
                  <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                ) : p.name}
              </td>
              <td>
                {editId === p._id ? (
                  <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                ) : `₹${p.price}`}
              </td>
              <td>
                {editId === p._id ? (
                  <input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} />
                ) : p.stock}
              </td>
              <td>
                {editId === p._id ? (
                  <input value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} />
                ) : p.category}
              </td>
              <td>{p.shopOwner?.name || 'N/A'}</td>
              <td>
                {editId === p._id ? (
                  <>
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleEditSubmit(p._id)}>Save</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderOrders = () => (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>#</th><th>Customer</th><th>Status</th><th>Items</th><th>Rider</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, idx) => (
          <tr key={order._id}>
            <td>{idx + 1}</td>
            <td>{order.customer?.name || 'N/A'}</td>
            <td>
              <span className={`badge bg-${order.status === 'delivered' ? 'success' : 'warning'}`}>
                {order.status}
              </span>
            </td>
            <td>
              {order.items.map(i => `${i.productId?.name || 'Item'} x ${i.quantity}`).join(', ')}
            </td>
            <td>{order.rider?.name || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard 👨‍💼</h2>

      <div className="btn-group mt-4 mb-3">
        <button className={`btn btn-${tab === 'users' ? 'dark' : 'outline-dark'}`} onClick={() => setTab('users')}>Users</button>
        <button className={`btn btn-${tab === 'products' ? 'dark' : 'outline-dark'}`} onClick={() => setTab('products')}>Products</button>
        <button className={`btn btn-${tab === 'orders' ? 'dark' : 'outline-dark'}`} onClick={() => setTab('orders')}>Orders</button>
      </div>

      {tab === 'users' && renderUsers()}
      {tab === 'products' && renderProducts()}
      {tab === 'orders' && renderOrders()}
    </div>
  );
}
