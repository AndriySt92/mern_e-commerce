import express from 'express'
import CartController from '../controllers/cart.controller'
import { authRoute } from '../middlewares/authenticate'
import { ctrlWrapper } from '../utils/ctrlWrapper'

const router = express.Router()

router.get('/', authRoute, ctrlWrapper(CartController.getCartProducts))
router.post('/', authRoute, ctrlWrapper(CartController.addToCart))
router.delete('/:id', authRoute, ctrlWrapper(CartController.removeAllFromCart))
router.put('/:id', authRoute, ctrlWrapper(CartController.updateQuantity))

export default router
