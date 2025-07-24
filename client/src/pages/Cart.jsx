import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, increaseQty, decreaseQty, removeItem } = useCart();
  const navigate = useNavigate();

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart-page">
      {/* Animated Background Elements */}
      <div className="cart-background">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>

      <div className="cart-container">
        {/* Header Section */}
        <div className="cart-header">
          <div className="cart-icon">🛒</div>
          <h1 className="cart-title">Your Shopping Cart</h1>
          {cartItems.length > 0 && (
            <div className="cart-summary">
              <span className="items-count">{getTotalItems()} Items</span>
              <span className="total-amount">₹{getTotal().toFixed(2)}</span>
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛍️</div>
            <h2>Your cart is empty!</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/shop')}
            >
              <span className="btn-icon">🛍️</span>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items Grid */}
            <div className="cart-grid">
              {cartItems.map(item => (
                <div key={item._id} className="cart-card">
                  <div className="card-image-container">
                    <img src={item.image} alt={item.name} className="cart-image" />
                    <div className="image-overlay">
                      <button 
                        className="remove-btn-overlay"
                        onClick={() => removeItem(item)}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="price-section">
                      <span className="item-price">₹{item.price}</span>
                      <span className="price-label">per item</span>
                    </div>
                    
                    <div className="qty-section">
                      <label className="qty-label">Quantity:</label>
                      <div className="qty-controls">
                        <button 
                          className="qty-btn decrease"
                          onClick={() => decreaseQty(item)}
                        >
                          −
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button 
                          className="qty-btn increase"
                          onClick={() => increaseQty(item)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="item-total">
                      <span className="total-label">Total:</span>
                      <span className="total-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item)}
                    >
                      <span className="remove-icon">🗑️</span>
                      Remove Item
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="cart-footer">
              <div className="footer-content">
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-row">
                    <span>Items ({getTotalItems()}):</span>
                    <span>₹{getTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span className="free-shipping">FREE 🚚</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total-row">
                    <span>Total Amount:</span>
                    <span>₹{getTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="checkout-section">
                  <button 
                    className="checkout-btn"
                    onClick={() => navigate('/checkout')}
                  >
                    <span className="checkout-icon">💳</span>
                    <span>Proceed to Checkout</span>
                    <span className="checkout-arrow">→</span>
                  </button>
                  
                  <button 
                    className="continue-shopping-link"
                    onClick={() => navigate('/shop')}
                  >
                    ← Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;