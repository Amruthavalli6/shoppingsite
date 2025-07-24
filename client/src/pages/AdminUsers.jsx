import React, { useEffect, useState } from 'react';
import AdminPanelLayout from './AdminPanelLayout';
import '../Dashboard.css';
import axios from 'axios';

const roleOptions = ['user', 'admin'];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState('user');
  const [deleteId, setDeleteId] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openEditModal = (user) => {
    setEditId(user._id);
    setEditRole(user.role || 'user');
  };

  const handleRoleChange = (e) => setEditRole(e.target.value);

  const handleRoleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${editId}`, { role: editRole });
      setActionMsg('User role updated!');
      setEditId(null);
      fetchUsers();
    } catch (err) {
      setActionMsg('Error updating role');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${deleteId}`);
      setActionMsg('User deleted!');
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      setActionMsg('Error deleting user');
    }
  };

  return (
    <AdminPanelLayout>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 900, margin: '36px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <h2 style={{ color: '#6b46c1', fontWeight: 600, margin: 0 }}>Users Management</h2>
        </div>
        {actionMsg && <div style={{ textAlign: 'center', color: '#6b46c1', margin: '12px 0', width: '100%', maxWidth: 900 }}>{actionMsg}</div>}
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto 36px auto', background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(120,120,200,0.10)', padding: 24, overflowX: 'auto', position: 'relative', maxHeight: 420, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#888', fontSize: '1.2em' }}>Loading users...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: '#d45d48', fontSize: '1.2em' }}>{error}</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead style={{ background: '#fff' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Username</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}>{user.username}</td>
                    <td style={{ padding: 12 }}>{user.email}</td>
                    <td style={{ padding: 12 }}>{user.role}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => openEditModal(user)} style={{ marginRight: 0, marginBottom: 8, background: '#ece9fa', color: '#6b46c1', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500, display: 'block' }}>Edit</button>
                      <button onClick={() => setDeleteId(user._id)} style={{ background: '#ffe0e0', color: '#d45d48', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500, display: 'block' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Edit Role Modal */}
        {editId && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(60,40,120,0.13)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(120,120,200,0.18)', padding: 32, minWidth: 320, maxWidth: 380, width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h3 style={{ color: '#6b46c1', margin: 0, fontWeight: 700 }}>Update User Role</h3>
              <select value={editRole} onChange={handleRoleChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
                {roleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setEditId(null)} style={{ background: '#eee', color: '#444', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer' }}>Cancel</button>
                <button type="button" onClick={handleRoleUpdate} style={{ background: 'linear-gradient(90deg, #6b46c1 30%, #bfaeeb 100%)', color: 'white', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer', fontWeight: 600 }}>Update</button>
              </div>
              {actionMsg && <div style={{ color: '#d45d48', marginTop: 8 }}>{actionMsg.includes('Error') ? actionMsg : ''}</div>}
            </div>
          </div>
        )}
        {/* Delete Confirmation */}
        {deleteId && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(60,40,120,0.13)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(120,120,200,0.18)', padding: 32, minWidth: 280, width: '100%', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
              <div style={{ fontWeight: 600, color: '#d45d48', fontSize: '1.1em' }}>Are you sure you want to delete this user?</div>
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

export default AdminUsers; 