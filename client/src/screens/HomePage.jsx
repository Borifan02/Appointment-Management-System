import { useEffect, useState } from 'react';
import http from '../lib/http.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get('/products');
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid">
      {products.map((p) => (
        <a key={p._id} href={`/product/${p._id}`} className="card">
          <img src={p.image || 'https://via.placeholder.com/300x200'} alt={p.name} />
          <div>
            <h3>{p.name}</h3>
            <p>${p.price.toFixed(2)}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
