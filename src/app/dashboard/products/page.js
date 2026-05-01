'use client';

import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products/my-listings');
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Meus Produtos no Mercado Livre</h2>
      
      {loading ? (
        <p style={{ color: '#94a3b8' }}>Carregando seus anúncios...</p>
      ) : products.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>Você ainda não tem produtos publicados.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {products.map((p) => (
            <div key={p.id} style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, background: '#4ade80', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                Ativo
              </div>
              {p.image && <img src={p.image} alt={p.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />}
              <div style={{ padding: '16px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#e2e8f0' }}>{p.title}</p>
                <p style={{ margin: '0 0 12px', color: '#facc15', fontWeight: 'bold', fontSize: '18px' }}>R$ {p.price.toFixed(2)}</p>
                <p style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: '13px' }}>Estoque: {p.available_quantity}</p>
                <a
                  href={p.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', width: '100%', background: '#334155', color: '#facc15', padding: '8px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Ver no ML
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
