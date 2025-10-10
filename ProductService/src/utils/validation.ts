import Joi from 'joi';
import { title } from 'process';

interface CreateProductData {
    title: string;
    description: string;
    category: string;
    price: number;
    sku: string;
    quantity: number;
    images: { url: string; publicId: string }[];
}
interface UpdateProductData {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    sku?: string | null;
    quantity?: number;
    images?: { url: string; publicId: string }[];
}


const validateCreateProduct = (data: CreateProductData) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().max(500).required(),
        category: Joi.string().max(100).required(),
        price: Joi.number().positive().required(),
        sku: Joi.string().max(100).required(),
        quantity: Joi.number().integer().min(0).required(),
        images: Joi.array().items(Joi.object({ url: Joi.string().uri().required(), publicId: Joi.string().required() })).optional()
    });
    return schema.validate(data);
}


const validateUpdateProduct = (data: UpdateProductData) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).optional(),
        description: Joi.string().max(500).optional(),
        category: Joi.string().max(100).optional(),
        price: Joi.number().positive().optional(),
        sku: Joi.string().max(100).optional(),
        quantity: Joi.number().integer().min(0).optional(),
        images: Joi.array().items(Joi.object({ url: Joi.string().uri().required(), publicId: Joi.string().required() })).optional()

    });
    return schema.validate(data);
}
export { validateCreateProduct, validateUpdateProduct };