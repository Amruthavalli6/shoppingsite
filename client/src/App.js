import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import LoginSignup from "./pages/LoginSignup";
import Home from "./pages/Home";
import ShoppingHome from "./pages/ShoppingHome";
import ProductsPage from "./pages/ProductsPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      const user = storedUser && JSON.parse(storedUser);
      setIsAuthenticated(user && user.id ? true : false);
    } catch (e) {
      console.error("Invalid user data in localStorage");
      setIsAuthenticated(false);
    }
  }, [location]);

  // Get user role for route protection
  const storedUser = localStorage.getItem("user");
  let user = null;
  try { user = storedUser && JSON.parse(storedUser); } catch { user = null; }
  const role = user?.role;

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/shop" replace />) : <LoginSignup />
        }
      />

      {/* Protected User Routes */}
      <Route
        path="/shop"
        element={
          isAuthenticated && role === 'user' ? <ShoppingHome /> :
          isAuthenticated && role === 'admin' ? <Navigate to="/admin" replace /> :
          <Navigate to="/" replace />
        }
      />
      <Route
        path="/products"
        element={
          isAuthenticated && role === 'user' ? <ProductsPage /> :
          isAuthenticated && role === 'admin' ? <Navigate to="/admin" replace /> :
          <Navigate to="/" replace />
        }
      />
      <Route
        path="/cart"
        element={
          isAuthenticated && role === 'user' ? <Cart /> :
          isAuthenticated && role === 'admin' ? <Navigate to="/admin" replace /> :
          <Navigate to="/" replace />
        }
      />
      <Route
        path="/checkout"
        element={
          isAuthenticated && role === 'user' ? <Checkout /> :
          isAuthenticated && role === 'admin' ? <Navigate to="/admin" replace /> :
          <Navigate to="/" replace />
        }
      />
      <Route
        path="/order-success"
        element={
          isAuthenticated && role === 'user' ? <OrderSuccess /> :
          isAuthenticated && role === 'admin' ? <Navigate to="/admin" replace /> :
          <Navigate to="/" replace />
        }
      />
      <Route
        path="/profile"
        element={
          isAuthenticated && role === 'user' ? <Profile /> :
          isAuthenticated && role === 'admin' ? <Navigate to="/admin" replace /> :
          <Navigate to="/" replace />
        }
      />

      {/* Admin Route */}
      <Route
        path="/admin"
        element={(() => {
          if (!isAuthenticated) return <Navigate to="/" replace />;
          if (role !== 'admin') return <Navigate to="/shop" replace />;
          return <AdminDashboard />;
        })()}
      />

      {/* Admin Products Route */}
      <Route
        path="/admin/products"
        element={(() => {
          if (!isAuthenticated) return <Navigate to="/" replace />;
          if (role !== 'admin') return <Navigate to="/shop" replace />;
          return <AdminProducts />;
        })()}
      />

      {/* Admin Orders Route */}
      <Route
        path="/admin/orders"
        element={(() => {
          if (!isAuthenticated) return <Navigate to="/" replace />;
          if (role !== 'admin') return <Navigate to="/shop" replace />;
          return <AdminOrders />;
        })()}
      />

      {/* Admin Users Route */}
      <Route
        path="/admin/users"
        element={(() => {
          if (!isAuthenticated) return <Navigate to="/" replace />;
          if (role !== 'admin') return <Navigate to="/shop" replace />;
          return <AdminUsers />;
        })()}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
