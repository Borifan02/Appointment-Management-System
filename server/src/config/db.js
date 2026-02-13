import mongoose from 'mongoose';

export async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_shop';

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}
