import cartRepository from './repository.js';

export class CartUsecase {
  constructor(repository) {
    this.repository = repository;
  }

  async getCart(userId) {
    let cart = await this.repository.findCartByUserId(userId);
    if (!cart) {
      cart = await this.repository.createCart(userId);
    }
    return cart;
  }

  async updateCartItems(userId, items) {
    let cart = await this.repository.findCartByUserId(userId);
    if (!cart) {
      cart = await this.repository.createCart(userId, items);
    } else {
      cart.items = items;
      await this.repository.saveCart(cart);
    }
    // Re-fetch to return populated details
    return await this.repository.findCartByUserId(userId);
  }

  async mergeCart(userId, guestItems) {
    let cart = await this.repository.findCartByUserId(userId);
    if (!cart) {
      cart = await this.repository.createCart(userId, guestItems);
      return cart;
    }

    // Merge logic: Combine quantities of identical product/variant items
    guestItems.forEach((guestItem) => {
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === guestItem.product.toString() &&
          item.variantSku === guestItem.variantSku
      );

      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        cart.items.push(guestItem);
      }
    });

    await this.repository.saveCart(cart);
    return await this.repository.findCartByUserId(userId);
  }
}

export default new CartUsecase(cartRepository);
