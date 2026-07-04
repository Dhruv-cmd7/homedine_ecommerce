import orderRepository from './repository.js';
import Product from '../../models/Product.model.js';
import Cart from '../../models/Cart.model.js';

export class OrderUsecase {
  constructor(repository) {
    this.repository = repository;
  }

  async checkout(userId, { items, shippingAddress }) {
    if (!items || items.length === 0) {
      throw new Error('Cannot place an order with an empty bag.');
    }

    // 1. Stock Validation and Reservation
    const orderItems = [];
    let subtotal = 0;

    for (const checkoutItem of items) {
      const product = await Product.findById(checkoutItem.productId);
      if (!product || !product.isActive) {
        throw new Error(`Product "${checkoutItem.title || 'Unknown'}" is no longer available.`);
      }

      // If product has variants, look up variant SKU stock
      const variant = product.variants.find(v => v.variantSku === checkoutItem.variantSku);
      if (variant) {
        if (variant.stock < checkoutItem.quantity) {
          throw new Error(`Insufficient stock for variant "${variant.colorName || ''} - ${variant.size || ''}". Available: ${variant.stock}`);
        }
        // Reserve stock
        variant.stock -= checkoutItem.quantity;
      } else {
        // Fallback check on general product SKU if no variant details
        throw new Error(`Variant "${checkoutItem.variantSku}" not found on product catalog.`);
      }

      await product.save();

      const price = variant.price || product.price;
      subtotal += price * checkoutItem.quantity;

      orderItems.push({
        productId: product._id,
        variantSku: checkoutItem.variantSku,
        title: product.title,
        price,
        quantity: checkoutItem.quantity
      });
    }

    // 2. Calculations
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% Tax
    const shipping = subtotal >= 150 ? 0 : 10; // Free over $150, else $10
    const grandTotal = Math.round((subtotal + tax + shipping) * 100) / 100;

    // 3. Generate unique order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `HD-${dateStr}-${randSuffix}`;

    // 4. Create Order document
    const orderData = {
      orderNumber,
      customerId: userId,
      items: orderItems,
      totals: {
        subtotal,
        tax,
        shipping,
        discount: 0,
        grandTotal
      },
      shippingAddress,
      paymentStatus: 'paid', // Simulate checkout success immediately
      fulfillmentStatus: 'processing'
    };

    const newOrder = await this.repository.create(orderData);

    // 5. Clear User Cart database
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    return newOrder;
  }

  async getMyOrders(userId) {
    return await this.repository.findByCustomerId(userId);
  }

  async getOrderDetails(orderId, userId) {
    const order = await this.repository.findById(orderId);
    if (!order) {
      throw new Error('Order not found.');
    }
    // Access control check
    if (order.customerId && order.customerId.toString() !== userId) {
      throw new Error('Access denied to view this order.');
    }
    return order;
  }

  async getAdminAnalytics() {
    const orders = await this.repository.findAll();
    const totalSales = orders.reduce((sum, o) => sum + o.totals.grandTotal, 0);
    const totalOrders = orders.length;

    // Fetch products to check low stock
    const products = await Product.find({});
    const lowStockProducts = [];
    for (const prod of products) {
      const lowVariants = prod.variants.filter(v => v.stock < 10);
      if (lowVariants.length > 0) {
        lowStockProducts.push({
          productId: prod._id,
          title: prod.title,
          sku: prod.sku,
          variants: lowVariants.map(v => ({
            variantSku: v.variantSku,
            colorName: v.colorName,
            size: v.size,
            stock: v.stock
          }))
        });
      }
    }

    // Top selling calculations
    const productSalesMap = {};
    for (const order of orders) {
      for (const item of order.items) {
        if (!item.productId) continue;
        const id = item.productId._id ? item.productId._id.toString() : item.productId.toString();
        if (!productSalesMap[id]) {
          productSalesMap[id] = {
            title: item.title,
            salesCount: 0,
            revenue: 0
          };
        }
        productSalesMap[id].salesCount += item.quantity;
        productSalesMap[id].revenue += item.price * item.quantity;
      }
    }

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);

    return {
      kpi: {
        totalSales: Math.round(totalSales * 100) / 100,
        totalOrders,
        lowStockCount: lowStockProducts.length,
        totalProducts: products.length
      },
      recentOrders: orders.slice(0, 5).map(o => ({
        _id: o._id,
        orderNumber: o.orderNumber,
        grandTotal: o.totals.grandTotal,
        paymentStatus: o.paymentStatus,
        fulfillmentStatus: o.fulfillmentStatus,
        createdAt: o.createdAt,
        customerName: o.customerId ? `${o.customerId.firstName} ${o.customerId.lastName}` : 'Guest'
      })),
      lowStockProducts,
      topSellingProducts
    };
  }
}

export default new OrderUsecase(orderRepository);
