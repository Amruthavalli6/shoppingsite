import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const [shipping, setShipping] = useState({
    name: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePlaceOrder = async (paymentResult = null) => {
    // Validate shipping fields
    if (!shipping.name.trim() || !shipping.phone.trim() || !shipping.address1.trim() || !shipping.city.trim() || !shipping.state.trim() || !shipping.zip.trim() || !shipping.country.trim()) {
      alert('Please fill in all required shipping address fields.');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    if (!user || !user.id || !token) {
      alert('You must be logged in to place an order.');
      return;
    }

    setIsProcessing(true);

    try {
      const order = {
        userId: user.id,
        address: `${shipping.name}, ${shipping.phone}, ${shipping.address1}, ${shipping.address2}, ${shipping.city}, ${shipping.state}, ${shipping.zip}, ${shipping.country}`,
        paymentMethod,
        paymentDetails: paymentMethod === 'Razorpay' ? paymentResult : {},
        items: cartItems,
        total: totalPrice,
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post('http://localhost:5000/api/orders', order, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        // Save payment method to backend
        await axios.post(
          'http://localhost:5000/api/payments',
          {
            userId: user.id,
            type: paymentMethod,
            paymentDetails: paymentMethod === 'Razorpay' ? paymentResult : {},
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await clearCart();
        localStorage.setItem('lastOrder', JSON.stringify(order));
        localStorage.setItem('profileNeedsRefresh', 'true');
        navigate('/order-success');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('An error occurred while placing the order.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      // Create order on backend
      const response = await axios.post('http://localhost:5000/api/paypal/create-order', {
        amount: totalPrice
      });

      const options = {
        key: 'rzp_test_v53ep4zGGob7in', // Your actual Razorpay test key
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'JollyBuy',
        description: 'E-commerce purchase',
        order_id: response.data.orderID,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post('http://localhost:5000/api/paypal/capture-payment', {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              await handlePlaceOrder({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                status: 'completed'
              });
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: shipping.name,
          contact: shipping.phone
        },
        theme: {
          color: '#6b46c1'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      alert('Failed to create payment order. Please try again.');
    }
  };

  return (
    <div className="checkout-outer">
      <div className="checkout-container">
        <div className="checkout-page">
          <div className="checkout-header">
            <h1>Checkout</h1>
            <div className="progress-bar">
              <div className="progress-step active">
                <div className="step-number">1</div>
                <span>Cart</span>
              </div>
              <div className="progress-line active"></div>
              <div className="progress-step active">
                <div className="step-number">2</div>
                <span>Checkout</span>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className="step-number">3</div>
                <span>Confirmation</span>
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Please add items before checking out.</p>
            </div>
          ) : (
            <div className="checkout-content">
              <div className="checkout-main">
                <div className="section">
                  <div className="section-header">
                    <h2>📍 Shipping Address</h2>
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Full Name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} required />
                    <input type="tel" placeholder="Phone Number" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} required />
                    <input type="text" placeholder="Address Line 1" value={shipping.address1} onChange={e => setShipping({ ...shipping, address1: e.target.value })} required />
                    <input type="text" placeholder="Address Line 2" value={shipping.address2} onChange={e => setShipping({ ...shipping, address2: e.target.value })} />
                    <input type="text" placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} required />
                    <input type="text" placeholder="State" value={shipping.state} onChange={e => setShipping({ ...shipping, state: e.target.value })} required />
                    <input type="text" placeholder="ZIP/Postal Code" value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })} required />
                    <input type="text" placeholder="Country" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })} required />
                  </div>
                </div>

                <div className="section">
                  <div className="section-header">
                    <h2>💳 Payment Method</h2>
                  </div>
                  <div className="payment-options">
                    {['Cash On Delivery', 'Razorpay'].map((method) => (
                      <label key={method} className="payment-option">
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={e => setPaymentMethod(e.target.value)}
                        />
                        <div className="payment-option-content">
                          <div className="payment-icon">
                            {method === 'Cash On Delivery' && '💵'}
                            {method === 'Razorpay' && '💳'}
                          </div>
                          <span>{method}</span>
                        </div>
                        <div className="radio-checkmark"></div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'Razorpay' && (
                    <div className="form-group razorpay-details">
                      <button 
                        className="razorpay-button"
                        onClick={handleRazorpayPayment}
                        disabled={!shipping.name.trim() || !shipping.phone.trim()}
                      >
                        💳 Pay with Razorpay - ₹{totalPrice.toFixed(2)}
                      </button>
                      <p className="payment-note">
                        💳 Secure payment powered by Razorpay
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="checkout-sidebar">
                <div className="order-summary">
                  <div className="section-header">
                    <h2>📋 Order Summary</h2>
                  </div>

                  <div className="order-items">
                    {cartItems.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <span className="item-quantity">Qty: {item.quantity || 1}</span>
                        </div>
                        <div className="item-price">
                          ₹{(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-total-section">
                    <div className="subtotal">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="shipping">
                      <span>Shipping</span>
                      <span className="free">Free</span>
                    </div>
                    <div className="order-total">
                      <span>Total</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    className="place-order-btn"
                    onClick={() => handlePlaceOrder()}
                    disabled={
                      isProcessing ||
                      !shipping.name.trim() ||
                      !shipping.phone.trim() ||
                      !shipping.address1.trim() ||
                      !shipping.city.trim() ||
                      !shipping.state.trim() ||
                      !shipping.zip.trim() ||
                      !shipping.country.trim()
                    }
                  >
                    <span className="btn-icon">
                      {isProcessing ? '⏳' : '🚀'}
                    </span>
                    {isProcessing ? 'Processing...' : 'Place Order'}
                    <span className="btn-amount">₹{totalPrice.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
