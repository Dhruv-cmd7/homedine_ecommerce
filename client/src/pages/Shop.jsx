import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/Button/Button';

export default function Shop() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [isBestseller, setIsBestseller] = useState(false);

  // Sync state with URL search parameters
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || 'newest');
    setIsBestseller(searchParams.get('isBestseller') === 'true');
  }, [searchParams]);

  const fetchFilters = async () => {
    try {
      const res = await api.get('/catalog/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err.message);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (isBestseller) params.isBestseller = true;
      params.sort = sort;

      const res = await api.get('/catalog/products', { params });
      setProducts(res.data.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, minPrice, maxPrice, sort, isBestseller]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setIsBestseller(false);
    setSearchParams({});
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600';
  };

  return (
    <div className="shop-layout">
      {/* Sidebar Filters */}
      <aside className="shop-sidebar">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>Filters</h3>
        
        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', marginBottom: '8px' }}>Search Product</label>
          <input
            type="text"
            placeholder="Type search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              padding: '0 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(28, 58, 47, 0.15)',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', marginBottom: '8px' }}>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(28, 58, 47, 0.15)',
              padding: '0 8px',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Price Limits */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', marginBottom: '8px' }}>Price Range</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 8px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(28, 58, 47, 0.15)',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem'
              }}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 8px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(28, 58, 47, 0.15)',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>

        <Button onClick={clearFilters} variant="secondary" style={{ width: '100%' }}>
          Reset Filters
        </Button>
      </aside>

      {/* Main Grid View */}
      <div>
        <div className="catalog-header">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Kitchenware Catalog</h2>
          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                height: '40px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(28, 58, 47, 0.15)',
                padding: '0 8px',
                outline: 'none',
                fontFamily: 'var(--font-sans)'
              }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-xl)',
            color: 'var(--color-text-muted)'
          }}>
            No products found matching these filters.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {products.map(prod => (
              <div
                key={prod._id}
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-low)',
                  transition: 'transform var(--transition-smooth), box-shadow var(--transition-smooth)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '260px', overflow: 'hidden', backgroundColor: 'rgba(28, 58, 47, 0.03)', position: 'relative' }}>
                  {prod.images && prod.images.length > 0 ? (
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={handleImageError}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                      No Image Available
                    </div>
                  )}
                  {prod.isBestseller && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'var(--color-accent-600)',
                      color: '#ffffff',
                      fontSize: '0.6875rem',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontWeight: '600'
                    }}>
                      Bestseller
                    </span>
                  )}
                </div>

                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {prod.brand?.name || 'Sustainable'}
                    </span>
                    <h4 style={{ fontSize: '1.0625rem', marginTop: '4px', marginBottom: '8px', color: 'var(--color-primary-900)' }}>
                      {prod.title}
                    </h4>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-primary-800)' }}>
                        ${prod.price}
                      </span>
                      {prod.rating && (
                        <span style={{ fontSize: '0.8125rem', color: 'var(--color-accent-600)', fontWeight: '600' }}>
                          ★ {prod.rating.average}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      style={{ width: '100%', height: '38px', borderRadius: 'var(--radius-md)' }}
                      onClick={() => addToCart(prod, prod.variants?.[0]?.variantSku || prod.sku, 1)}
                    >
                      + Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
