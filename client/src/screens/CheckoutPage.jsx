import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import http from '../lib/http.js';

export default function CheckoutPage() {
  const { items, totals, clearCart } = useCart();
  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await http.post('/orders', {
        orderItems: items.map((i) => ({
          product: i.productId,
          name: i.name,
          qty: i.qty,
          price: i.price,
          image: i.image,
        })),
        shippingAddress: shipping,
        paymentMethod,
      });
      setSuccess(`Order placed: ${data._id}`);
      clearCart();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to place order');
    }
  };

  if (!items.length) return <p>Add items to cart first.</p>;

  return (
    <form onSubmit={placeOrder} className="checkout-form">
      <h2>Checkout</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <input placeholder="Full name" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} />
      <input placeholder="Address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} />
      <input placeholder="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
      <input placeholder="Postal code" value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} />
      <input placeholder="Country" value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />

      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="COD">Cash on Delivery</option>
      </select>

      <div className="summary">
        <div>Items: ${totals.itemsPrice.toFixed(2)}</div>
        <div>Shipping: ${totals.shippingPrice.toFixed(2)}</div>
        <div>Tax: ${totals.taxPrice.toFixed(2)}</div>
        <div><strong>Total: ${totals.totalPrice.toFixed(2)}</strong></div>
      </div>

      <button type="submit">Place order</button>
    </form>
  );
}
