import ProductModel from '../models/product.model'
import UserModel from '../models/user.model'
import OrderModel from '../models/order.model'

export const getAnalyticsData = async () => {
  const totalUsers = await UserModel.countDocuments()
  const totalProducts = await ProductModel.countDocuments()

  const salesData = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
      },
    },
  ])

  const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 }

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  }
}

export const getDailySalesData = async () => {
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

  const dailySalesData = await OrderModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        sales: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const dateArray = getDatesInRange(startDate, endDate)

  return dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date)

    return {
      date,
      sales: foundData?.sales || 0,
      revenue: foundData?.revenue || 0,
    }
  })
}

function getDatesInRange(startDate: Date, endDate: Date) {
  const dates = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

export default {
  getAnalyticsData,
  getDailySalesData,
}
