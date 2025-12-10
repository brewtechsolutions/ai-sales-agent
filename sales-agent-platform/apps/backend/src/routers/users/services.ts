import { prisma } from "../../prisma";
import { CreateUserInput, UpdateUserInput } from "./schemas";
import { hash } from "argon2";

export const userService = {
  create: async (input: CreateUserInput) => {
    input.password = await hash(input.password);
    return prisma.user.create({
      data: input,
    });
  },

  getAll: async () => {
    return prisma.user.findMany({
      include: {
        products: true,
      },
    });
  },

  getById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  },

  update: async (input: UpdateUserInput) => {
    const { id, ...data } = input;
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.user.delete({
      where: { id },
    });
  },
};
