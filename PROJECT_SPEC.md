# Homedine Project Technical Specification

This document defines the implementation specifications for the **Homedine** premium eco-friendly kitchenware platform. Developers must build all modules to conform to these exact requirements.

---

## 1. UI & Visual Specifications

### 1.1 Color Tokens
Define these variables in `/client/src/styles/variables.css`:

* **Primary Forest Green:** `hsl(158, 36%, 17%)` (`#1c3a2f`) - Core branding, main CTA buttons, headers.
* **Secondary Moss Green:** `hsl(145, 15%, 58%)` (`#8ca18f`) - Accent borders, rating cards, low-contrast UI icons.
* **Background Off-White:** `hsl(40, 20%, 95%)` (`#f4f2eb`) - Main page canvas.
* **Warm Cream / Card Surface:** `hsl(40, 15%, 98%)` (`#faf9f6`) - Content blocks, input backing.
* **Accent Terracotta:** `hsl(24, 45%, 58%)` (`#d58d60`) - Price highlights, promotion texts.
* **Dark Mode Core Canvas:** `hsl(158, 28%, 8%)` (`#0f1714`) - Active screen background in dark mode.
* **Dark Mode Card Surface:** `hsl(158, 21%, 11%)` (`#16221e`) - Cards and inputs in dark mode.

### 1.2 Typography
* **Serif Display Font:** `Playfair Display` or `Lora` (Google Fonts). Applied to main headers and emphasis text.
* **Sans-Serif UI Font:** `Outfit` or `Inter` (Google Fonts). Applied to body copy, inputs, numbers, and buttons.

### 1.3 Key UI Components (Storefront & Admin)
* **Header / Navbar:** Glassmorphic navigation bar with `backdrop-filter: blur(12px)`. Center-aligned logo "Homedine", left-aligned links, and right-aligned search pill and shopping cart drawer trigger.
* **Hero Banner:** Forest green layout featuring high-contrast text and a circular "96% Natural. Sustainable. Eco-conscious." visual metric gauge.
* **Bestsellers Grid:** A 4-column display of product cards, each including badge tags (e.g., "Customer favorite"), product photos, variant selectors, and a forest-green "+ Cart" button.
* **Admin Dashboard View:** Split layout with KPI cards (Revenue, Orders, Products, Users, Conversion Rate), sales trend charts, recent orders table, low-stock warnings, and latest registered users.
* **Admin Catalog Controllers:** Lists with filters, search, toggle settings (e.g. Featured status), and forms for adding/editing products (supporting multi-image inputs and variant/specification structures).

---

## 2. Database Models (Mongoose Schemas)

All schemas are defined in `/server/src/models/` and utilize pure JavaScript ES Modules.

### 2.1 User Schema (`User.model.js`)
```javascript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  addresses: [{
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
```

### 2.2 Product Schema (`Product.model.js`)
```javascript
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', index: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  images: [{ type: String }], // Cloudinary URLs
  variants: [{
    variantSku: { type: String, required: true, unique: true },
    colorName: { type: String },
    colorHex: { type: String },
    size: { type: String },
    price: { type: Number },
    stock: { type: Number, default: 0 }
  }],
  specifications: [{
    key: { type: String },
    value: { type: String }
  }],
  rating: {
    average: { type: Number, default: 5.0 },
    count: { type: Number, default: 0 }
  },
  isFeatured: { type: Boolean, default: false, index: true },
  isBestseller: { type: Boolean, default: false, index: true },
  isActive: { type: Boolean, default: true, index: true },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }]
  }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
```

### 2.3 Category Schema (`Category.model.js`)
```javascript
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  bannerImage: { type: String }, // Cloudinary URL
  iconImage: { type: String },   // Cloudinary URL
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema);
```

### 2.4 Brand Schema (`Brand.model.js`)
```javascript
import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  logoImage: { type: String }, // Cloudinary URL
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Brand', BrandSchema);
```

### 2.5 Order Schema (`Order.model.js`)
```javascript
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
  guestEmail: { type: String },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: { type: String },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  totals: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true, default: 0 },
    shipping: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true }
  },
  shippingAddress: {
    recipient: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'failed'], default: 'unpaid' },
  fulfillmentStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'processing' },
  stripePaymentIntentId: { type: String, index: true },
  couponUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
```

