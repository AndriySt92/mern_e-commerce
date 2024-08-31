import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI as string)

    console.log('MongoDB connected')
  } catch (error: any) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB