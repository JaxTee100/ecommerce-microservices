import { productDAO } from '../DAO/productDAO';
import { validateCreateProduct, validateUpdateProduct } from '../utils/validation';

export class ProductService {
  /**
   * Create a new product
   */
  async createProduct(data: {
    title: string;
    description: string;
    category: string;
    price: number;
    sku: string;
    quantity: number;
    images: { url: string; publicId: string }[];
  }) {
    const { error } = validateCreateProduct(data);
    if (error) {
      throw { status: 400, message: error.details[0].message };
    }
    const existing = await productDAO.findBySku(data.sku);
    if (existing) {
      throw { status: 400, message: `SKU "${data.sku}" already exists` };
    }

    const product = await productDAO.create(data);
    return product;
  }

  /**
   * Get a single product by ID
   */
  async getProductById(id: string) {
    if (!id) throw new Error('Product ID is required');
    const product = await productDAO.findById(id);
    if (!product) {
      const e: any = new Error('Product not found');
      e.status = 404;
      throw e;
    }
    return product;
  }

  /**
   * List products with pagination and search
   */
  async listProducts(opts: { skip?: number; take?: number; q?: string } = {}) {
    return productDAO.findAll(opts);
  }

  /**
   * Update a product
   */
  async updateProduct(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      category: string;
      price: number;
      sku: string;
      quantity: number;
      active: boolean;
      images: { url: string; publicId: string }[];
    }>
  ) {
    console.log('Update Data:', data);
    const { error } = validateUpdateProduct(data);
    if (error) {
      throw { status: 400, message: error.details[0].message };
    }
    if (!id) throw new Error('Product ID is required');

    const existing = await productDAO.findById(id);
    if (!existing) {
      const e: any = new Error('Product not found');
      e.status = 404;
      throw e;
    }
    if (data.sku) {
      const existingSku = await productDAO.findBySku(data.sku);
      if (existingSku && existingSku.id !== id) {
        throw { status: 400, message: `SKU "${data.sku}" already exists` };
      }
    }

    const updated = await productDAO.update(id, data);
    return updated;
  }

  /**
   * Delete a product by ID
   */
  async deleteProduct(id: string) {
    if (!id) throw new Error('Product ID is required');
    const existing = await productDAO.findById(id);
    if (!existing) {
      const e: any = new Error('Product not found');
      e.status = 404;
      throw e;
    }

    return productDAO.delete(id);
  }

  /**
   * Adjust stock quantity (+/-)
   */
  async adjustQuantity(id: string, amount: number) {
    if (!id) throw new Error('Product ID is required');
    if (typeof amount !== 'number') throw new Error('Amount must be a number');

    return productDAO.adjustQuantity(id, amount);
  }
}

export const productService = new ProductService();
