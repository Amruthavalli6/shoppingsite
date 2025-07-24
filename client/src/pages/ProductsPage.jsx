// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import './ProductsPage.css';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProductsPage = () => {
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id || user?._id || null;

  const fetchWishlist = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
      setWishlist(res.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catFromUrl = decodeURIComponent(params.get('category') || 'All');
    setCategory(catFromUrl);

    const fetchProducts = async () => {
      try {
        let url = 'http://localhost:5000/api/products';
        if (catFromUrl && catFromUrl !== 'All') {
          url += `?category=${encodeURIComponent(catFromUrl)}`;
        }
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [location.search]);

  const sanitizePrice = (price) =>
    Number((price || '').toString().replace(/[^\d.]/g, '').replace(/,/g, ''));

  const formatPriceINR = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const filteredProducts = products.filter(product => {
    const title = (product.title || product.name || '').toLowerCase();
    const matchSearch = title.includes(searchTerm.toLowerCase());
    const price = sanitizePrice(product.price);
    const matchCategory =
      category === 'All' ||
      (Array.isArray(product.category) && product.category.some(cat =>
        cat.toLowerCase() === category.toLowerCase()
      ));
    return matchSearch && matchCategory && price > 300;
  });

  const isInWishlist = (productId) =>
    wishlist.some(item => item.productId === productId);

  const addToWishlist = async (product) => {
    if (!userId) {
      alert('Please login to add to wishlist');
      return;
    }
    try {
      const wishlistItem = {
        userId,
        productId: product._id || product.id,
        title: product.title,
        image: product.image,
        price: Number(product.price),
      };
      await axios.post('http://localhost:5000/api/wishlist', wishlistItem);
      fetchWishlist();
    } catch (error) {
      console.error('Add to wishlist failed:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!userId) return;
    try {
      const item = wishlist.find(w => w.productId === productId);
      if (!item) return;
      await axios.delete(`http://localhost:5000/api/wishlist/${item._id}`);
      fetchWishlist();
    } catch (error) {
      console.error('Remove from wishlist failed:', error);
    }
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id || product.id)) {
      removeFromWishlist(product._id || product.id);
    } else {
      addToWishlist(product);
    }
  };

  const addToCartHandler = async (product) => {
    if (!userId) {
      alert('Please login to add to cart');
      return;
    }
    const priceSanitized = sanitizePrice(product.price);
    const cartItem = {
      productId: product._id || product.id,
      name: product.title || product.name,
      image: product.image,
      price: priceSanitized,
    };
    await addToCart(cartItem);
    alert('Added to cart');
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    const query = cat === 'All' ? '' : `?category=${encodeURIComponent(cat)}`;
    navigate(`/products${query}`);
  };

  const categories = [
    'All', 'Men', 'Women', 'Accessories', 'Sale',
    'Summer', 'Best 2020', 'Flash Sale',
    'Summer Travel Collection', 'Awesome Best 2020',
    'Stylish Sneakers', 'Modern Headphones', 'Smartwatch',
  ];

  return (
    <div className="products-page">
      <header className="products-header">
        <div className="logo" onClick={() => navigate('/shop')}>🛍️ JollyBuy</div>
        <nav className="nav-links">
          <button onClick={() => navigate('/shop')}>Home</button>
          <button onClick={() => navigate('/cart')}>Cart</button>
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/');
            }}
          >Logout</button>
        </nav>
      </header>

      <h1 className="products-title">Our Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '0.5rem',
          fontSize: '1rem',
          width: '100%',
          maxWidth: '400px',
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      <div className="filter-buttons">
        {categories.map(cat => (
          <button
            key={cat}
            className={category === cat ? 'active' : ''}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id || product.id} className="product-card">
              <img
                src={product.image}
                alt={product.title || product.name}
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200';
                }}
              />
              <h3>{product.title || product.name}</h3>
              <p>{formatPriceINR(sanitizePrice(product.price))}</p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: 8 }}>
                <button
                  className="add-to-cart"
                  onClick={() => addToCartHandler(product)}
                >
                  Add to Cart
                </button>
                <button
                  className={`wishlist-btn ${isInWishlist(product._id || product.id) ? 'in-wishlist' : ''}`}
                  onClick={() => toggleWishlist(product)}
                >
                  {isInWishlist(product._id || product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          transition: 'background-color 0.3s ease',
        }}
        onClick={() => navigate('/cart')}
        onMouseEnter={e => (e.target.style.backgroundColor = '#0056b3')}
        onMouseLeave={e => (e.target.style.backgroundColor = '#007bff')}
      >
        Go to Cart
      </button>
    </div>
  );
};

export default ProductsPage;
