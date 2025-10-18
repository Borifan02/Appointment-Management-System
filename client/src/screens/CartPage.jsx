import { useCart } from '../context/CartContext.jsx';

export default function CartPage() {
  const { items, updateQty, removeFromCart, clearCart, totals } = useCart();

  if (!items.length) return <p>Your cart is empty.</p>;

  return (
    <div className="cart">
      {items.map((i) => (
        <div key={i.productId} className="cart-item">
          <img src={i.image || 'https://via.placeholder.com/80'} alt={i.name} />
          <div className="meta">
            <strong>{i.name}</strong>
            <div>${i.price.toFixed(2)}</div>
            <input
              type="number"
              min={1}
              value={i.qty}
              onChange={(e) => updateQty(i.productId, Number(e.target.value))}
            />
            <button onClick={() => removeFromCart(i.productId)}>Remove</button>
          </div>
        </div>
      ))}

      <div className="summary">
        <div>Items: ${totals.itemsPrice.toFixed(2)}</div>
        <div>Shipping: ${totals.shippingPrice.toFixed(2)}</div>
        <div>Tax: ${totals.taxPrice.toFixed(2)}</div>
        <div>
          <strong>Total: ${totals.totalPrice.toFixed(2)}</strong>
        </div>
        <a className="button" href="/checkout">Checkout</a>
        <button onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );
}