import ProductModel from '../models/product.model'
import { httpError } from '../utils/httpError'
import { IProduct } from '../interfaces/productInterfaces'
import cloudinary from '../config/cloudinary'
import { redis } from '../config/redis'

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

const getRandom = async () => {
  const randomProducts = await ProductModel.aggregate([
    {
      $sample: { size: 4 },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        price: 1,
      },
    },
  ])

  return randomProducts
}

const toggleFeatured = async (productId: string) => {
  const product = await ProductModel.findById(productId)

  if (product) {
    product.isFeatured = !product.isFeatured
    const updatedProduct = await product.save()

    const featuredProducts = await ProductModel.find({ isFeatured: true }).lean()
    await redis.set('featured_products', JSON.stringify(featuredProducts))

    return updatedProduct
  } else {
    throw httpError({ status: 404, message: 'Product not found' })
  }
}

const getFeatured = async () => {
  let featuredProducts = await redis.get('featured_products')

  if (featuredProducts) {
    return JSON.parse(featuredProducts) as IProduct[]
  }

  const products = await ProductModel.find({ isFeatured: true }).lean<IProduct[]>()
  console.log(products)
  if (!products || products.length === 0) {
    throw httpError({ status: 404, message: 'No featured products found' })
  }

  await redis.set('featured_products', JSON.stringify(products))

  return products
}

export default {
  create,
  getAll,
  remove,
  getByCategory,
  getRandom,
  toggleFeatured,
  getFeatured,
}