### 2.6 Coupon Schema (`Coupon.model.js`)
```javascript
import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
  minimumPurchase: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Coupon', CouponSchema);
```

### 2.7 Review Schema (`Review.model.js`)
```javascript
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false, index: true }
}, { timestamps: true });

export default mongoose.model('Review', ReviewSchema);
```

### 2.8 Banner Schema (`Banner.model.js`)
```javascript
import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  imageUrl: { type: String, required: true }, // Cloudinary URL
  linkUrl: { type: String },
  type: { type: String, enum: ['homepage', 'promotional', 'seasonal'], required: true, index: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Banner', BannerSchema);
```

### 2.9 Setting Schema (`Setting.model.js`)
```javascript
import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  websiteName: { type: String, default: 'Homedine' },
  contactInfo: {
    email: { type: String },
    phone: { type: String },
    address: { type: String }
  },
  socialLinks: {
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String }
  },
  paymentSettings: {
    stripePublicKey: { type: String },
    stripeWebhookSecret: { type: String }
  },
  shippingFee: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 } // Percentage
}, { timestamps: true });

export default mongoose.model('Setting', SettingSchema);
```

### 2.10 Audit Log Schema (`AuditLog.model.js`)
```javascript
import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true }, // e.g. "PRODUCT_DELETE", "USER_BLOCK", "COUPON_CREATE"
  targetId: { type: mongoose.Schema.Types.ObjectId, index: true }, // ID of affected item
  targetModel: { type: String }, // e.g. "Product", "User"
  ipAddress: { type: String },
  userAgent: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model('AuditLog', AuditLogSchema);
```

---

## 3. Core REST API Contract

All JSON responses must return a standard envelope structure:
```json
{
  "success": true,
  "data": {},
  "message": "Optional feedback message"
}
```

### 3.1 Authentication Endpoints (Customer & Admin)
* **POST** `/api/v1/auth/register` - Body: `{ firstName, lastName, email, password }`
* **POST** `/api/v1/auth/login` - Body: `{ email, password }` (Returns access token, sets HTTP-only refresh cookie)
* **POST** `/api/v1/auth/forgot-password` - Body: `{ email }`
* **POST** `/api/v1/auth/reset-password` - Body: `{ token, newPassword }`
* **POST** `/api/v1/auth/verify-email` - Body: `{ token }`
* **POST** `/api/v1/auth/logout` - Clears refresh cookie and cache.
* **POST** `/api/v1/auth/refresh` - Swap cookie refresh token for new access token.
* **GET** `/api/v1/auth/profile` (Private) - Fetch client profiles.
* **PUT** `/api/v1/auth/change-password` (Private) - Body: `{ currentPassword, newPassword }`

### 3.2 Product Catalog Endpoints (Public & Admin)
* **GET** `/api/v1/products` - Queries: `category`, `brand`, `minPrice`, `maxPrice`, `search`, `page`, `limit`.
* **GET** `/api/v1/products/:id` - Fetch product document details.
* **POST** `/api/v1/admin/products` (Admin Only) - Multi-image file input parser via Multer. Body: `{ sku, title, description, category, brand, price, variants, specifications, seo }`
* **PUT** `/api/v1/admin/products/:id` (Admin Only) - Edit listing details.
* **DELETE** `/api/v1/admin/products/:id` (Admin Only) - Delete listing (Deletes images from Cloudinary, registers Audit Log).

### 3.3 Categories & Brands Endpoints (Public & Admin)
* **GET** `/api/v1/categories` - Fetch all active categories.
* **POST** `/api/v1/admin/categories` (Admin Only) - Add category (Supports Banner/Icon upload).
* **PUT** `/api/v1/admin/categories/:id` (Admin Only) - Edit category.
* **DELETE** `/api/v1/admin/categories/:id` (Admin Only) - Delete category.
* **GET** `/api/v1/brands` - Fetch all active brands.
* **POST** `/api/v1/admin/brands` (Admin Only) - Add brand (Supports Logo upload).
* **PUT** `/api/v1/admin/brands/:id` (Admin Only) - Edit brand.
* **DELETE** `/api/v1/admin/brands/:id` (Admin Only) - Delete brand.

