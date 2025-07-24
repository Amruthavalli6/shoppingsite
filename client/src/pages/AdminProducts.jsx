import React, { useEffect, useState } from 'react';
import AdminPanelLayout from './AdminPanelLayout';
import '../Dashboard.css';
import axios from 'axios';

const initialForm = { title: '', price: '', image: '', category: '', isTrending: false };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [currentId, setCurrentId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionMsg, setActionMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setForm(initialForm);
    setEditMode(false);
    setModalOpen(true);
    setCurrentId(null);
  };

  const openEditModal = (product) => {
    setForm({
      title: product.title || '',
      price: product.price || '',
      image: product.image || '',
      category: Array.isArray(product.category) ? product.category.join(', ') : (product.category || ''),
      isTrending: !!product.isTrending,
    });
    setEditMode(true);
    setModalOpen(true);
    setCurrentId(product._id);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionMsg('');
      const payload = {
        ...form,
        price: Number(form.price),
        category: form.category.split(',').map(c => c.trim()),
      };
      if (editMode && currentId) {
        await axios.put(`http://localhost:5000/api/products/${currentId}`, payload);
        setActionMsg('Product updated!');
      } else {
        await axios.post('http://localhost:5000/api/products', payload);
        setActionMsg('Product added!');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      setActionMsg('Error saving product');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${deleteId}`);
      setActionMsg('Product deleted!');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      setActionMsg('Error deleting product');
    }
  };

  // Filter products by search term
  const filteredProducts = products.filter(product => {
    const title = (product.title || '').toLowerCase();
    const category = Array.isArray(product.category) ? product.category.join(', ').toLowerCase() : (product.category || '').toLowerCase();
    return title.includes(searchTerm.toLowerCase()) || category.includes(searchTerm.toLowerCase());
  });

  return (
    <AdminPanelLayout>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 900, margin: '36px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <h2 style={{ color: '#6b46c1', fontWeight: 600, margin: 0 }}>Products Management</h2>
          <button onClick={openAddModal} style={{ background: 'linear-gradient(90deg, #6b46c1 30%, #bfaeeb 100%)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500, fontSize: '1rem', padding: '10px 24px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(120,120,200,0.09)' }}>
            + Add Product
          </button>
        </div>
        <div style={{ width: '100%', maxWidth: 900, margin: '16px auto 0 auto' }}>
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: '1rem',
              marginBottom: 12
            }}
          />
        </div>
        {actionMsg && <div style={{ textAlign: 'center', color: '#6b46c1', margin: '12px 0', width: '100%', maxWidth: 900 }}>{actionMsg}</div>}
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto 36px auto', background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(120,120,200,0.10)', padding: 24, overflowX: 'auto', position: 'relative', maxHeight: 420, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#888', fontSize: '1.2em' }}>Loading products...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: '#d45d48', fontSize: '1.2em' }}>{error}</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead style={{ background: '#fff' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Image</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Title</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Price</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Trending</th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#888', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}><img src={product.image} alt={product.title} style={{ width: 60, borderRadius: 8 }} /></td>
                    <td style={{ padding: 12 }}>{product.title}</td>
                    <td style={{ padding: 12 }}>{Array.isArray(product.category) ? product.category.join(', ') : product.category}</td>
                    <td style={{ padding: 12 }}>₹{product.price}</td>
                    <td style={{ padding: 12 }}>{product.isTrending ? '🔥' : ''}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => openEditModal(product)} style={{ marginRight: 0, marginBottom: 8, background: '#ece9fa', color: '#6b46c1', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500, display: 'block' }}>Edit</button>
                      <button onClick={() => setDeleteId(product._id)} style={{ background: '#ffe0e0', color: '#d45d48', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500, display: 'block' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Modal for Add/Edit */}
        {modalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(60,40,120,0.13)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleFormSubmit} style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(120,120,200,0.18)', padding: 32, minWidth: 320, maxWidth: 380, width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h3 style={{ color: '#6b46c1', margin: 0, fontWeight: 700 }}>{editMode ? 'Edit Product' : 'Add Product'}</h3>
              <input name="title" value={form.title} onChange={handleFormChange} placeholder="Title" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="price" value={form.price} onChange={handleFormChange} placeholder="Price" type="number" min="0" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="image" value={form.image} onChange={handleFormChange} placeholder="Image URL" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category (comma separated)" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" name="isTrending" checked={form.isTrending} onChange={handleFormChange} /> Trending
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ background: '#eee', color: '#444', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: 'linear-gradient(90deg, #6b46c1 30%, #bfaeeb 100%)', color: 'white', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer', fontWeight: 600 }}>{editMode ? 'Update' : 'Add'}</button>
              </div>
              {actionMsg && <div style={{ color: '#d45d48', marginTop: 8 }}>{actionMsg.includes('Error') ? actionMsg : ''}</div>}
            </form>
          </div>
        )}
        {/* Delete Confirmation */}
        {deleteId && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(60,40,120,0.13)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(120,120,200,0.18)', padding: 32, minWidth: 280, width: '100%', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
              <div style={{ fontWeight: 600, color: '#d45d48', fontSize: '1.1em' }}>Are you sure you want to delete this product?</div>
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

export default AdminProducts; 