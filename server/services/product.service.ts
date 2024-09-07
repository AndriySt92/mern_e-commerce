import ProductModel from '../models/product.model'
import { httpError } from '../utils/httpError'
import { IProduct } from '../interfaces/productInterfaces'
import cloudinary from '../config/cloudinary'

const create = async (productData: Omit<IProduct, 'isFeatured'>) => {
  const { name, description, image, price, category } = productData

  let cloudinaryResponse = null

  if (image) {
    cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: 'products' })
  }

  const newProduct = await ProductModel.create({
    name,
    description,
    price,
    image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : '',
    category,
  })

  return newProduct
}

const getAll = async () => {
  return await ProductModel.find({})
}

const remove = async (productId: string) => {
  const product = await ProductModel.findById(productId)

  if (!product) {
    throw httpError({ status: 404, message: 'Product not found' })
  }

  if (product.image) {
    const publicId = product.image?.split('/')?.pop()?.split('.')[0]
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`)
        console.log('deleted image from Cloudinary')
      } catch (error) {
        console.log('error deleting image from Cloudinary', error)
      }
    }
  }

  await ProductModel.findByIdAndDelete(productId)
  return
}

const getByCategory = async (category: string) => {
  const products = await ProductModel.find({ category })
  return products
}

export default {
  create,
  getAll,
  remove,
  getByCategory,
}
