import catalogRepository from './repository.js';
import { cacheManager } from '../../config/cache.js';

export class CatalogUsecase {
  constructor(repository) {
    this.repository = repository;
  }

  async getActiveCategories() {
    const cacheKey = 'catalog:categories';
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    const categories = await this.repository.getCategories();
    cacheManager.set(cacheKey, categories, 600); // 10 minutes cache
    return categories;
  }

  async getActiveBrands() {
    const cacheKey = 'catalog:brands';
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    const brands = await this.repository.getBrands();
    cacheManager.set(cacheKey, brands, 600); // 10 minutes cache
    return brands;
  }

  async queryCatalogProducts(params) {
    // Generate serialized cache key based on query parameters
    const cacheKey = `catalog:query:${JSON.stringify(params)}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    const result = await this.repository.queryProducts(params);
    cacheManager.set(cacheKey, result, 300); // 5 minutes cache
    return result;
  }

  async getProductDetails(id) {
    const cacheKey = `catalog:product:${id}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    const product = await this.repository.findProductById(id);
    if (!product || !product.isActive) {
      throw new Error('Product not found or inactive');
    }

    cacheManager.set(cacheKey, product, 600); // 10 minutes cache
    return product;
  }

  // Admin Operations
  async adminCreateProduct(productData) {
    const existing = await this.repository.findProductBySku(productData.sku);
    if (existing) {
      throw new Error('Product with this SKU already exists');
    }

    const newProduct = await this.repository.createProduct(productData);
    
    // Invalidate cached query and list data on creation
    cacheManager.clearPrefix('catalog:');
    return newProduct;
  }

  async adminUpdateProduct(id, updateData) {
    const product = await this.repository.findProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const updated = await this.repository.updateProduct(id, updateData);
    
    // Clear product and query cache entries
    cacheManager.delete(`catalog:product:${id}`);
    cacheManager.clearPrefix('catalog:query:');
    return updated;
  }

  async adminDeleteProduct(id) {
    const product = await this.repository.findProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await this.repository.deleteProduct(id);
    
    // Clear product and query cache entries
    cacheManager.delete(`catalog:product:${id}`);
    cacheManager.clearPrefix('catalog:query:');
    return true;
  }

  async adminCreateCategory(categoryData) {
    const newCategory = await this.repository.createCategory(categoryData);
    cacheManager.delete('catalog:categories');
    return newCategory;
  }

  async adminCreateBrand(brandData) {
    const newBrand = await this.repository.createBrand(brandData);
    cacheManager.delete('catalog:brands');
    return newBrand;
  }
}

export default new CatalogUsecase(catalogRepository);
