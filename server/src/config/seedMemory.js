import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import Category from '../models/Category.model.js';
import Brand from '../models/Brand.model.js';
import Product from '../models/Product.model.js';

export default async function seedMemory() {
  try {
    // Clear collections first
    await User.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Product.deleteMany({});

    // Seed Admin User
    const salt = await bcrypt.genSalt(12);
    const adminPasswordHash = await bcrypt.hash('Admin123!@#', salt);
    await User.create({
      firstName: 'Homedine',
      lastName: 'Administrator',
      email: 'admin@homedine.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isVerified: true
    });

    // Seed Categories
    const drinkware = await Category.create({
      name: 'Drinkware',
      slug: 'drinkware',
      bannerImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
      iconImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=100&q=80'
    });
    const tableware = await Category.create({
      name: 'Tableware',
      slug: 'tableware',
      bannerImage: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
      iconImage: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=100&q=80'
    });
    const utensils = await Category.create({
      name: 'Utensils',
      slug: 'utensils',
      bannerImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80',
      iconImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=100&q=80'
    });

    // Seed Brands
    const ecocraft = await Brand.create({
      name: 'EcoCraft',
      slug: 'ecocraft',
      logoImage: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=100&q=80'
    });
    const naturesizzle = await Brand.create({
      name: 'NatureSizzle',
      slug: 'naturesizzle',
      logoImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=100&q=80'
    });

    // Seed Products
    const productsList = [
      // === DRINKWARE ===
      {
        sku: 'DK-GLASS-01',
        title: 'Amber Borosilicate Glass Set',
        description: 'Set of 4 hand-blown amber cups crafted from ultra-resilient borosilicate glass. Perfect for warm matcha or cold kombucha.',
        category: drinkware._id,
        brand: ecocraft._id,
        price: 48,
        compareAtPrice: 60,
        images: [
          'https://images.unsplash.com/photo-1569529465841-dfedd8750056?auto=format&fit=crop&w=600&q=80'
        ],
        variants: [
          { variantSku: 'DK-GLASS-01-AMB', colorName: 'Amber', colorHex: '#d58d60', size: 'Standard', price: 48, stock: 45 },
          { variantSku: 'DK-GLASS-01-CLR', colorName: 'Clear', colorHex: '#faf9f6', size: 'Standard', price: 42, stock: 20 }
        ],
        specifications: [
          { key: 'Material', value: '100% Borosilicate Glass' },
          { key: 'Capacity', value: '350ml' },
          { key: 'Pack Size', value: 'Set of 4' }
        ],
        rating: { average: 4.8, count: 12 },
        isFeatured: true,
        isBestseller: true,
        seo: { title: 'Amber Borosilicate Glass Cups Set | Homedine', description: 'Buy premium eco-friendly hand-blown amber borosilicate glass set.' }
      },
      {
        sku: 'DK-MUG-02',
        title: 'Minimalist Ceramic Mug Set',
        description: 'A gorgeous set of 4 matte clay coffee and tea mugs, organic in form and textured to be warm and comfortable to hold.',
        category: drinkware._id,
        brand: ecocraft._id,
        price: 38,
        compareAtPrice: 45,
        images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'],
        variants: [
          { variantSku: 'DK-MUG-02-MAT', colorName: 'Matte Clay', colorHex: '#d2b48c', size: '400ml', price: 38, stock: 35 }
        ],
        specifications: [
          { key: 'Material', value: 'Raw kiln-fired clay' },
          { key: 'Dishwasher Safe', value: 'Yes' },
          { key: 'Handmade', value: 'Yes' }
        ],
        rating: { average: 4.9, count: 19 },
        isFeatured: false,
        isBestseller: true,
        seo: { title: 'Minimalist Matte Ceramic Mugs Set | Homedine', description: 'Handcrafted stoneware coffee and tea mugs with raw clay handles.' }
      },
      {
        sku: 'DK-TUMB-03',
        title: 'Insulated Bamboo Tumbler',
        description: 'Double-walled stainless steel interior wrapped in organic sustainable bamboo wood. Keep your brew hot for 12 hours or cold for 24.',
        category: drinkware._id,
        brand: naturesizzle._id,
        price: 29,
        compareAtPrice: 35,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80'],
        variants: [
          { variantSku: 'DK-TUMB-03-BAM', colorName: 'Natural Bamboo', colorHex: '#e4d9c5', size: '500ml', price: 29, stock: 50 }
        ],
        specifications: [
          { key: 'Outer Material', value: 'Sustainable Bamboo Wood' },
          { key: 'Inner Material', value: '18/8 Food-grade Stainless Steel' },
          { key: 'BPA Free', value: 'Yes' }
        ],
        rating: { average: 4.7, count: 31 },
        isFeatured: true,
        isBestseller: false,
        seo: { title: 'Vacuum Insulated Bamboo Travel Tumbler | Homedine', description: 'Eco-friendly bamboo travel flask with tea infuser.' }
      },
      {
        sku: 'DK-POT-04',
        title: 'Borosilicate Glass Teapot',
        description: 'Thermal-shock resistant glass teapot with a built-in removable stainless steel loose-leaf tea infuser basket.',
        category: drinkware._id,
        brand: ecocraft._id,
        price: 44,
        images: ['https://images.unsplash.com/photo-1594631252845-29fc458994b8?auto=format&fit=crop&w=600&q=80'],
        variants: [
          { variantSku: 'DK-POT-04-CLR', colorName: 'Clear Glass', colorHex: '#ffffff', size: '800ml', price: 44, stock: 15 }
        ],
        specifications: [
          { key: 'Material', value: 'High Borosilicate Glass' },
          { key: 'Stovetop Safe', value: 'Yes (Low Flame)' },
          { key: 'Infuser Material', value: '304 Stainless Steel' }
        ],
        rating: { average: 4.6, count: 8 },
        isFeatured: false,
        isBestseller: false,
        seo: { title: 'Glass Teapot with Removable Infuser | Homedine', description: 'Stovetop safe borosilicate glass teapot for green tea.' }
      },

      // === TABLEWARE ===
      {
        sku: 'TB-CERAMIC-02',
        title: 'Raw Textured Dinner Plates',
        description: 'Earthy organic dinner plates styled with a textured raw finish. Hand-crafted from locally sourced kiln-fired stoneware clay.',
        category: tableware._id,
        brand: ecocraft._id,
        price: 84,
        images: [
          'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80'
        ],
        variants: [
          { variantSku: 'TB-CERAMIC-02-LG', colorName: 'Stone Grey', colorHex: '#8ca18f', size: 'Large (10")', price: 84, stock: 30 }
        ],
        specifications: [
          { key: 'Material', value: 'Natural stoneware clay' },
          { key: 'Dishwasher Safe', value: 'Yes' },
          { key: 'Finish', value: 'Raw matte glaze' }
        ],
        rating: { average: 4.9, count: 28 },
        isFeatured: true,
        isBestseller: false,
        seo: { title: 'Raw Kiln-Fired Clay Stoneware Dinner Plates | Homedine', description: 'Matte glaze raw stoneware dinner plates made of natural local clay.' }
      },
      {
        sku: 'TB-BOWL-05',
        title: 'Handmade Stoneware Bowls',
        description: 'Set of 4 organic nested stoneware bowls, perfect for warm porridge, ramen, or crisp seasonal garden salads.',
        category: tableware._id,
        brand: ecocraft._id,
        price: 52,
        compareAtPrice: 65,
        images: ['https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&w=600&q=80'],
        variants: [
          { variantSku: 'TB-BOWL-05-GRY', colorName: 'Earthy Sage', colorHex: '#9cb0a1', size: 'Set of 4', price: 52, stock: 24 }
        ],
        specifications: [
          { key: 'Material', value: 'Kiln-fired ceramic clay' },
          { key: 'Diameter', value: '6.5 inches' },
          { key: 'Microwave Safe', value: 'Yes' }
        ],
        rating: { average: 4.8, count: 17 },
        isFeatured: true,
        isBestseller: true,
        seo: { title: 'Glazed Stoneware Soup Ramen Bowls Set | Homedine', description: 'Natural clay dinnerware soup bowls with high sides.' }
      },
      {
        sku: 'TB-PLAT-06',
        title: 'Reclaimed Teak Serving Platter',
        description: 'Handcrafted raw teak grazing board. Captures the natural, warm grain and edge contours of sustainably harvested teak wood.',
        category: tableware._id,
        brand: naturesizzle._id,
        price: 58,
        images: ['https://images.unsplash.com/photo-1601599561213-832382fd07ba?auto=format&fit=crop&w=600&q=80'],
        variants: [
          { variantSku: 'TB-PLAT-06-WD', colorName: 'Teak Brown', colorHex: '#8b5a2b', size: 'Large (16")', price: 58, stock: 12 }
        ],
        specifications: [
          { key: 'Wood Type', value: '100% Solid Reclaimed Teak' },
          { key: 'Finish', value: 'Organic flaxseed oil glaze' },
          { key: 'Uses', value: 'Charcuterie, Cheeses, Bread Platter' }
        ],
        rating: { average: 4.7, count: 14 },
        isFeatured: false,
        isBestseller: false,
        seo: { title: 'Solid Teak Wood Charcuterie Board | Homedine', description: 'Shop rustic reclaimed wood serving platter with organic oil coating.' }
      },
      {
        sku: 'TB-SLAT-07',
        title: 'Natural Slate Cheese Board',
        description: 'Rustic charcoal-grey natural slate stone tray, complete with raw hand-cut edges for a beautiful rustic dinner display.',
        category: tableware._id,
        brand: naturesizzle._id,
        price: 32,
        compareAtPrice: 38,
        images: ['https://images.unsplash.com/photo-1563865436874-9aef32095ffd?auto=format&fit=crop&w=600&q=80'],
        variants: [
          { variantSku: 'TB-SLAT-07-DRK', colorName: 'Charcoal Grey', colorHex: '#2f4f4f', size: '12" x 8"', price: 32, stock: 18 }
        ],
        specifications: [
          { key: 'Material', value: '100% Natural Slate Stone' },
          { key: 'Feet', value: 'Soft EVA pads to prevent scratching' },
          { key: 'Writing', value: 'Can write with soapstone chalk' }
        ],
        rating: { average: 4.5, count: 22 },
        isFeatured: false,
        isBestseller: false,
        seo: { title: 'Slate Stone Cheeseboard Serving Tray | Homedine', description: 'Charcoal grey natural slate serving board with raw cut margins.' }
      },

      // === UTENSILS ===
      {
        sku: 'UT-WOOD-03',
        title: 'Hand-Carved Walnut Cooking Spoons',
        description: 'Set of 3 essential cooking utensils carved from sustainably harvested walnut timber. Non-toxic oil protective finish.',
        category: utensils._id,
        brand: naturesizzle._id,
        price: 36,
        compareAtPrice: 40,
        images: [
          'https://images.unsplash.com/photo-1609766914176-e44182470e89?auto=format&fit=crop&w=600&q=80'
        ],
        variants: [
          { variantSku: 'UT-WOOD-03-SET', colorName: 'Walnut Brown', colorHex: '#5c4033', size: 'Set of 3', price: 36, stock: 15 }
        ],
        specifications: [
          { key: 'Wood Type', value: 'Sustainable Black Walnut' },
          { key: 'Coating', value: 'Food-safe organic mineral oil' },
          { key: 'Length', value: '12 inches' }
        ],
        rating: { average: 4.7, count: 8 },
        isFeatured: false,
        isBestseller: true,
        seo: { title: 'Carved Walnut Cooking Utensils Set | Homedine', description: 'Shop non-scratch wood spatula spoons for eco cooking.' }
      },
      {
        sku: 'UT-GOLD-08',
        title: 'Brushed Brass Dessert Spoons',
        description: 'Set of 6 modern, elegant dessert spoons cast in solid brass and finished with a premium satin brushed gold look.',
        category: utensils._id,
        brand: ecocraft._id,
        price: 46,
        compareAtPrice: 55,
        images: ['https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=600&q=80'],
        variants: [
          { variantSku: 'UT-GOLD-08-BRS', colorName: 'Satin Brass', colorHex: '#c5a059', size: 'Set of 6', price: 46, stock: 25 }
        ],
        specifications: [
          { key: 'Material', value: 'Solid Food-grade Brass' },
          { key: 'Color', value: 'Brushed Gold' },
          { key: 'Handwash Only', value: 'Yes (Highly Recommended)' }
        ],
        rating: { average: 4.9, count: 15 },
        isFeatured: true,
        isBestseller: true,
        seo: { title: 'Brushed Brass Gold Spoon Set | Homedine', description: 'Buy premium satin gold dessert spoons set.' }
      },
      {
        sku: 'UT-BAM-09',
        title: 'Organic Bamboo Cooking Tongs',
        description: 'Set of 3 lightweight and heat-resistant serving tongs crafted from organic, fast-growing Moso bamboo.',
        category: utensils._id,
        brand: naturesizzle._id,
        price: 18,
        images: ['https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?auto=format&fit=crop&w=600&q=80'],
        variants: [
          { variantSku: 'UT-BAM-09-MOS', colorName: 'Moso Bamboo', colorHex: '#ecd7ad', size: 'Set of 3', price: 18, stock: 40 }
        ],
        specifications: [
          { key: 'Material', value: '100% Organic Moso Bamboo' },
          { key: 'Heat Resistant', value: 'Up to 220°F' },
          { key: 'Weight', value: '85 grams' }
        ],
        rating: { average: 4.8, count: 20 },
        isFeatured: false,
        isBestseller: false,
        seo: { title: 'Bamboo Kitchen Cooking Salad Tongs | Homedine', description: 'Fast growing bamboo utensils and tongs set.' }
      },
      {
        sku: 'UT-KNIF-10',
        title: 'Olivewood Handle Chef Knife',
        description: 'Ultra-sharp Japanese high-carbon steel chef knife, balanced with a gorgeous hand-carved olivewood timber bolster handle.',
        category: utensils._id,
        brand: naturesizzle._id,
        price: 120,
        compareAtPrice: 150,
        images: ['https://images.unsplash.com/photo-1593526613712-7b4b9a707330?auto=format&fit=crop&w=600&q=80'],
        variants: [
          { variantSku: 'UT-KNIF-10-8IN', colorName: 'Olivewood Steel', colorHex: '#a08a60', size: '8-inch Blade', price: 120, stock: 8 }
        ],
        specifications: [
          { key: 'Blade Material', value: 'Japanese AUS-10 High Carbon Steel' },
          { key: 'Handle Wood', value: 'Mediterranean Olivewood' },
          { key: 'Hardness Scale', value: '60±2 HRC' }
        ],
        rating: { average: 4.9, count: 32 },
        isFeatured: true,
        isBestseller: false,
        seo: { title: 'Japanese Steel Chef Knife with Olivewood Handle | Homedine', description: 'Professional 8-inch chef knife forged of Japanese high carbon steel.' }
      }
    ];

    await Product.create(productsList);
  } catch (error) {
    console.error('Error seeding memory database:', error.message);
  }
}
