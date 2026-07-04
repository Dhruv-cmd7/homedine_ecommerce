import orderUsecase from './usecase.js';

export class OrderController {
  constructor(usecase) {
    this.usecase = usecase;
  }

  async checkout(req, res, next) {
    try {
      const { items, shippingAddress } = req.body;
      const order = await this.usecase.checkout(req.user.id, { items, shippingAddress });
      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created and paid successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req, res, next) {
    try {
      const orders = await this.usecase.getMyOrders(req.user.id);
      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderDetails(req, res, next) {
    try {
      const { id } = req.params;
      const order = await this.usecase.getOrderDetails(id, req.user.id);
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdminAnalytics(req, res, next) {
    try {
      const analytics = await this.usecase.getAdminAnalytics();
      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController(orderUsecase);
