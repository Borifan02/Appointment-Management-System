import { Product } from '../models/Product.js';

export async function listProducts(req, res) {
  const { q, category } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
}

export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

export async function createProduct(req, res) {
  const { name, description, image, price, countInStock, category } = req.body;
  const created = await Product.create({
    name,
    description,
    image,
    price,
    countInStock,
    category,
  });
  res.status(201).json(created);
}

export async function updateProduct(req, res) {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
}

export async function deleteProduct(req, res) {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
}
