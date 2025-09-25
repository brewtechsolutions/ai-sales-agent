import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductRecommendationService } from './product-recommendation.service';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';

@ApiTags('Products')
@Controller('api/products')
@UseGuards(OptionalAuthGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productRecommendationService: ProductRecommendationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get products with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('isActive') isActive?: boolean,
  ) {
    return await this.productsService.getProducts(
      page,
      limit,
      category,
      search,
      minPrice,
      maxPrice,
      isActive,
    );
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, description: 'Featured products retrieved successfully' })
  async getFeaturedProducts(@Query('limit') limit: number = 5) {
    return await this.productsService.getFeaturedProducts(limit);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get product categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getProductCategories() {
    return await this.productsService.getProductCategories();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchProducts(
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('limit') limit: number = 10,
  ) {
    return await this.productsService.searchProducts(query, category, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  async getProduct(@Param('id') id: string) {
    return await this.productsService.getProductById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async createProduct(@Body() productData: any) {
    return await this.productsService.createProduct(productData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async updateProduct(@Param('id') id: string, @Body() updateData: any) {
    return await this.productsService.updateProduct(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.deleteProduct(id);
  }

  @Get('recommendations/:customerId')
  @ApiOperation({ summary: 'Get product recommendations for customer' })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved successfully' })
  async getProductRecommendations(
    @Param('customerId') customerId: string,
    @Query('limit') limit: number = 5,
  ) {
    return await this.productsService.getProductRecommendations(customerId, limit);
  }

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get product analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getProductAnalytics() {
    return await this.productsService.getProductAnalytics();
  }
}
