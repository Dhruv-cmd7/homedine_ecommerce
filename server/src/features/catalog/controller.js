import catalogUsecase from './usecase.js';

export class CatalogController {
  constructor(usecase) {
    this.usecase = usecase;
  }

  async getCategories(req, res, next) {
    try {
      const categories = await this.usecase.getActiveCategories();
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  async getBrands(req, res, next) {
    try {
      const brands = await this.usecase.getActiveBrands();
      res.status(200).json({
        success: true,
        data: brands
      });
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req, res, next) {
    try {
      const {
        category,
        brand,
        minPrice,
        maxPrice,
        search,
        isFeatured,
        isBestseller,
        sort,
        page,
        limit
      } = req.query;

      const result = await this.usecase.queryCatalogProducts({
        category,
        brand,
        minPrice,
        maxPrice,
        search,
        isFeatured,
        isBestseller,
        sort,
        page,
        limit
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await this.usecase.getProductDetails(req.params.id);
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin Controller endpoints
  async adminCreateProduct(req, res, next) {
    try {
      const product = await this.usecase.adminCreateProduct(req.body);
      res.status(201).json({
        success: true,
        data: product,
        message: 'Product listing created successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async adminUpdateProduct(req, res, next) {
    try {
      const product = await this.usecase.adminUpdateProduct(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: product,
        message: 'Product listing updated successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async adminDeleteProduct(req, res, next) {
    try {
      await this.usecase.adminDeleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Product listing deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async adminCreateCategory(req, res, next) {
    try {
      const category = await this.usecase.adminCreateCategory(req.body);
      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async adminCreateBrand(req, res, next) {
    try {
      const brand = await this.usecase.adminCreateBrand(req.body);
      res.status(201).json({
        success: true,
        data: brand,
        message: 'Brand created successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CatalogController(catalogUsecase);