### 3.4 Shopping Cart Endpoints
* **POST** `/api/v1/cart/sync` - Body: `{ items: [{ productId, variantSku, quantity }] }` (Merges cart).

### 3.5 Checkout & Order Endpoints (Customer & Admin)
* **POST** `/api/v1/orders/checkout` (Private) - Body: `{ items, shippingAddress, couponCode }` (Creates order, locks stocks, Stripe secret returned).
* **POST** `/api/v1/orders/stripe-webhook` (Public) - Validates signature, sets payment to `paid`, confirms stock allocation.
* **GET** `/api/v1/orders/my-orders` (Private) - Customer order history.
* **GET** `/api/v1/admin/orders` (Admin Only) - Admin sales analytics listing.
* **PUT** `/api/v1/admin/orders/:id/status` (Admin Only) - Body: `{ status }` (Update fulfillment status: processing, shipped, delivered, cancelled).
* **POST** `/api/v1/admin/orders/:id/refund` (Admin Only) - Execute Stripe refund request, mark order as `refunded`, release stock, register Audit Log.
* **GET** `/api/v1/orders/:id/invoice` (Private) - Downloads invoice.

### 3.6 User Management (Admin Only)
* **GET** `/api/v1/admin/users` - Fetch/search user list.
* **PUT** `/api/v1/admin/users/:id/block` - Block user.
* **PUT** `/api/v1/admin/users/:id/unblock` - Unblock user.
* **PUT** `/api/v1/admin/users/:id/role` - Body: `{ role }` (Assign customer/admin roles).
* **DELETE** `/api/v1/admin/users/:id` - Delete user.

### 3.7 Coupon System Endpoints (Customer & Admin)
* **POST** `/api/v1/admin/coupons` (Admin Only) - Body: `{ code, discountType, discountValue, expiryDate, usageLimit, minimumPurchase }`
* **PUT** `/api/v1/admin/coupons/:id` (Admin Only) - Edit coupon rules.
* **DELETE** `/api/v1/admin/coupons/:id` (Admin Only) - Delete coupon.
* **GET** `/api/v1/coupons/validate/:code` (Private) - Validate checkout coupon parameters.

### 3.8 Reviews Endpoints (Customer & Admin)
* **POST** `/api/v1/reviews/:productId` (Private) - Body: `{ rating, comment }` (Awaits approval).
* **GET** `/api/v1/reviews/:productId` (Public) - Fetch only approved reviews.
* **GET** `/api/v1/admin/reviews` (Admin Only) - View pending and approved list.
* **PUT** `/api/v1/admin/reviews/:id/approve` (Admin Only) - Toggle review status.
* **DELETE** `/api/v1/admin/reviews/:id` (Admin/User Only) - Delete review.

### 3.9 Banners & Settings (Public & Admin)
* **GET** `/api/v1/banners` (Public) - Fetch active display banners.
* **POST** `/api/v1/admin/banners` (Admin Only) - Add banner (Homepage, Promo, Seasonal).
* **DELETE** `/api/v1/admin/banners/:id` (Admin Only) - Delete banner.
* **GET** `/api/v1/settings` (Public) - Fetch web configurations.
* **PUT** `/api/v1/admin/settings` (Admin Only) - Body: `{ websiteName, contactInfo, socialLinks, paymentSettings, shippingFee, taxRate }`
* **GET** `/api/v1/admin/audit-logs` (Admin Only) - Fetch system security logs.

---

## 4. Production Deployment & Security Specifications
* **Docker Configurations:** Client files are built and served using an Nginx alpine container. The backend runs on a Node-alpine container.
* **Authentication Validation:** Use Express validation middleware to check access tokens before forwarding requests to private routes.
* **Secure Cookie Parameters:**
  ```javascript
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
  };
  ```
* **Database Indexes:** Compound indexes must be defined on search queries (e.g., `category_1_price_1_isActive_1`) to optimize search page load speeds.
