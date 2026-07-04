import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import CartDrawer from './components/CartDrawer/CartDrawer';

import AdminDashboard from './pages/AdminDashboard';

const NotFound = () => (
  <div style={{ padding: '80px 24px', textAlign: 'center' }}>
    <h2>Page not found (404)</h2>
  </div>
);

function Navigation({ onOpenCart }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <header style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      borderBottom: '1px solid rgba(28, 58, 47, 0.08)',
      backgroundColor: 'rgba(250, 249, 246, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.85rem',
          fontWeight: 'bold',
          letterSpacing: '-0.02em',
          fontStyle: 'italic'
        }}>
          <Link to="/" style={{ color: 'var(--color-primary-900)', textDecoration: 'none' }}>Homedine</Link>
        </div>
        <nav style={{ display: 'flex', gap: '32px' }}>
          <Link to="/shop" style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.9375rem' }}>Shop</Link>
          <Link to="/shop?sort=rating" style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.9375rem' }}>Bestsellers</Link>
          <Link to="/shop?isFeatured=true" style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.9375rem' }}>Gallery</Link>
        </nav>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search Product..."
          style={{
            height: '38px',
            width: '200px',
            padding: '0 16px',
            borderRadius: '20px',
            border: '1px solid rgba(28, 58, 47, 0.12)',
            outline: 'none',
            fontSize: '0.8125rem'
          }}
        />

        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontWeight: '500' }}>Admin</Link>
            )}
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Hi, {user.firstName}
            </span>
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent-600)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: '500'
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" style={{
            color: 'var(--color-primary-800)',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Sign In
          </Link>
        )}
        
        <button
          onClick={onOpenCart}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary-800)',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary-900)' }}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              backgroundColor: 'var(--color-accent-600)',
              color: '#ffffff',
              fontSize: '0.6875rem',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600'
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function MainRoutes() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navigation onOpenCart={() => setCartOpen(true)} />
      <main style={{ minHeight: 'calc(100vh - 420px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <footer style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderTop: '1px solid rgba(28, 58, 47, 0.08)',
        padding: '60px 40px 30px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '80px', marginBottom: '60px' }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.5rem',
              fontWeight: '400',
              lineHeight: '1.4',
              color: 'var(--color-primary-900)',
              marginBottom: '24px',
              maxWidth: '540px'
            }}>
              Homedine promotes sustainable dining with beautifully crafted bamboo and glass <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>✧Kitchenware!</span>
            </h3>
            <button style={{
              height: '40px',
              padding: '0 20px',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-primary-800)',
              color: 'var(--color-primary-800)',
              borderRadius: '20px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Join Us Now ↗
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/shop?category=drinkware" style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.9375rem' }}>Drinkware</Link>
            <Link to="/shop?category=tableware" style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.9375rem' }}>Tableware</Link>
            <Link to="/shop?category=utensils" style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.9375rem' }}>Utensils</Link>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid rgba(28, 58, 47, 0.08)',
          paddingTop: '20px'
        }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '5rem',
            fontWeight: 'bold',
            color: '#d2dcd3',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            fontStyle: 'italic'
          }}>
            Homedine
          </div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '0.875rem' }}>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Twitter ↗</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Instagram ↗</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>LinkedIn ↗</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
