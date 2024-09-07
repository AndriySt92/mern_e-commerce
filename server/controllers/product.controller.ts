import { Request, Response } from 'express'
import ProductService from '../services/product.service'

const createProduct = async (req: Request, res: Response) => {
  const product = await ProductService.create(req.body)
  res.json(product)
}

const removeProduct = async (req: Request, res: Response) => {
  await ProductService.remove(req.params.id)
  res.json({ message: 'Product deleted successfully' })
}

const getAllProducts = async (req: Request, res: Response) => {
  const products = await ProductService.getAll()
  res.json({ products })
}

const getProductsByCategory = async (req: Request, res: Response) => {
    const products = await ProductService.getByCategory(req.params.category);
    res.json({ products });
}

const getFeaturedProducts = async (req: Request, res: Response) => {}
const getRecommendedProducts = async (req: Request, res: Response) => {}
const toggleFeaturedProduct = async (req: Request, res: Response) => {}

export default {
  createProduct,
  removeProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
}
