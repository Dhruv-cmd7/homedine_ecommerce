import Cart from '../../models/Cart.model.js';

export class CartRepository {
  async findCartByUserId(userId) {
    return await Cart.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'title price images brand variants sku',
        populate: { path: 'brand', select: 'name' }
      });
  }

  async saveCart(cartData) {
    return await cartData.save();
  }

  async createCart(userId, items = []) {
    const cart = new Cart({ user: userId, items });
    return await cart.save();
  }
}

export default new CartRepository();
