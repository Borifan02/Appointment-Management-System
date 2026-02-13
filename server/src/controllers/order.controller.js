import { Order } from '../models/Order.js';

export async function createOrder(req, res) {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (!orderItems?.length) {
    return res.status(400).json({ message: 'No order items' });
  }

  const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  res.status(201).json(order);
}

export async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
}

export async function getOrderById(req, res) {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
}
