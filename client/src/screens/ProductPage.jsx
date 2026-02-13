import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../lib/http.js';
import { useCart } from '../context/CartContext.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get(`/products/${id}`);
        setProduct(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Not found</p>;

  return (
    <div className="product-detail">
      <img src={product.image || 'https://via.placeholder.com/400x300'} alt={product.name} />
      <div className="info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p><strong>${product.price.toFixed(2)}</strong></p>
        <button onClick={() => addToCart(product, 1)}>Add to Cart</button>
      </div>
    </div>
  );
}
