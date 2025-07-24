import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ShoppingHome.css';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';
  return (
    <nav className="navbar">
      <h1 className="logo">JollyBuy</h1>
      <ul className="nav-links">
        {isAdmin ? (
          <>
            <li><a href="/admin">Dashboard</a></li>
            <li><button style={{background:'none',border:'none',color:'inherit',cursor:'pointer'}} onClick={() => {localStorage.removeItem('user'); window.location.href = '/';}}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/shop">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><button style={{background:'none',border:'none',color:'inherit',cursor:'pointer'}} onClick={() => {localStorage.removeItem('user'); window.location.href = '/';}}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

const HeroBanner = () => (
  <section className="hero-banner">
    <img
      src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
      alt="Hero Banner"
    />
  </section>
);

const CategorySection = () => (
  <section className="categories">
    <Link to="/products?category=Summer" className="category-link">
      <div className="category">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          alt="Summer Collection"
        />
        <p>Summer Collection</p>
      </div>
    </Link>

    <Link to="/products?category=Best%202020" className="category-link">
      <div className="category">
        <img
          src="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&q=80"
          alt="Best of 2020"
        />
        <p>Best of 2020</p>
      </div>
    </Link>

    <Link to="/products?category=Flash%20Sale" className="category-link">
      <div className="category">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"
          alt="Flash Sale"
        />
        <p>Flash Sale</p>
      </div>
    </Link>
  </section>
);

const TrendingSection = () => {
  const [trending, setTrending] = useState([]);
  const { addToCart } = useCart();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/trending");
        setTrending(res.data);
      } catch (error) {
        console.error("Error fetching trending items:", error);
      }
    };
    fetchTrending();
  }, []);

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  const handleAddToCart = async (product) => {
    if (!userId) {
      alert("Please log in to add to cart");
      return;
    }

    const cartItem = {
      _id: product._id,
      productId: product._id,
      name: product.title,
      price: parsePrice(product.price),
      image: product.image,
      quantity: 1,
      userId,
    };

    try {
      await addToCart(cartItem); // Uses CartContext to sync with backend
      alert("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  return (
    <section className="trending">
      <h2>🔥 Trending Items</h2>
      <div className="trending-items">
        {trending.length === 0 ? (
          <p>No trending products available.</p>
        ) : (
          trending.map((product) => (
            <div className="trending-item" key={product._id}>
              <div className="trending-badge">🔥 Trending</div>
              <img
                src={product.image}
                alt={product.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <div className="trending-info">
                <p className="trending-title">{product.title}</p>
                <p className="trending-price">₹{parsePrice(product.price).toFixed(2)}</p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

const ShoppingHome = () => (
  <div className="container">
    <Navbar />
    <HeroBanner />
    <CategorySection />
    <TrendingSection />
  </div>
);

export default ShoppingHome;
