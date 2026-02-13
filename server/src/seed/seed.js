import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectToDatabase } from '../config/db.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seed() {
  await connectToDatabase();

  const adminEmail = 'admin@example.com';
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: adminEmail, passwordHash, role: 'admin' });
    console.log('Admin user created: admin@example.com / admin123');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Sample Shirt', description: 'Comfortable cotton shirt', image: '', price: 29.99, countInStock: 25, category: 'Apparel' },
      { name: 'Running Shoes', description: 'Lightweight sneakers for daily run', image: '', price: 79.99, countInStock: 15, category: 'Footwear' },
      { name: 'Wireless Headphones', description: 'Noise-cancelling over-ear', image: '', price: 129.99, countInStock: 10, category: 'Electronics' },
    ]);
    console.log('Inserted sample products');
  } else {
    console.log('Products already exist, skipping');
  }

  await mongoose.disconnect();
  console.log('Seeding complete');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
