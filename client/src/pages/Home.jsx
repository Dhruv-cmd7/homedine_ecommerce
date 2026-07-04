import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/Button/Button';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [bestsellers, setBestsellers] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Fetch products flagged as bestsellers from API catalog
    const fetchBestsellers = async () => {
      try {
        const res = await api.get('/catalog/products', { params: { isBestseller: true, limit: 4 } });
        setBestsellers(res.data.data.products || []);
      } catch (err) {
        console.error('Error fetching bestsellers:', err.message);
      }
    };
    fetchBestsellers();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className={styles.homeContainer}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContentLeft}>
            <h1 className={styles.heroTitle}>
              Eco-Friendly <br />
              <span className={styles.heroTitleItalic}>Kitchenware</span> for <br />
              a greener home
            </h1>
            <p className={styles.heroSubtitle}>
              The eco-friendly kitchenware niche with a sense of urgency, much like the original banner.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/shop')}
              className={styles.heroCta}
              style={{ backgroundColor: '#ffffff', color: '#1c3a2f', borderRadius: '24px' }}
            >
              Shop now &nbsp; ➔
            </Button>
          </div>

          <div className={styles.heroGlassCard}>
            <p className={styles.glassCardSub}>Natural. Sustainable. Eco-conscious.</p>
            <div className={styles.glassCardPercent}>
              <span>96%</span>
              <svg className={styles.glassLeafIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 3.58 8 8 8h2v-2c0-2.21 1.79-4 4-4h2c2.21 0 4-1.79 4-4 0-5.52-4.48-10-10-10z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BESTSELLING PRODUCTS SECTION */}
      <section className={styles.sectionPadding}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionPre}>Eco Essentials Planet-Friendly</p>
            <h2 className={styles.sectionTitle}>Bestselling ✧ Products</h2>
          </div>
          <Link to="/shop" className={styles.moreProductsLink}>More products ➔</Link>
        </div>

        <div className={styles.productSlider}>
          {bestsellers.length > 0 ? (
            bestsellers.map((prod) => (
              <div key={prod._id} className={styles.productCard}>
                <div className={styles.cardImageContainer}>
                  {prod.isBestseller && (
                    <span className={styles.cardBadge}>Customer favorite</span>
                  )}
                  <img src={prod.images?.[0] || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600'} alt={prod.title} />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.colorSwatches}>
                    <span className={styles.swatch} style={{ backgroundColor: '#8ca18f' }}></span>
                    <span className={styles.swatch} style={{ backgroundColor: '#d58d60' }}></span>
                    <span className={styles.swatch} style={{ backgroundColor: '#faf9f6' }}></span>
                  </div>
                  <h3 className={styles.cardTitle}>{prod.title}</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>${prod.price}</span>
                    <Button
                      variant="primary"
                      className={styles.cardCartBtn}
                      onClick={() => addToCart(prod, prod.variants?.[0]?.variantSku || prod.sku, 1)}
                    >
                      + Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Static Fallback Cards to match design exactly if DB is unseeded
            <>
              <div className={styles.productCard}>
                <div className={styles.cardImageContainer}>
                  <span className={styles.cardBadge}>Promotion</span>
                  <img src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600" alt="Drinkware" />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.colorSwatches}>
                    <span className={styles.swatch} style={{ backgroundColor: '#8ca18f' }}></span>
                    <span className={styles.swatch} style={{ backgroundColor: '#698572' }}></span>
                  </div>
                  <h3 className={styles.cardTitle}>Reusable drinkware for a greener lifestyle.</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>$43.85</span>
                    <Button
                      variant="primary"
                      className={styles.cardCartBtn}
                      onClick={() => addToCart({
                        _id: 'static-drinkware',
                        title: 'Reusable drinkware',
                        price: 43.85,
                        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600']
                      }, 'static-drinkware-sk', 1)}
                    >
                      + Cart
                    </Button>
                  </div>
                </div>
              </div>

              <div className={styles.productCard}>
                <div className={styles.cardImageContainer}>
                  <span className={styles.cardBadge}>New</span>
                  <img src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600" alt="Cookware" />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.colorSwatches}>
                    <span className={styles.swatch} style={{ backgroundColor: '#d58d60' }}></span>
                    <span className={styles.swatch} style={{ backgroundColor: '#8ca18f' }}></span>
                  </div>
                  <h3 className={styles.cardTitle}>Non-toxic cookware for sustainable cooking.</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>$78.35</span>
                    <Button
                      variant="primary"
                      className={styles.cardCartBtn}
                      onClick={() => addToCart({
                        _id: 'static-cookware',
                        title: 'Non-toxic cookware',
                        price: 78.35,
                        images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600']
                      }, 'static-cookware-sk', 1)}
                    >
                      + Cart
                    </Button>
                  </div>
                </div>
              </div>

              <div className={styles.productCard}>
                <div className={styles.cardImageContainer}>
                  <span className={styles.cardBadge}>Customer favorite</span>
                  <img src="https://images.unsplash.com/photo-1578643463396-0997cb5328c1?q=80&w=600" alt="Kettle" />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.colorSwatches}>
                    <span className={styles.swatch} style={{ backgroundColor: '#b4c3b2' }}></span>
                  </div>
                  <h3 className={styles.cardTitle}>Kettle & Toaster eco-friendly meals.</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>$143.65</span>
                    <Button
                      variant="primary"
                      className={styles.cardCartBtn}
                      onClick={() => addToCart({
                        _id: 'static-kettle',
                        title: 'Kettle & Toaster',
                        price: 143.65,
                        images: ['https://images.unsplash.com/photo-1578643463396-0997cb5328c1?q=80&w=600']
                      }, 'static-kettle-sk', 1)}
                    >
                      + Cart
                    </Button>
                  </div>
                </div>
              </div>

              <div className={styles.productCard}>
                <div className={styles.cardImageContainer}>
                  <span className={styles.cardBadge}>New</span>
                  <img src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600" alt="Utensils" />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.colorSwatches}>
                    <span className={styles.swatch} style={{ backgroundColor: '#e2ccb3' }}></span>
                  </div>
                  <h3 className={styles.cardTitle}>Bamboo Made Utensil Holder</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>$26.27</span>
                    <Button
                      variant="primary"
                      className={styles.cardCartBtn}
                      onClick={() => addToCart({
                        _id: 'static-utensils',
                        title: 'Bamboo Made Utensil Holder',
                        price: 26.27,
                        images: ['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600']
                      }, 'static-utensils-sk', 1)}
                    >
                      + Cart
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 3. KITCHEN BANNER SECTION */}
      <section className={styles.kitchenBanner}>
        <div className={styles.kitchenBannerOverlay}>
          <p className={styles.kitchenBannerText}>
            We craft kitchenware you can trust for years to come — through everyday meals and evolving lifestyles. Each piece is thoughtfully made with sustainable materials.
          </p>
        </div>
      </section>

      {/* 4. ECO BADGES ROW */}
      <section className={styles.badgesRow}>
        <div className={styles.badgeCard}>
          <span className={styles.badgeIcon}>🌿</span>
          <h4>Natural Finish</h4>
        </div>
        <div className={styles.badgeCard}>
          <span className={styles.badgeIcon}>🌍</span>
          <h4>Eco Innovation</h4>
        </div>
        <div className={styles.badgeCard}>
          <span className={styles.badgeIcon}>🌱</span>
          <h4>Sustainable Materials</h4>
        </div>
      </section>

      {/* 5. EXPLORE CATEGORIES SECTION */}
      <section className={styles.sectionPadding}>
        <p className={styles.sectionPre}>Explore our thoughtful and</p>
        <h2 className={styles.sectionTitle} style={{ marginBottom: '32px' }}>planet-first ✧ Categories</h2>
        
        <div className={styles.categoryGrid}>
          <div className={styles.categoryCard} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600')` }}>
            <div className={styles.categoryCardOverlay}>
              <h3>Explore CupEco</h3>
              <Button onClick={() => navigate('/shop')} className={styles.categoryBtn}>Shop ➔</Button>
            </div>
          </div>
          <div className={styles.categoryCard} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600')` }}>
            <div className={styles.categoryCardOverlay}>
              <h3>Explore EcoSpoonery</h3>
              <Button onClick={() => navigate('/shop')} className={styles.categoryBtn}>Shop ➔</Button>
            </div>
          </div>
          <div className={styles.categoryCard} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600')` }}>
            <div className={styles.categoryCardOverlay}>
              <h3>Explore NatureSip</h3>
              <Button onClick={() => navigate('/shop')} className={styles.categoryBtn}>Shop ➔</Button>
            </div>
          </div>
          <div className={styles.categoryCard} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600')` }}>
            <div className={styles.categoryCardOverlay}>
              <h3>Explore FreshPitcher</h3>
              <Button onClick={() => navigate('/shop')} className={styles.categoryBtn}>Shop ➔</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THOUGHTFUL GALLERY SLIDER */}
      <section className={styles.sectionPadding}>
        <h2 className={styles.sectionTitle} style={{ marginBottom: '24px' }}>Thoughtful, Planet-Prioritizing Ideas<br />and Inspiration ✧ Gallery</h2>
        <div className={styles.gallerySlider}>
          <div className={styles.galleryCard} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600')` }}>
            <div className={styles.galleryCardText}>SizzlePro Non-Stick Pan</div>
          </div>
          <div className={styles.galleryCard} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600')` }}>
            <div className={styles.galleryCardText}>Grain Slice Board Duo</div>
          </div>
          <div className={styles.galleryCard} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600')` }}>
            <div className={styles.galleryCardText}>Bamboo Utensil Set</div>
          </div>
          <div className={styles.galleryCard} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578643463396-0997cb5328c1?q=80&w=600')` }}>
            <div className={styles.galleryCardText}>Glow Pot Ceramic</div>
          </div>
        </div>
      </section>

      {/* 7. COMMITMENT STATEMENT */}
      <section className={styles.commitmentSection}>
        <p className={styles.commitmentText}>
          Discover our commitment to <span className={styles.commitmentTag}>sustainable</span> materials, low-impact production, and <span className={styles.commitmentItalic}>ethical sourcing</span> partnerships — all crafted to support a healthier planet and a <span className={styles.commitmentTagGreen}>greener kitchen.</span>
        </p>
      </section>

      {/* 8. 10% OFF NEWSLETTER SECTION */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterLeft}>
          <h3>Get Recipes</h3>
          <h2>10% Off</h2>
          <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.newsletterInput}
              required
            />
            <Button type="submit" className={styles.newsletterBtn}>
              Subscribe
            </Button>
          </form>
          {subscribed && <p style={{ color: '#ffffff', marginTop: '12px', fontSize: '0.875rem' }}>Subscribed successfully!</p>}
          <p className={styles.newsletterSub}>
            Eco-friendly recipes, cooking tips, and a 10% discount on sustainable kitchenware for a greener lifestyle.
          </p>
        </div>
        <div className={styles.newsletterRightGrid}>
          <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=300" alt="recipes" />
          <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=300" alt="pots" />
        </div>
      </section>
    </div>
  );
}
