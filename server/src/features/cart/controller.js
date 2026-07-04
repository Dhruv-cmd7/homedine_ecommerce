import cartUsecase from './usecase.js';

export class CartController {
  constructor(usecase) {
    this.usecase = usecase;
  }

  async getCart(req, res, next) {
    try {
      const cart = await this.usecase.getCart(req.user.id);
      res.status(200).json({
        success: true,
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCart(req, res, next) {
    try {
      const { items } = req.body;
      const cart = await this.usecase.updateCartItems(req.user.id, items);
      res.status(200).json({
        success: true,
        data: cart,
        message: 'Cart updated successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async mergeCart(req, res, next) {
    try {
      const { items } = req.body;
      const cart = await this.usecase.mergeCart(req.user.id, items);
      res.status(200).json({
        success: true,
        data: cart,
        message: 'Cart merged successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController(cartUsecase);
