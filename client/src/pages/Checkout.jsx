import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import styles from './Checkout.module.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shipping Address Form
  const [address, setAddress] = useState({
    recipient: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('simulated_card');

  // Order Calculations
  const tax = Math.round(cartSubtotal * 0.08 * 100) / 100;
  const shipping = cartSubtotal >= 150 ? 0 : 10;
  const grandTotal = Math.round((cartSubtotal + tax + shipping) * 100) / 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        items: cartItems.map(item => ({
          productId: item.product._id || item.product,
          variantSku: item.variantSku,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity
        })),
        shippingAddress: address
      };

      const res = await api.post('/orders/checkout', payload);
      
      // Success: Clear cart state and navigate
      await clearCart();
      navigate(`/order-success/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCheckout}>
        <h2>Your bag is empty</h2>
        <p>Add some eco-friendly kitchenware to your bag before checking out.</p>
        <Button onClick={() => navigate('/shop')} variant="primary" style={{ marginTop: '20px' }}>
          Go to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.pageTitle}>Secure Checkout</h1>

      <form onSubmit={handlePlaceOrder} className={styles.checkoutGrid}>
        {/* Left Side: Shipping Address & Payment */}
        <div className={styles.formSection}>
          <div className={styles.cardBlock}>
            <h3 className={styles.sectionTitle}>1. Shipping Details</h3>
            
            <div className={styles.inputRow}>
              <Input
                label="Recipient Full Name"
                name="recipient"
                value={address.recipient}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.inputRow}>
              <Input
                label="Street Address"
                name="street"
                value={address.street}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.grid2Col}>
              <Input
                label="City"
                name="city"
                value={address.city}
                onChange={handleInputChange}
                required
              />
              <Input
                label="State / Province"
                name="state"
                value={address.state}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.grid2Col}>
              <Input
                label="ZIP / Postal Code"
                name="zip"
                value={address.zip}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Country"
                name="country"
                value={address.country}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.cardBlock} style={{ marginTop: '24px' }}>
            <h3 className={styles.sectionTitle}>2. Payment Method</h3>
            <div className={styles.paymentSelector}>
              <label className={paymentMethod === 'simulated_card' ? styles.paymentOptionActive : styles.paymentOption}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'simulated_card'}
                  onChange={() => setPaymentMethod('simulated_card')}
                />
                <span className={styles.paymentLabel}>
                  <strong>Credit Card</strong> (Simulated instant payment)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className={styles.summarySection}>
          <div className={styles.cardBlock}>
            <h3 className={styles.sectionTitle}>Order Summary</h3>

            <div className={styles.itemsList}>
              {cartItems.map((item, idx) => (
                <div key={idx} className={styles.summaryItem}>
                  <img src={item.product.images?.[0] || 'https://via.placeholder.com/60'} alt={item.product.title} />
                  <div className={styles.itemDetails}>
                    <h4>{item.product.title}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className={styles.itemPrice}>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className={styles.divider} />

            <div className={styles.priceRow}>
              <span>Subtotal</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Estimated Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>

            <hr className={styles.divider} />

            <div className={styles.totalRow}>
              <span>Grand Total</span>
              <span className={styles.totalValue}>${grandTotal.toFixed(2)}</span>
            </div>

            {error && <div className={styles.errorAlert}>{error}</div>}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className={styles.placeOrderBtn}
            >
              Confirm and Pay
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
