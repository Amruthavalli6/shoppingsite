import React from 'react';
import '../Dashboard.css';
import { Link, NavLink } from 'react-router-dom';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Products', href: '/admin/products', icon: '🛍️' },
  { label: 'Orders', href: '/admin/orders', icon: '📦' },
  { label: 'Users', href: '/admin/users', icon: '👤' },
];

const AdminPanelLayout = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="dashboard">
      <header className="header">
        <Link to="/admin" className="admin-logo-link" style={{ textDecoration: 'none' }}>
          <div className="logo" style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Admin Panel</div>
        </Link>
        <nav className="nav-links">
          <span>Welcome, {admin?.username || 'Admin'}</span>
          <button className="logout-btn" style={{ color: '#d45d48', fontWeight: 600, marginLeft: 18, transition: 'color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = '#a82c2c'}
            onMouseOut={e => e.currentTarget.style.color = '#d45d48'}
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/';
            }}>
            Logout
          </button>
        </nav>
      </header>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: 220, background: '#f7f7fa', padding: 32, borderRight: '1.5px solid #eee', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {sidebarLinks.map(link => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' active' : '')
              }
              end={link.href === '/admin'}
            >
              <span style={{ fontSize: '1.3em', marginRight: 8 }}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </aside>
        <main className="main-content" style={{
          flex: 1,
          padding: 0,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'stretch',
          width: '100%',
          height: '100%'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminPanelLayout; 