import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Yamaha');
  const [category, setCategory] = useState('Guitars');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProductDetails();
  }, [user, id]);

  const fetchProductDetails = async () => {
    setFetching(true);
    setError('');
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      if (data.success) {
        const p = data.product;
        setName(p.name);
        setBrand(p.brand);
        setCategory(p.category);
        setPrice(p.price);
        setCountInStock(p.countInStock);
        setDescription(p.description);
        setImagePreview(p.image);
      } else {
        setError(data.message || 'Failed to load product details');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error fetching product information.');
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !price || !countInStock || !description) {
      setError('Please fill in all required text fields.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('countInStock', countInStock);
    formData.append('description', description);
    
    if (image) {
      formData.append('image', image);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(`/api/products/${id}`, formData, config);

      if (data.success) {
        alert('Product updated successfully!');
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Failed to update product');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error. Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '700px' }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-custom py-2 px-3" onClick={() => navigate('/admin/dashboard')}>
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </button>
        <h3 className="fw-bold mb-0">Edit Product</h3>
      </div>

      <div className="auth-card w-100 p-4">
        <h4 className="fw-bold mb-4 text-center">Modify Guitar Catalog Listing</h4>

        {fetching && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary spinner-border-sm me-2"></div>
            Loading product data...
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger mb-4"
            style={{
              borderRadius: '12px',
              fontSize: '0.9rem',
              background: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid rgba(220, 53, 69, 0.2)',
              color: '#ea868f',
            }}
          >
            {error}
          </div>
        )}

        {!fetching && (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group-custom mb-3">
              <label className="input-label-custom">Product Name *</label>
              <div className="input-icon-wrapper">
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="e.g., Yamaha F310 Acoustic Guitar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <i className="bi bi-tag field-icon"></i>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="input-label-custom d-block mb-1 text-muted fs-7">Brand *</label>
                <select
                  className="form-select form-control-custom form-select-custom w-100"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="Yamaha">Yamaha</option>
                  <option value="Kadence">Kadence</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="input-label-custom d-block mb-1 text-muted fs-7">Category *</label>
                <select
                  className="form-select form-control-custom form-select-custom w-100"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Guitars">Guitars</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="form-group-custom">
                  <label className="input-label-custom">Price (INR) *</label>
                  <div className="input-icon-wrapper">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control-custom"
                      placeholder="9990.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                    <i className="bi bi-currency-rupee field-icon"></i>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="form-group-custom">
                  <label className="input-label-custom">Stock Quantity *</label>
                  <div className="input-icon-wrapper">
                    <input
                      type="number"
                      min="0"
                      className="form-control-custom"
                      placeholder="10"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      required
                    />
                    <i className="bi bi-box field-icon"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group-custom mb-3">
              <label className="input-label-custom">Description *</label>
              <textarea
                className="form-control-custom py-2"
                style={{ minHeight: '100px', resize: 'vertical' }}
                placeholder="Provide a detailed product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="input-label-custom d-block mb-1 text-muted fs-7">Product Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control form-control-custom"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-3 text-center">
                  <p className="fs-8 text-muted mb-1">Image Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="img-thumbnail rounded"
                    style={{ maxHeight: '180px', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                    }}
                  />
                </div>
              )}
            </div>

            <button type="submit" className="btn-gradient w-100 py-3" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Updating Inventory...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
