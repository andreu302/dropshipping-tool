'use client';

import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Meus Pedidos no Mercado Livre</h2>
      
      {loading ? (
        <p style={{ color: '#94a3b8' }}>Carregando seus pedidos...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>Você ainda não tem vendas registradas.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '13px' }}>Pedido #{order.id} • {new Date(order.date).toLocaleDateString('pt-BR')}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {order.items.map((item, idx) => (
                    <p key={idx} style={{ margin: 0, color: '#e2e8f0', fontSize: '16px', fontWeight: '500' }}>
                      {item.quantity}x {item.title}
                    </p>
                  ))}
                </div>
                <p style={{ margin: '12px 0 0', color: '#facc15', fontSize: '14px' }}>
                  Comprador: <span style={{ color: 'white' }}>{order.buyer.nickname}</span>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 8px', color: '#4ade80', fontSize: '20px', fontWeight: 'bold' }}>
                  R$ {order.total_amount.toFixed(2)}
                </p>
                <span style={{ display: 'inline-block', background: '#334155', color: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                  Status: {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
