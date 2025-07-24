import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();

  const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));

  return (
    <div className="order-success-page">
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Thank you for shopping with us.</p>

      {lastOrder && (
        <div className="order-summary">
          <h3>Order Summary:</h3>
          <p><strong>Address:</strong> {lastOrder.address}</p>
          <p><strong>Payment:</strong> {lastOrder.paymentMethod}</p>
          <p><strong>Total:</strong> ${lastOrder.total.toFixed(2)}</p>
        </div>
      )}

      <button onClick={() => navigate('/shop')}>Continue Shopping</button>
    </div>
  );
};

export default OrderSuccess;
