import React, { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import { useCart } from '../context/CartContext';

const statusColors = {
  Processing: 'badge-processing',
  Shipped: 'badge-shipped',
  Delivered: 'badge-delivered',
};

const statusLabels = {
  Processing: 'Processing',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [trackingData, setTrackingData] = useState({});
  const { addToCart } = useCart();

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id || userData?.id || null;
  const token = userData?.token || null;

  console.log("User data from localStorage:", userData);
  console.log("Using userId:", userId);

  useEffect(() => {
    if (!userId) return;
    const needsRefresh = localStorage.getItem("profileNeedsRefresh");
    if (needsRefresh === "true") {
      setRefresh(true);
      localStorage.removeItem("profileNeedsRefresh");
    } else {
      setRefresh(true);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId || !refresh) return;
    const fetchUserData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [userRes, wishlistRes, ordersRes, paymentsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${userId}`, { headers }),
          axios.get(`http://localhost:5000/api/wishlist/${userId}`, { headers }),
          axios.get(`http://localhost:5000/api/orders/${userId}`, { headers }),
          axios.get(`http://localhost:5000/api/payments/${userId}`, { headers }),
        ]);
        setUser(userRes.data);
        setWishlist(wishlistRes.data);
        setOrders(ordersRes.data);
        setPaymentMethods(paymentsRes.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setRefresh(false);
      }
    };
    fetchUserData();
  }, [userId, refresh, token]);

  // Fetch tracking data for all orders
  useEffect(() => {
    if (!orders.length) return;
    const fetchTracking = async () => {
      const all = {};
      for (const order of orders) {
        try {
          const res = await axios.get(`http://localhost:5000/api/orders/${order._id}/tracking`);
          all[order._id] = res.data;
        } catch (e) {
          all[order._id] = null;
        }
      }
      setTrackingData(all);
    };
    fetchTracking();
  }, [orders]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getShippingStatus = (order) => {
    return order.status || 'Processing';
  };

  return (
    <div className="profile-modern-outer">
      <div className="profile-modern-container">
        <div className="profile-modern-page">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              style={{ background: 'linear-gradient(90deg, #6b46c1 30%, #bfaeeb 100%)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500, fontSize: '1rem', padding: '10px 24px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(120,120,200,0.09)', marginRight: 0 }}
              onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }}
            >Logout</button>
          </div>
          <h1 className="profile-title-modern">My Profile</h1>
          {user ? (
            <>
              <section className="profile-section-modern">
                <div className="section-header-modern">
                  <span className="section-icon">👤</span>
                  <h2>Account Info</h2>
                </div>
                <div className="profile-info-list-modern">
                  <div><strong>Username:</strong> {user.username || 'User'}</div>
                  <div><strong>Email:</strong> {user.email || 'No email provided'}</div>
                </div>
              </section>

              <section className="profile-section-modern">
                <div className="section-header-modern">
                  <span className="section-icon">📦</span>
                  <h2>Order History</h2>
                </div>
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>No Orders Yet</h3>
                    <p>Start shopping to see your order history here!</p>
                  </div>
                ) : (
                  <div className="orders-list-modern">
                    {orders.map((order, index) => {
                      const status = getShippingStatus(order);
                      const tracking = trackingData[order._id];
                      return (
                        <div key={order._id || index} className="order-modern-card">
                          <div className="order-modern-header">
                            <span className="order-modern-id">Order #{index + 1}</span>
                            <span className={`order-modern-status badge ${statusColors[status]}`}>{statusLabels[status] || status}</span>
                          </div>
                          <div className="order-modern-items">
                            {order.items.map((item, i) => (
                              <div key={i} className="order-modern-item">
                                <span>{item.name} x{item.quantity || 1}</span>
                                <span>₹{Number(item.price).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="order-modern-footer">
                            <span><strong>Total:</strong> ₹{Number(order.total).toFixed(2)}</span>
                            <span><strong>Date:</strong> {formatDate(order.timestamp)}</span>
                          </div>
                          {/* Tracking Timeline */}
                          {tracking && (
                            <div className="order-tracking-timeline">
                              <div style={{ fontWeight: 500, marginBottom: 4 }}>Tracking #: {tracking.trackingNumber}</div>
                              <div className="tracking-timeline-bar">
                                {tracking.history.map((step, idx) => (
                                  <div key={idx} className="tracking-step">
                                    <div className={`tracking-dot ${order.status === step.status ? 'active' : ''}`}></div>
                                    <div className="tracking-status-label">{step.status}</div>
                                    <div className="tracking-timestamp">{formatDate(step.timestamp)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="profile-section-modern">
                <div className="section-header-modern">
                  <span className="section-icon">💳</span>
                  <h2>Payment Methods</h2>
                </div>
                {paymentMethods.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💳</div>
                    <h3>No Payment Methods</h3>
                    <p>Your saved payment methods will appear here!</p>
                  </div>
                ) : (
                  <ul className="payment-list-modern">
                    {paymentMethods.map((method, index) => (
                      <li key={index} className="payment-item-modern">
                        <strong>{method.type}</strong> {method.type === 'Razorpay' ? 'Razorpay Payment' : `ending in ****${method.lastFour}`}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="profile-section-modern">
                <div className="section-header-modern">
                  <span className="section-icon">❤️</span>
                  <h2>Wishlist</h2>
                </div>
                {wishlist.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">❤️</div>
                    <h3>Wishlist is Empty</h3>
                    <p>Add items to your wishlist to see them here!</p>
                  </div>
                ) : (
                  <div className="wishlist-list-modern">
                    {wishlist.map((item) => (
                      <div key={item._id} className="wishlist-item-modern" style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#faf7ff', borderRadius: 12, padding: '10px 16px', marginBottom: 10, boxShadow: '0 1px 6px rgba(120,120,200,0.06)' }}>
                        <img src={item.image} alt={item.title} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', background: '#fff' }} />
                        <span style={{ fontWeight: 500, fontSize: 16 }}>{item.title}</span>
                        <span style={{ fontWeight: 500, color: '#6b46c1', fontSize: 15 }}>₹{Number(item.price).toFixed(2)}</span>
                        <button
                          style={{
                            marginLeft: 18,
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '4px 10px',
                            fontWeight: 500,
                            fontSize: 13,
                            cursor: 'pointer',
                            marginRight: 8,
                            transition: 'background 0.18s',
                          }}
                          onClick={async () => {
                            try {
                              const cartItem = {
                                productId: item.productId,
                                name: item.title,
                                image: item.image,
                                price: Number(item.price),
                                quantity: 1,
                              };
                              console.log('cartItem sent to addToCart:', cartItem);
                              await addToCart(cartItem);
                              // Remove from wishlist (backend and UI)
                              await axios.post('http://localhost:5000/api/wishlist', {
                                userId: userId,
                                productId: item.productId,
                                title: item.title,
                                image: item.image,
                                price: Number(item.price),
                              });
                              setWishlist(wishlist => wishlist.filter(w => w._id !== item._id));
                              alert('Added to cart!');
                            } catch (err) {
                              alert('Failed to add to cart');
                            }
                          }}
                        >
                          Add to Cart
                        </button>
                        <button
                          style={{
                            background: '#ff6b81',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '4px 10px',
                            fontWeight: 500,
                            fontSize: 13,
                            cursor: 'pointer',
                            transition: 'background 0.18s',
                          }}
                          onClick={async () => {
                            try {
                              await axios.delete(`http://localhost:5000/api/wishlist/${item._id}`);
                              setWishlist(wishlist => wishlist.filter(w => w._id !== item._id));
                            } catch (err) {
                              alert('Failed to remove from wishlist');
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>No User Information</h3>
              <p>Please log in to view your profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
