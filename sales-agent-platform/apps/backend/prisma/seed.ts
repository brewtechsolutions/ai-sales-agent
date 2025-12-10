import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Doe",
      password: await hash("password123"),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      name: "Jane Smith",
      password: await hash("password123"),
    },
  });

  // Create sample products
  await prisma.product.createMany({
    data: [
      {
        name: "Laptop",
        description: "High-performance laptop with latest specs",
        price: 1299.99,
        stock: 10,
        image: "https://example.com/laptop.jpg",
        userId: user1.id,
      },
      {
        name: "Smartphone",
        description: "Latest model with advanced camera system",
        price: 999.99,
        stock: 15,
        image: "https://example.com/smartphone.jpg",
        userId: user1.id,
      },
      {
        name: "Headphones",
        description: "Wireless noise-cancelling headphones",
        price: 299.99,
        stock: 20,
        image: "https://example.com/headphones.jpg",
        userId: user2.id,
      },
      {
        name: "Smartwatch",
        description: "Fitness tracking and notifications",
        price: 199.99,
        stock: 25,
        image: "https://example.com/smartwatch.jpg",
        userId: user2.id,
      },
    ],
  });

  console.log("Database has been seeded! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
