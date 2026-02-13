import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    countInStock: { type: Number, required: true, min: 0 },
    category: { type: String, index: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
