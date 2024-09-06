import { body } from 'express-validator'

export const loginValidation = [
  body('email', 'Enter a valid email address').isEmail(),
  body('password', 'Password should contain at least six characters').isLength({ min: 6 }),
]

export const registerValidation = [
  body('username', 'Username should contain at least two letters').isLength({ min: 2 }),
  body('email', 'Email address is invalid').isEmail(),
  body('password', 'Password should contain at least six characters').isLength({ min: 6 }),
  body('confirmPassword', 'Confirm password field is required').notEmpty(),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match')
    }
    return true
  }),
]