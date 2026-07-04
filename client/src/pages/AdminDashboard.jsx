import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Button from '../components/Button/Button';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/orders/admin/analytics');
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch admin analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading Homedine Dashboard Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <h2>Unauthorized or Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const { kpi, recentOrders, lowStockProducts, topSellingProducts } = data;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Welcome back. Here is the operational performance of Homedine storefront.</p>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Refresh Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Total Sales</span>
            <span className={styles.kpiValue}>${kpi.totalSales.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Orders Placed</span>
            <span className={styles.kpiValue}>{kpi.totalOrders}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Total Products</span>
            <span className={styles.kpiValue}>{kpi.totalProducts}</span>
          </div>
        </div>

        <div className={`${styles.kpiCard} ${kpi.lowStockCount > 0 ? styles.kpiWarning : ''}`}>
          <div className={styles.kpiIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: kpi.lowStockCount > 0 ? 'var(--color-accent-600)' : 'var(--color-primary-900)' }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Low Stock Alerts</span>
            <span className={styles.kpiValue}>{kpi.lowStockCount}</span>
          </div>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Left Side - Tables */}
        <div className={styles.tablesSection}>
          {/* Recent Orders */}
          <div className={styles.dashboardCard}>
            <h3 className={styles.cardTitle}>Recent Operations Transactions</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Fulfillment</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.emptyRow}>No orders placed yet.</td>
                    </tr>
                  ) : (
                    recentOrders.map(order => (
                      <tr key={order._id}>
                        <td className={styles.boldText}>{order.orderNumber}</td>
                        <td>{order.customerName}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className={styles.amountText}>${order.grandTotal.toFixed(2)}</td>
                        <td>
                          <span className={`${styles.badge} ${styles[order.fulfillmentStatus]}`}>
                            {order.fulfillmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className={styles.dashboardCard} style={{ marginTop: '32px' }}>
            <h3 className={styles.cardTitle}>Inventory Adjustments Required</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Variant Options</th>
                    <th>Current Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.emptyRow}>All items are adequately stocked.</td>
                    </tr>
                  ) : (
                    lowStockProducts.map(prod => (
                      <tr key={prod.productId}>
                        <td className={styles.boldText}>{prod.title}</td>
                        <td>{prod.sku}</td>
                        <td>
                          {prod.variants.map((v, i) => (
                            <div key={i} className={styles.variantDetail}>
                              {v.colorName || 'Default'} - {v.size || 'N/A'} (SKU: {v.variantSku})
                            </div>
                          ))}
                        </td>
                        <td>
                          {prod.variants.map((v, i) => (
                            <div key={i} className={styles.stockCount}>
                              <span className={v.stock < 10 ? styles.lowStockCountBadge : ''}>
                                {v.stock} units
                              </span>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side - Top Selling & Analytics */}
        <div className={styles.analyticsSidebar}>
          {/* Top Selling Products */}
          <div className={styles.dashboardCard}>
            <h3 className={styles.cardTitle}>Top Selling Cookware</h3>
            <div className={styles.topSellingList}>
              {topSellingProducts.length === 0 ? (
                <div className={styles.emptyRow} style={{ padding: '16px 0' }}>No sales data.</div>
              ) : (
                topSellingProducts.map((prod, idx) => (
                  <div key={idx} className={styles.topProductCard}>
                    <div className={styles.topRank}>{idx + 1}</div>
                    <div className={styles.topDetails}>
                      <h4>{prod.title}</h4>
                      <p>{prod.salesCount} units sold</p>
                    </div>
                    <div className={styles.topRevenue}>
                      ${prod.revenue.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className={styles.dashboardCard} style={{ marginTop: '32px' }}>
            <h3 className={styles.cardTitle}>Operational Controls</h3>
            <div className={styles.quickActions}>
              <Button variant="primary" style={{ width: '100%' }} onClick={() => alert('Add Product feature is coming in Milestone 6.')}>
                + Add Product
              </Button>
              <Button variant="secondary" style={{ width: '100%', marginTop: '12px' }} onClick={() => alert('Coupon codes system coming in Milestone 6.')}>
                Manage Coupon Rules
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
