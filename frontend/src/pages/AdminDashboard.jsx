import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/products');
      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error(err);
      setError('Error loading products list.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete ${productName}?`)) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.delete(`/api/products/${productId}`, config);
      if (data.success) {
        alert('Product deleted successfully');
        // Filter out deleted product from state list
        setProducts(products.filter((p) => p._id !== productId));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error occurred while deleting product.');
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">
          <i className="bi bi-shield-lock me-2 text-warning"></i>Admin Product Control
        </h3>
        <Link to="/admin/add-product" className="btn btn-gradient px-4 py-2">
          <i className="bi bi-plus-lg me-1"></i> Add Product
        </Link>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading products list...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger glass text-center py-4">
          <p className="mb-0">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="glass p-4 rounded-4">
          <div className="table-responsive">
            <table className="table table-custom w-100 align-middle">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>NAME</th>
                  <th>BRAND</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No products available in the database.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img
                          src={p.image}
                          alt={p.name}
                          className="rounded"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                          }}
                        />
                      </td>
                      <td className="fw-semibold fs-7">{p.name}</td>
                      <td className="text-muted fs-7">{p.brand}</td>
                      <td className="text-muted fs-7 text-capitalize">{p.category}</td>
                      <td className="fw-semibold fs-7">₹{p.price.toFixed(2)}</td>
                      <td>
                        {p.countInStock > 0 ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            {p.countInStock} Left
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        <Link
                          to={`/admin/edit-product/${p._id}`}
                          className="btn btn-sm px-3 py-1 fs-7 me-2"
                          style={{ backgroundColor: '#8B5CF6', color: '#ffffff', border: 'none', fontWeight: '600' }}
                        >
                          <i className="bi bi-pencil-fill me-1"></i> Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm px-3 py-1 fs-7"
                          onClick={() => handleDelete(p._id, p.name)}
                          style={{ border: 'none', fontWeight: '600' }}
                        >
                          <i className="bi bi-trash-fill me-1"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
