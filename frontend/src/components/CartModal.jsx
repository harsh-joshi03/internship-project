import React from 'react';

const CartModal = ({ isOpen, onClose, cart, changeQty, onCheckout }) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content modal-content-glass text-white">
          <div className="modal-header modal-header-custom border-secondary">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-bag-check me-2 text-purple-accent"></i>Your Shopping Bag
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-cart-x fs-1 mb-2 d-block"></i>
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div className="cart-item-row d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary" key={item.product}>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.image}
                        className="cart-item-img rounded"
                        alt={item.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                        }}
                      />
                      <div className="cart-item-name">
                        <div className="fw-semibold text-white fs-7">{item.name}</div>
                        <div className="text-muted fs-8">₹{item.price.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-4">
                      <div className="qty-control d-flex align-items-center bg-dark-subtle rounded border border-secondary px-2">
                        <button className="qty-btn btn btn-sm text-white px-2 py-0" onClick={() => changeQty(item.product, -1)}>-</button>
                        <span className="qty-val text-white px-3 fs-7">{item.qty}</span>
                        <button className="qty-btn btn btn-sm text-white px-2 py-0" onClick={() => changeQty(item.product, 1)}>+</button>
                      </div>
                      <div className="fw-bold text-white fs-7 min-w-80 text-end">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer modal-footer-custom border-secondary d-flex justify-content-between align-items-center">
            <div>
              <span className="text-muted d-block fs-8">Subtotal:</span>
              <h4 className="fw-bold mb-0 text-white">₹{subtotal.toFixed(2)}</h4>
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-custom" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-gradient px-4 py-2"
                disabled={cart.length === 0}
                onClick={onCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
