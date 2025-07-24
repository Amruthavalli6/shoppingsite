import React, { useEffect, useState } from 'react';
import AdminPanelLayout from './AdminPanelLayout';
import '../Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, sales: 0, trending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, ordersRes, salesRes, trendingRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/count').then(r => r.json()),
          fetch('http://localhost:5000/api/orders/count').then(r => r.json()),
          fetch('http://localhost:5000/api/orders/total-sales').then(r => r.json()),
          fetch('http://localhost:5000/api/products/trending').then(r => r.json()),
        ]);
        setStats({
          users: usersRes.count,
          orders: ordersRes.count,
          sales: salesRes.totalSales,
          trending: trendingRes.length,
        });
        console.log('Admin stats:', {
          users: usersRes.count,
          orders: ordersRes.count,
          sales: salesRes.totalSales,
          trending: trendingRes.length,
        });
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminPanelLayout>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="admin-welcome-box" style={{ maxWidth: 720, width: '100%', marginBottom: 48 }}>
          <h2 className="admin-welcome-title">Welcome to the ShopVerse Admin Dashboard</h2>
          <p className="admin-welcome-desc">
            <br/>
          </p>
        </div>
        <div className="admin-stats-grid" style={{ marginTop: 24, marginBottom: 48 }}>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">👥</span>
            <div className="admin-stat-value">{typeof stats.users === 'number' && !isNaN(stats.users) ? stats.users : 0}</div>
            <div className="admin-stat-label">Total Users</div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">🛒</span>
            <div className="admin-stat-value">{typeof stats.orders === 'number' && !isNaN(stats.orders) ? stats.orders : 0}</div>
            <div className="admin-stat-label">Total Orders</div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">💰</span>
            <div className="admin-stat-value">₹{Number(stats.sales || 0).toLocaleString('en-IN')}</div>
            <div className="admin-stat-label">Total Sales</div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">🔥</span>
            <div className="admin-stat-value">{typeof stats.trending === 'number' && !isNaN(stats.trending) ? stats.trending : 0}</div>
            <div className="admin-stat-label">Trending Products</div>
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default AdminDashboard; 