import Product from '../../models/Product.model.js';
import Category from '../../models/Category.model.js';
import Brand from '../../models/Brand.model.js';

export class CatalogRepository {
  async getCategories() {
    return await Category.find({ isActive: true }).sort({ name: 1 });
  }

  async getBrands() {
    return await Brand.find({ isActive: true }).sort({ name: 1 });
  }

  async getCategoryById(id) {
    return await Category.findById(id);
  }

  async getBrandById(id) {
    return await Brand.findById(id);
  }

  async createCategory(categoryData) {
    const category = new Category(categoryData);
    return await category.save();
  }

  async createBrand(brandData) {
    const brand = new Brand(brandData);
    return await brand.save();
  }

  async findProductById(id) {
    return await Product.findById(id)
      .populate('category', 'name slug')
      .populate('brand', 'name slug');
  }

  async findProductBySku(sku) {
    return await Product.findOne({ sku });
  }

  async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async updateProduct(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async queryProducts({
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    isFeatured,
    isBestseller,
    sort = 'newest',
    page = 1,
    limit = 12
  }) {
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }
    if (brand) {
      filter.brand = brand;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (isBestseller !== undefined) {
      filter.isBestseller = isBestseller === 'true' || isBestseller === true;
    }

    // Full Text Search support
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sorting query
    let sortQuery = { createdAt: -1 }; // newest by default
    if (sort === 'price-low') {
      sortQuery = { price: 1 };
    } else if (sort === 'price-high') {
      sortQuery = { price: -1 };
    } else if (sort === 'rating') {
      sortQuery = { 'rating.average': -1 };
    }

    const skipCount = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .sort(sortQuery)
      .skip(skipCount)
      .limit(Number(limit));

    const totalCount = await Product.countDocuments(filter);

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page)
    };
  }
}

export default new CatalogRepository();
