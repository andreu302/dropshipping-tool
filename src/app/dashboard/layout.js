export default function DashboardLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#1e293b', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#facc15' }}>🛒 Dropshipping Tool</h1>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="/dashboard" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Buscar Produtos</a>
            <a href="/dashboard/products" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Meus Produtos</a>
            <a href="/dashboard/orders" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Meus Pedidos</a>
          </div>
        </div>
        <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: 'bold' }}>● Conectado</span>
      </nav>
      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
        {children}
      </main>
    </div>
  );
}
