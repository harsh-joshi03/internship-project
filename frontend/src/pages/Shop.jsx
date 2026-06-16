import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shop = ({ addToCart, searchInput }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

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
      setError('Unable to load products. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search value and category selection
  const filteredProducts = products.filter((p) => {
    const searchMatch =
      p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      p.description.toLowerCase().includes(searchInput.toLowerCase());
    const categoryMatch =
      categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return searchMatch && categoryMatch;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
      } else if (i - 0.5 <= rating) {
        stars.push(<i key={i} className="bi bi-star-half text-warning me-1"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-warning me-1"></i>);
      }
    }
    return stars;
  };

  const scrollToProducts = () => {
    document.getElementById('productsListing').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container">
      {/* Background glow elements */}
      <div className="background-glows">
        <div className="glow-blob blob-purple"></div>
        <div className="glow-blob blob-pink"></div>
      </div>

      {/* Hero Section */}
      <header className="hero-section glass p-5 rounded-4 text-center text-lg-start d-flex align-items-center mb-5">
        <div className="row align-items-center w-100">
          <div className="col-lg-7">
            <h2 className="hero-title">
              Experience <span>Next-Gen</span> Guitar Magic
            </h2>
            <p className="hero-subtitle">
              Discover a curated collection of premium acoustic, electric, classical, and bass guitars, ukuleles, and essential accessories.
            </p>
            <button className="btn btn-gradient btn-lg py-3 px-5 fs-6" onClick={scrollToProducts}>
              Explore Gear
            </button>
          </div>
          <div className="col-lg-5 d-none d-lg-block text-center">
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60"
              alt="Tech Gear"
              className="img-fluid rounded-4 shadow-lg border border-secondary"
              style={{ maxHeight: '320px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </header>

      {/* Catalog Grid Section */}
      <section id="productsListing" className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-white mb-0">Featured Guitars & Gear</h3>
          <select
            className="form-select form-control-custom form-select-custom"
            style={{ width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="guitars">Guitars</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading our catalog...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-danger glass text-center py-4">
            <i className="bi bi-exclamation-triangle-fill fs-2 mb-2 text-danger"></i>
            <h5>Unable to fetch products</h5>
            <p className="text-muted">{error}</p>
            <button className="btn btn-outline-custom btn-sm mt-2" onClick={fetchProducts}>
              Try Again
            </button>
          </div>
        )}

        {/* Products Display Grid */}
        {!loading && !error && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredProducts.length === 0 ? (
              <div className="col-12 text-center py-5 text-muted">
                <i className="bi bi-search fs-2"></i>
                <p className="mt-2">No products match your criteria.</p>
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isOutOfStock = p.countInStock <= 0;
                return (
                  <div className="col" key={p._id}>
                    <div className="card product-card glass h-100">
                      <div className="product-img-wrapper">
                        <img
                          src={p.image}
                          className="product-img"
                          alt={p.name}
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <div className="product-category text-uppercase fs-8 text-secondary">
                          {p.category}
                        </div>
                        <h5 className="product-name fw-bold text-white mt-1 mb-2">{p.name}</h5>

                        <p className="text-muted fs-7 line-clamp-3 mb-2">{p.description}</p>

                        <div className="product-rating d-flex align-items-center mb-3">
                          {renderStars(p.rating)}
                          <span className="ms-2 text-muted fs-8">({p.numReviews} reviews)</span>
                        </div>

                        <div className="product-footer d-flex justify-content-between align-items-center mt-auto">
                          <span className="product-price fw-bold fs-5 text-white">
                            ₹{p.price.toFixed(2)}
                          </span>
                          <button
                            className="add-cart-btn-sm btn btn-sm"
                            onClick={() => addToCart(p)}
                            disabled={isOutOfStock}
                            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                          >
                            {isOutOfStock ? (
                              <i className="bi bi-x-circle text-danger"></i>
                            ) : (
                              <i className="bi bi-plus-lg text-white"></i>
                            )}
                          </button>
                        </div>
                        {isOutOfStock ? (
                          <div className="text-danger fs-8 mt-2">
                            <i className="bi bi-slash-circle me-1"></i>Out of Stock
                          </div>
                        ) : (
                          <div className="text-success fs-8 mt-2">
                            <i className="bi bi-check-circle me-1"></i>{p.countInStock} items in stock
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Shop;
