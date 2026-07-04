import Order from '../../models/Order.model.js';

export class OrderRepository {
  async create(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }

  async findById(orderId) {
    return await Order.findById(orderId).populate('items.productId');
  }

  async findByOrderNumber(orderNumber) {
    return await Order.findOne({ orderNumber }).populate('items.productId');
  }

  async findByCustomerId(customerId) {
    return await Order.find({ customerId }).sort({ createdAt: -1 });
  }

  async findAll() {
    return await Order.find({}).sort({ createdAt: -1 }).populate('customerId', 'firstName lastName email');
  }

  async updateStatus(orderId, updateFields) {
    return await Order.findByIdAndUpdate(
      orderId,
      { $set: updateFields },
      { new: true }
    );
  }
}

export default new OrderRepository();
