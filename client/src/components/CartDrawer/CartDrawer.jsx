import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../Button/Button';
import styles from './CartDrawer.module.css';

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className={styles.drawerBackdrop} onClick={onClose}>
      <div className={styles.drawerPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <h2>Your Bag</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.drawerContent}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCartState}>
              <p>Your bag is empty.</p>
              <Button onClick={onClose} variant="secondary" style={{ marginTop: '20px' }}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className={styles.cartItemsList}>
              {cartItems.map((item, idx) => {
                const prod = item.product;
                const pId = prod?._id || item.product;
                if (!prod) return null;

                return (
                  <div key={`${pId}-${item.variantSku}-${idx}`} className={styles.cartItemCard}>
                    <div className={styles.itemImage}>
                      <img src={prod.images?.[0] || 'https://via.placeholder.com/80'} alt={prod.title} />
                    </div>
                    <div className={styles.itemDetails}>
                      <h4>{prod.title}</h4>
                      <p className={styles.itemVariant}>Variant: {item.variantSku.split('-').pop()}</p>
                      
                      <div className={styles.itemControls}>
                        <div className={styles.quantityWidget}>
                          <button
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(pId, item.variantSku, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(pId, item.variantSku, item.quantity + 1)}>
                            +
                          </button>
                        </div>

                        <button
                          className={styles.deleteBtn}
                          onClick={() => removeFromCart(pId, item.variantSku)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className={styles.itemPrice}>
                      ${(prod.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span className={styles.subtotalValue}>${cartSubtotal.toFixed(2)}</span>
            </div>
            <p className={styles.footerNote}>Shipping and taxes calculated at checkout.</p>
            <Button
              variant="primary"
              style={{ width: '100%', height: '50px' }}
              onClick={() => {
                navigate('/checkout');
                onClose();
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
