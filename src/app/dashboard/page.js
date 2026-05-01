'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(null);

  async function searchProducts() {
    setLoading(true);
    const res = await fetch(`/api/products/search?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  async function publishToML(product) {
    setPublishing(product.title);
    try {
      const res = await fetch('/api/products/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Produto publicado com sucesso! ID: ' + data.id);
      } else {
        alert('Erro ao publicar: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      alert('Erro na requisição.');
    }
    setPublishing(null);
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Buscar Produtos no AliExpress</h2>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input
          type="text"
          placeholder="Ex: fone de ouvido bluetooth"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', background: '#1e293b', color: 'white', fontSize: '16px' }}
        />
        <button
          onClick={searchProducts}
          disabled={loading}
          style={{ background: '#facc15', color: '#0f172a', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {products.map((p, i) => (
          <div key={i} style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            {p.image && <img src={p.image} alt={p.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />}
            <div style={{ padding: '16px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#e2e8f0' }}>{p.title?.slice(0, 80)}...</p>
              <p style={{ margin: '0 0 4px', color: '#facc15', fontWeight: 'bold' }}>Custo: R$ {p.price?.toFixed(2)}</p>
              <p style={{ margin: '0 0 12px', color: '#4ade80', fontSize: '13px' }}>Venda sugerida: R$ {p.sellingPrice?.toFixed(2)}</p>
              <button
                onClick={() => publishToML(p)}
                disabled={publishing === p.title}
                style={{ width: '100%', background: '#facc15', color: '#0f172a', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', opacity: publishing === p.title ? 0.7 : 1 }}
              >
                {publishing === p.title ? 'Publicando...' : 'Publicar no ML'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
