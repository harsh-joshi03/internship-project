import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ cartCount, onCartClick, searchInput, setSearchInput, categoryFilter, setCategoryFilter }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom glass sticky-top mt-3 mx-lg-4 mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand navbar-brand-custom" to="/">
          <i className="bi bi-lightning-charge-fill me-1"></i> E-Shop
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search bar - only show on home / shop page */}
          {setSearchInput && (
            <div className="mx-auto my-3 my-lg-0" style={{ maxWidth: '500px', width: '100%' }}>
              <div className="input-group">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="form-control form-control-custom"
                  placeholder="Search premium guitars and gear..."
                />
                <button className="btn btn-outline-custom" type="button">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          )}

          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/">Shop</Link>
            </li>

            {user && (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/myorders">My Orders</Link>
              </li>
            )}

            {user && user.isAdmin && (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom text-warning" to="/admin/dashboard">
                  <i className="bi bi-shield-lock me-1"></i>Admin Panel
                </Link>
              </li>
            )}

            {/* Cart trigger */}
            <li className="nav-item">
              <button className="cart-btn" onClick={onCartClick}>
                <i className="bi bi-bag"></i> Cart
                <span className="cart-badge" id="cartBadgeCount">{cartCount}</span>
              </button>
            </li>

            {/* User Greeting and Authentication buttons */}
            <li className="nav-item ms-lg-3">
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-custom dropdown-toggle"
                    type="button"
                    id="userMenu"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i> {user.name}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark glass" aria-labelledby="userMenu">
                    <li>
                      <Link className="dropdown-item" to="/myorders">
                        <i className="bi bi-receipt me-2"></i>My Orders
                      </Link>
                    </li>
                    {user.isAdmin && (
                      <li>
                        <Link className="dropdown-item" to="/admin/dashboard">
                          <i className="bi bi-gear me-2"></i>Manage Products
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider border-secondary" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger w-100 text-start" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-custom me-2">Sign In</Link>
                  <Link to="/register" className="btn btn-gradient">Register</Link>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
