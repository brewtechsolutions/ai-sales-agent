import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { ProductRecommendationService } from './product-recommendation.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private productRecommendationService: ProductRecommendationService,
  ) {}

  /**
   * Get all products with pagination and filtering
   */
  async getProducts(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    isActive?: boolean,
  ) {
    try {
      const where: any = {};

      if (category) {
        where.category = category;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const result = await this.prisma.paginate(
        this.prisma.product,
        page,
        limit,
        where,
        { createdAt: 'desc' },
      );

      this.logger.debug(`Retrieved ${result.data.length} products`);
      return result;
    } catch (error) {
      this.logger.error('Error getting products:', error);
      throw new Error('Failed to get products');
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      this.logger.error('Error getting product by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new product
   */
  async createProduct(productData: {
    name: string;
    description: string;
    category: string;
    price: number;
    currency?: string;
    stockQuantity?: number;
    metadata?: any;
  }) {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          category: productData.category,
          price: productData.price,
          currency: productData.currency || 'MYR',
          stockQuantity: productData.stockQuantity || 0,
          metadata: productData.metadata || {},
        },
      });

      // Clear product cache
      await this.clearProductCache();

      this.logger.log(`Created product: ${product.id}`);
      return product;
    } catch (error) {
      this.logger.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: string, updateData: {
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    currency?: string;
    stockQuantity?: number;
    isActive?: boolean;
    metadata?: any;
  }) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: updateData,
      });

      // Clear product cache
      await this.clearProductCache();

      this.logger.log(`Updated product: ${id}`);
      return product;
    } catch (error) {
      this.logger.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete product (soft delete by setting isActive to false)
   */
  async deleteProduct(id: string) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      // Clear product cache
      await this.clearProductCache();

      this.logger.log(`Deleted product: ${id}`);
      return product;
    } catch (error) {
      this.logger.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Get product categories
   */
  async getProductCategories() {
    try {
      const cacheKey = 'product_categories';
      
      // Try to get from cache first
      const cached = await this.cacheService.get<string[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const categories = await this.prisma.product.findMany({
        where: { isActive: true },
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      });

      const categoryList = categories.map(cat => cat.category);

      // Cache for 1 hour
      await this.cacheService.set(cacheKey, categoryList, 3600);

      return categoryList;
    } catch (error) {
      this.logger.error('Error getting product categories:', error);
      throw new Error('Failed to get product categories');
    }
  }

  /**
   * Search products
   */
  async searchProducts(
    query: string,
    category?: string,
    limit: number = 10,
  ) {
    try {
      const where: any = {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (category) {
        where.category = category;
      }

      const products = await this.prisma.product.findMany({
        where,
        take: limit,
        orderBy: [
          { name: 'asc' },
          { price: 'asc' },
        ],
      });

      this.logger.debug(`Found ${products.length} products for query: ${query}`);
      return products;
    } catch (error) {
      this.logger.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const where = {
        category,
        isActive: true,
      };

      const result = await this.prisma.paginate(
        this.prisma.product,
        page,
        limit,
        where,
        { createdAt: 'desc' },
      );

      return result;
    } catch (error) {
      this.logger.error('Error getting products by category:', error);
      throw new Error('Failed to get products by category');
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 5) {
    try {
      const cacheKey = `featured_products_${limit}`;
      
      // Try to get from cache first
      const cached = await this.cacheService.get<any[]>(cacheKey);
      if (cached) {
        return cached;
      }

      // Get products with stock and sort by creation date
      const products = await this.prisma.product.findMany({
        where: {
          isActive: true,
          stockQuantity: { gt: 0 },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      // Cache for 30 minutes
      await this.cacheService.set(cacheKey, products, 1800);

      return products;
    } catch (error) {
      this.logger.error('Error getting featured products:', error);
      throw new Error('Failed to get featured products');
    }
  }

  /**
   * Update product stock
   */
  async updateProductStock(id: string, quantity: number) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: { stockQuantity: quantity },
      });

      // Clear product cache
      await this.clearProductCache();

      this.logger.log(`Updated stock for product ${id}: ${quantity}`);
      return product;
    } catch (error) {
      this.logger.error('Error updating product stock:', error);
      throw error;
    }
  }

  /**
   * Get product recommendations for customer
   */
  async getProductRecommendations(
    customerId: string,
    limit: number = 5,
  ) {
    try {
      return await this.productRecommendationService.getRecommendations(
        customerId,
        limit,
      );
    } catch (error) {
      this.logger.error('Error getting product recommendations:', error);
      throw error;
    }
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics() {
    try {
      const cacheKey = 'product_analytics';
      
      // Try to get from cache first
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) {
        return cached;
      }

      const [
        totalProducts,
        activeProducts,
        outOfStockProducts,
        categoryCounts,
        averagePrice,
      ] = await Promise.all([
        this.prisma.product.count(),
        this.prisma.product.count({ where: { isActive: true } }),
        this.prisma.product.count({ where: { stockQuantity: 0 } }),
        this.prisma.product.groupBy({
          by: ['category'],
          _count: { category: true },
          where: { isActive: true },
        }),
        this.prisma.product.aggregate({
          _avg: { price: true },
          where: { isActive: true },
        }),
      ]);

      const analytics = {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        categoryCounts: categoryCounts.map(cat => ({
          category: cat.category,
          count: cat._count.category,
        })),
        averagePrice: averagePrice._avg.price || 0,
        lastUpdated: new Date().toISOString(),
      };

      // Cache for 1 hour
      await this.cacheService.set(cacheKey, analytics, 3600);

      return analytics;
    } catch (error) {
      this.logger.error('Error getting product analytics:', error);
      throw new Error('Failed to get product analytics');
    }
  }

  private async clearProductCache(): Promise<void> {
    try {
      const keys = await this.cacheService.keys('product_*');
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    } catch (error) {
      this.logger.error('Error clearing product cache:', error);
    }
  }
}
