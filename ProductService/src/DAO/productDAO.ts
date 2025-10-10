import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

export class ProductDAO {
  /**
   * Create a new product with optional images
   */
  async create(data: {
    title: string;
    description: string;
    category: string;
    price: string | number;
    sku: string;
    quantity: number;
    images: { url: string; publicId: string }[];
  }) {
    return prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price.toString(),
        sku: data.sku,
        quantity: data.quantity ?? 0,
        images:
          data.images && data.images.length > 0
            ? {
              create: data.images.map((img) => ({
                url: img.url,
                publicId: img.publicId,
              })),
            }
            : undefined,
      },
      include: {
        images: true,
      },
    });
  }

  /**
   * Find a single product by ID (includes images)
   */
  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  /**
   * List all products with pagination and optional search query
   */
  async findAll(opts: { skip?: number; take?: number; q?: string } = {}) {
  const { skip = 0, take = 20, q } = opts;

  const where: Prisma.ProductWhereInput = q
    ? {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);
  const currentPage = Math.floor(skip / take) + 1;

  return {
    items,
    total,
    totalPages,
    currentPage,
  };
}


  /**
   * Update product details (optionally replace images)
   */
  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      price: string | number;
      sku: string;
      quantity: number;
      active: boolean;
      images: { url: string; publicId: string }[];
    }>
  ) {
    console.log('Update Data');
    return prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        sku: data.sku,
        quantity: data.quantity,
        active: data.active,
        price: data.price !== undefined ? data.price.toString() : undefined,
        // ✅ Replace existing images if new ones are provided
         images:
        data.images && data.images.length > 0
          ? {
              deleteMany: {}, // remove all existing images
              create: data.images.map((img) => ({
                url: img.url,
                publicId: img.publicId,
              })),
            }
          : undefined,
    },
      include: { images: true },
    });
  }

  /**
   * Delete a product (and cascade delete its images)
   */
  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
      include: { images: true },
    });
  }

  /**
   * Adjust product quantity (inside a transaction)
   */
  async adjustQuantity(id: string, amount: number) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) {
        const e: any = new Error('Product not found');
        e.status = 404;
        throw e;
      }

      const newQuantity = product.quantity + amount;
      if (newQuantity < 0) {
        const e: any = new Error('Insufficient inventory');
        e.status = 409;
        throw e;
      }

      return tx.product.update({
        where: { id },
        data: { quantity: newQuantity },
      });
    });
  }

  async findBySku(sku: string ) {
    return prisma.product.findUnique({
      where: { sku },
    });
  }

}



export const productDAO = new ProductDAO();
