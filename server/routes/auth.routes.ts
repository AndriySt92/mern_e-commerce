import express from 'express'
import AuthController from '../controllers/auth.controller'
import { ctrlWrapper } from '../utils/ctrlWrapper'
import { loginValidation, registerValidation } from '../utils/authValidation'
import { authRoute } from '../middlewares/authenticate'

const router = express.Router()

router.post('/register', registerValidation, ctrlWrapper(AuthController.register))
router.post('/login', loginValidation, ctrlWrapper(AuthController.login))
router.post('/logout', ctrlWrapper(AuthController.logout))
router.post('/refresh-token', ctrlWrapper(AuthController.refreshToken))
router.get('/profile', authRoute, ctrlWrapper(AuthController.getProfile))

export default router
