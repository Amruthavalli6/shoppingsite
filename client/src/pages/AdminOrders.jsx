import React, { useEffect, useState } from 'react';
import AdminPanelLayout from './AdminPanelLayout';
import '../Dashboard.css';
import axios from 'axios';

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [actionMsg, setActionMsg] = useState('');
  const [trackingData, setTrackingData] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(() => {
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const openEditModal = (order) => {
    setEditId(order._id);
    setEditStatus(order.status || 'Pending');
  };

  const handleStatusChange = (e) => setEditStatus(e.target.value);

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/status/${editId}`, { status: editStatus });
      setActionMsg('Order status updated!');
      setEditId(null);
      fetchOrders();
    } catch (err) {
      setActionMsg('Error updating status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${deleteId}`);
      setActionMsg('Order deleted!');
      setDeleteId(null);
      fetchOrders();
    } catch (err) {
      setActionMsg('Error deleting order');
    }
  };

  // Helper to get user display (email or username)
  const getUserDisplay = (order) => {
    if (order.user && (order.user.email || order.user.username)) {
      return order.user.email || order.user.username;
    }
    // fallback: show userId (not ideal, but better than blank)
    return order.userId;
  };

  return (
    <AdminPanelLayout>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 900, margin: '36px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <h2 style={{ color: '#6b46c1', fontWeight: 600, margin: 0 }}>Orders Management</h2>
        </div>
        {actionMsg && <div style={{ textAlign: 'center', color: '#6b46c1', margin: '12px 0', width: '100%', maxWidth: 900 }}>{actionMsg}</div>}
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto 36px auto', background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(120,120,200,0.10)', padding: 24, overflowX: 'auto', position: 'relative', maxHeight: 420, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#888', fontSize: '1.2em' }}>Loading orders...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: '#d45d48', fontSize: '1.2em' }}>{error}</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead style={{ background: '#fff' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>User ID</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Tracking</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const tracking = trackingData[order._id];
                  return (
                    <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 12 }}>{order.userId}</td>
                      <td style={{ padding: 12 }}>₹{order.total}</td>
                      <td style={{ padding: 12 }}>{order.status}</td>
                      <td style={{ padding: 12 }}>
                        {tracking ? (
                          <div>
                            <div style={{ fontWeight: 500 }}>#{tracking.trackingNumber}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              {tracking.history.map((step, idx) => (
                                <div key={idx} style={{ fontSize: 12, color: order.status === step.status ? '#6b46c1' : '#888' }}>
                                  {step.status} <span style={{ fontSize: 11, marginLeft: 4 }}>{new Date(step.timestamp).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : '—'}
                      </td>
                      <td style={{ padding: 12 }}>
                        <button onClick={() => openEditModal(order)} style={{ marginRight: 0, marginBottom: 8, background: '#ece9fa', color: '#6b46c1', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500, display: 'block' }}>Edit</button>
                        <button onClick={() => setDeleteId(order._id)} style={{ background: '#ffe0e0', color: '#d45d48', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500, display: 'block' }}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {/* Edit Status Modal */}
        {editId && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(60,40,120,0.13)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(120,120,200,0.18)', padding: 32, minWidth: 320, maxWidth: 380, width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h3 style={{ color: '#6b46c1', margin: 0, fontWeight: 700 }}>Update Order Status</h3>
              <select value={editStatus} onChange={handleStatusChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
                {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setEditId(null)} style={{ background: '#eee', color: '#444', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer' }}>Cancel</button>
                <button type="button" onClick={handleStatusUpdate} style={{ background: 'linear-gradient(90deg, #6b46c1 30%, #bfaeeb 100%)', color: 'white', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer', fontWeight: 600 }}>Update</button>
              </div>
              {actionMsg && <div style={{ color: '#d45d48', marginTop: 8 }}>{actionMsg.includes('Error') ? actionMsg : ''}</div>}
            </div>
          </div>
        )}
        {/* Delete Confirmation */}
        {deleteId && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(60,40,120,0.13)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(120,120,200,0.18)', padding: 32, minWidth: 280, width: '100%', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
              <div style={{ fontWeight: 600, color: '#d45d48', fontSize: '1.1em' }}>Are you sure you want to delete this order?</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                <button onClick={() => setDeleteId(null)} style={{ background: '#eee', color: '#444', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleDelete} style={{ background: '#ffe0e0', color: '#d45d48', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              </div>
              {actionMsg && <div style={{ color: '#d45d48', marginTop: 8 }}>{actionMsg.includes('Error') ? actionMsg : ''}</div>}
            </div>
          </div>
        )}
      </div>
    </AdminPanelLayout>
  );
};

export default AdminOrders; 