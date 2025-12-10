import { prisma } from "../../prisma";
import { CreateProductInput, UpdateProductInput } from "./schemas";

interface GetAllInput {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const productService = {
  create: async (input: CreateProductInput) => {
    return prisma.product.create({
      data: input,
    });
  },

  getAll: async (input: GetAllInput) => {
    const { page, pageSize, sortBy, sortOrder } = input;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        orderBy: sortBy
          ? {
              [sortBy]: sortOrder || "asc",
            }
          : undefined,
        include: {
          user: true,
        },
      }),
      prisma.product.count(),
    ]);

    return {
      items: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  getById: async (id: string) => {
    return prisma.product.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  },

  update: async (input: UpdateProductInput) => {
    const { id, ...data } = input;
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.product.delete({
      where: { id },
    });
  },

  getStats: async () => {
    const [totalProducts, lowStockItems, outOfStockItems, totalValue] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({
          where: {
            stock: {
              lt: 10,
              gt: 0,
            },
          },
        }),
        prisma.product.count({
          where: {
            stock: 0,
          },
        }),
        prisma.product.aggregate({
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
};
