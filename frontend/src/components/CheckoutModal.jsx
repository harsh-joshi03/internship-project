import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CheckoutModal = ({ isOpen, onClose, cart, clearCart, onOrderSuccess }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  if (!isOpen) return null;

  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 250;
  const taxPrice = itemsPrice * 0.15;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      alert('Please fill out all shipping fields.');
      return;
    }

    setLoading(true);

    const orderBody = {
      orderItems: cart.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product,
      })),
      shippingAddress: { address, city, postalCode, country },
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/orders', orderBody, config);

      if (data.success) {
        alert('Order placed successfully!');
        clearCart();
        onClose();
        onOrderSuccess();
      } else {
        alert(data.message || 'Error placing order');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Server connection failed. Could not place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-content-glass text-white">
          <div className="modal-header modal-header-custom border-secondary">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-credit-card me-2 text-purple-accent"></i>Shipping & Payment
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <h6 className="fw-bold mb-3 text-secondary text-uppercase fs-7">Shipping Address</h6>
              
              <div className="mb-3">
                <label className="form-label text-muted fs-7">Street Address</label>
                <input
                  type="text"
                  className="form-control form-control-custom text-white"
                  placeholder="e.g. Flat No, Building Name, MG Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fs-7">City</label>
                  <input
                    type="text"
                    className="form-control form-control-custom text-white"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fs-7">Postal Code</label>
                  <input
                    type="text"
                    className="form-control form-control-custom text-white"
                    placeholder="e.g. 400001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fs-7">Country</label>
                <input
                  type="text"
                  className="form-control form-control-custom text-white"
                  placeholder="e.g. India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>

              <h6 className="fw-bold my-3 text-secondary text-uppercase fs-7">Payment Method</h6>
              <div className="mb-3">
                <label className="form-label text-muted fs-7">Choose Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-select form-control-custom form-select-custom text-white w-100"
                >
                  <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                  <option value="Credit/Debit Card">Credit/Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                </select>
              </div>

              {/* Order Summary Pricing Panel */}
              <div className="glass p-3 mt-4">
                <div className="d-flex justify-content-between fs-7 text-muted mb-1">
                  <span>Items:</span>
                  <span>₹{itemsPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between fs-7 text-muted mb-1">
                  <span>Shipping:</span>
                  <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="d-flex justify-content-between fs-7 text-muted mb-2">
                  <span>Tax (15%):</span>
                  <span>₹{taxPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold text-white border-top border-secondary pt-2">
                  <span>Total Amount:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer modal-footer-custom border-secondary d-flex justify-content-between">
              <button type="button" className="btn btn-outline-custom" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-gradient px-4" disabled={loading}>
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
