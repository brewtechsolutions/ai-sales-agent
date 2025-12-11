/**
 * Product service functions
 * Updated for multi-tenant architecture
 */

import { prisma } from "../../prisma";
import { CreateProductInput, UpdateProductInput } from "./schemas";

interface GetAllInput {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  isActive?: boolean;
}

export const productService = {
  /**
   * Create product (with company isolation)
   */
  create: async (input: CreateProductInput, companyId: string) => {
    return prisma.product.create({
      data: {
        ...input,
        companyId,
        currency: input.currency || "MYR",
      },
    });
  },

  /**
   * Get all products (filtered by company)
   */
  getAll: async (input: GetAllInput, companyId: string) => {
    const { page, pageSize, sortBy, sortOrder, category, isActive } = input;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: any = {
      companyId,
    };

    if (category) {
      where.category = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: sortBy
          ? {
              [sortBy]: sortOrder || "asc",
            }
          : { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  /**
   * Get product by ID (with company verification)
   */
  getById: async (id: string, companyId: string) => {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.companyId !== companyId) {
      throw new Error("Product not found");
    }

    return product;
  },

  /**
   * Update product (with company verification)
   */
  update: async (input: UpdateProductInput, companyId: string) => {
    const { id, ...data } = input;

    // Verify ownership
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing || existing.companyId !== companyId) {
      throw new Error("Product not found");
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete product (with company verification)
   */
  delete: async (id: string, companyId: string) => {
    // Verify ownership
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing || existing.companyId !== companyId) {
      throw new Error("Product not found");
    }

    return prisma.product.delete({
      where: { id },
    });
  },

  /**
   * Get product stats (company-specific)
   */
  getStats: async (companyId: string) => {
    const [totalProducts, lowStockItems, outOfStockItems, totalValue] =
      await Promise.all([
        prisma.product.count({
          where: { companyId },
        }),
        prisma.product.count({
          where: {
            companyId,
            stockStatus: "limited",
          },
        }),
        prisma.product.count({
          where: {
            companyId,
            stockStatus: "out_of_stock",
          },
        }),
        prisma.product.aggregate({
          where: { companyId },
          _sum: {
            price: true,
          },
        }),
      ]);

    return {
      totalProducts,
      lowStockItems,
      outOfStockItems,
      totalValue: totalValue._sum.price || 0,
    };
  },

  /**
   * Bulk import products
   */
  bulkImport: async (products: CreateProductInput[], companyId: string) => {
    const created = await prisma.product.createMany({
      data: products.map((p) => ({
        ...p,
        companyId,
        currency: p.currency || "MYR",
      })),
    });

    return {
      created: created.count,
      total: products.length,
    };
  },
};
