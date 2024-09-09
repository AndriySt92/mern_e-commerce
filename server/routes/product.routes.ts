import express from 'express'
import ProductController from '../controllers/product.controller'
import { adminRoute, authRoute } from '../middlewares/authenticate'
import { ctrlWrapper } from '../utils/ctrlWrapper'

const router = express.Router()

router.get('/', authRoute, adminRoute, ctrlWrapper(ProductController.getAllProducts))
router.get('/featured', ctrlWrapper(ProductController.getFeaturedProducts))
router.get('/category/:category', ctrlWrapper(ProductController.getProductsByCategory))
router.get('/recommendations', ctrlWrapper(ProductController.getRecommendedProducts))
router.patch('/:id', authRoute, adminRoute, ctrlWrapper(ProductController.toggleFeaturedProduct))
router.post('/', authRoute, adminRoute, ctrlWrapper(ProductController.createProduct))
router.delete('/:id', authRoute, adminRoute, ctrlWrapper(ProductController.removeProduct))

export default router
