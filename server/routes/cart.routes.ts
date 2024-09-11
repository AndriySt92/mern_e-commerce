import express from 'express'
import CartService from '../controllers/cart.controller'
import { authRoute } from '../middlewares/authenticate'
import { ctrlWrapper } from '../utils/ctrlWrapper'

const router = express.Router()

router.get('/', authRoute, ctrlWrapper(CartService.getCartProducts))
router.post('/', authRoute, ctrlWrapper(CartService.addToCart))
router.delete('/:id', authRoute, ctrlWrapper(CartService.removeAllFromCart))
router.put('/:id', authRoute, ctrlWrapper(CartService.updateQuantity))

export default router
