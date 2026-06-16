import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Selected order details for modal popup
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/orders/myorders', config);
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error loading orders.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    setLoadingDetail(true);
    setSelectedOrder(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/${orderId}`, config);
      if (data.success) {
        setSelectedOrder(data.order);
      } else {
        alert(data.message || 'Could not fetch order details');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching order details');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`/api/orders/${orderId}/cancel`, {}, config);
      if (data.success) {
        alert('Order cancelled successfully!');
        fetchOrders();
      } else {
        alert(data.message || 'Failed to cancel order.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error cancelling order.');
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-custom py-2 px-3" onClick={() => navigate('/')}>
          <i className="bi bi-arrow-left"></i> Back to Shop
        </button>
        <h3 className="fw-bold text-white mb-0">Your Order History</h3>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Fetching your orders...</p>
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
            <table className="table table-custom w-100">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-receipt fs-1 mb-2 d-block"></i>
                      You haven't placed any orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="fw-semibold text-white fs-7">{order._id}</td>
                      <td className="text-muted fs-7">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="fw-semibold text-white fs-7">₹{order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.isPaid ? (
                          <span className="badge-custom-paid">
                            <i className="bi bi-check-circle me-1"></i>Paid
                          </span>
                        ) : (
                          <span className="badge-custom-unpaid">
                            <i className="bi bi-x-circle me-1"></i>Unpaid
                          </span>
                        )}
                      </td>
                      <td>
                        {order.isCancelled ? (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-8 rounded">
                            <i className="bi bi-x-circle me-1"></i>Cancelled
                          </span>
                        ) : order.isDelivered ? (
                          <span className="badge-custom-paid">
                            <i className="bi bi-check-circle me-1"></i>Delivered
                          </span>
                        ) : (
                          <span className="badge-custom-unpaid">
                            <i className="bi bi-clock me-1"></i>Pending
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-custom btn-sm py-1 px-3 fs-7"
                            data-bs-toggle="modal"
                            data-bs-target="#orderDetailModal"
                            onClick={() => fetchOrderDetail(order._id)}
                          >
                            View Detail
                          </button>
                          {!order.isCancelled && !order.isDelivered && (
                            <button
                              className="btn btn-danger btn-sm py-1 px-3 fs-7"
                              onClick={() => handleCancelOrder(order._id)}
                              style={{ fontWeight: '600', border: 'none' }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <div
        className="modal fade"
        id="orderDetailModal"
        tabIndex="-1"
        aria-labelledby="orderDetailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modal-content-glass text-white">
            <div className="modal-header modal-header-custom">
              <h5 className="modal-title fw-bold" id="orderDetailModalLabel">
                Order Summary
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4">
              {loadingDetail && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                  Loading order details...
                </div>
              )}

              {selectedOrder && (
                <>
                  <div className="mb-3 border-bottom border-secondary pb-3">
                    <span className="text-muted fs-8 d-block">Order Ref</span>
                    <strong className="text-white">{selectedOrder._id}</strong>
                  </div>

                  <div className="mb-3">
                    <span className="text-muted fs-8 d-block">Deliver To:</span>
                    <div className="text-white fs-7 mt-1">
                      <strong>{selectedOrder.user?.name}</strong> ({selectedOrder.user?.email})<br />
                      {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}
                      <br />
                      {selectedOrder.shippingAddress?.postalCode},{' '}
                      {selectedOrder.shippingAddress?.country}
                    </div>
                  </div>

                  <div className="mb-3 border-bottom border-secondary pb-3">
                    <span className="text-muted fs-8 d-block">Payment Method:</span>
                    <span className="text-white fs-7">{selectedOrder.paymentMethod}</span>
                  </div>

                  <div className="mb-3 border-bottom border-secondary pb-3">
                    <span className="text-muted fs-8 d-block">Order Status:</span>
                    {selectedOrder.isCancelled ? (
                      <span className="text-danger fw-semibold fs-7">
                        Cancelled on {new Date(selectedOrder.cancelledAt).toLocaleString()}
                      </span>
                    ) : selectedOrder.isDelivered ? (
                      <span className="text-success fw-semibold fs-7">
                        Delivered on {new Date(selectedOrder.deliveredAt).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-warning fw-semibold fs-7">Pending Delivery</span>
                    )}
                  </div>

                  <div className="mb-3 border-bottom border-secondary pb-3">
                    <span className="text-muted fs-8 d-block mb-2">Order Items:</span>
                    {selectedOrder.orderItems?.map((item) => (
                      <div
                        key={item._id}
                        className="d-flex justify-content-between align-items-center mb-2 fs-7"
                      >
                        <span className="text-muted">
                          {item.name} <strong className="text-white">x {item.qty}</strong>
                        </span>
                        <span className="text-white fw-semibold">
                          ₹{(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between fw-bold text-white fs-6">
                    <span>Grand Total:</span>
                    <span className="text-purple-accent">
                      ₹{selectedOrder.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer modal-footer-custom">
              <button type="button" className="btn btn-gradient w-100" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
