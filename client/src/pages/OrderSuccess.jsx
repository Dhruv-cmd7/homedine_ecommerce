import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button/Button';
import styles from './OrderSuccess.module.css';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error('Failed to load order details:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.errorState}>
        <h2>Order Not Found</h2>
        <p>We couldn't retrieve the details for this transaction.</p>
        <Button onClick={() => navigate('/')} variant="primary" style={{ marginTop: '20px' }}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        <div className={styles.iconCircle}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 className={styles.title}>Thank you!</h1>
        <p className={styles.subtitle}>Your order has been received and processed.</p>

        <div className={styles.infoBlock}>
          <div className={styles.infoRow}>
            <span>Order Number:</span>
            <strong>{order.orderNumber}</strong>
          </div>
          <div className={styles.infoRow}>
            <span>Total Paid:</span>
            <strong className={styles.totalValue}>${order.totals.grandTotal.toFixed(2)}</strong>
          </div>
          <div className={styles.infoRow}>
            <span>Deliver to:</span>
            <span>{order.shippingAddress.recipient}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Address:</span>
            <span>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={() => navigate('/shop')} variant="primary" style={{ width: '100%' }}>
            Continue Shopping
          </Button>
          <Button onClick={() => navigate('/')} variant="secondary" style={{ width: '100%', marginTop: '12px' }}>
            Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
