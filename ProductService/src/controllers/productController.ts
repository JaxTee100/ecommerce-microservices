import { Request, Response } from 'express';
import fs from 'fs';
import { productService } from '../services/productService';
import cloudinary from '../config/cloudinary';
import { logger } from '../utils/logger';

/**
 * Create a new product
 */
export async function create(req: Request, res: Response) {
  try {
    const { title, description, category, price, sku, quantity } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    const numericPrice = Number(price);
    const numericQuantity = quantity ? Number(quantity) : 0;

    if (!title || price === undefined) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    // Upload images (if any)
    const uploadResults = files
      ? await Promise.all(
        files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: 'products',
          })
        )
      )
      : [];

    const imageData =
      uploadResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      })) ?? [];

    // Pass images into the service
    const product = await productService.createProduct({
      title,
      description,
      category,
      price: numericPrice,
      sku,
      quantity: numericQuantity,
      images: imageData,
    });

    if (files) {
      files.forEach((file) => {
        if (file?.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(201).json(product);
  } catch (err: any) {
    console.error('❌ Create Product Error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
}

/**
 * Get a single product by ID
 */
export async function getOne(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.json(product);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

/**
 * List products with pagination and search
 */
export async function list(req: Request, res: Response) {
  try {
    const q = req.query.q as string | undefined;
    const skip = parseInt((req.query.skip as string) ?? '0', 10);
    const take = parseInt((req.query.take as string) ?? '20', 10);

    const result = await productService.listProducts({ q, skip, take });
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

/**
 * Update a product (supports optional image upload)
 */
export async function update(req: Request, res: Response) {
  try {
    
    const { id } = req.params;
    const body = req.body;
    console.log('Body:', body);
    const files = req.files as Express.Multer.File[] | undefined;

    let imageData: { url: string; publicId: string }[] | undefined;

    if (files && files.length > 0) {
      const uploadResults = await Promise.all(
        files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: 'products',
          })
        )
      );
      imageData = uploadResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    const updated = await productService.updateProduct(id, {
      ...body,
      ...(imageData ? { images: imageData } : {}),
    });

    res.json(updated);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

/**
 * Adjust product quantity
 */
export async function adjust(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number') {
      return res.status(400).json({ error: 'Amount must be a number' });
    }

    const updated = await productService.adjustQuantity(id, amount);
    res.json(updated);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

/**
 * Delete a product
 */
export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
