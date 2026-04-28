export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#1e293b', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px', color: '#facc15' }}>🛒 Dropshipping Tool</h1>
        <a href="/api/auth/login" style={{ background: '#facc15', color: '#0f172a', padding: '8px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Conectar Mercado Livre
        </a>
      </nav>
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Automatize seu Dropshipping</h2>
        <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '40px' }}>
          Busque produtos no AliExpress, calcule margens e publique automaticamente no Mercado Livre.
        </p>
        <a href="/api/auth/login" style={{ background: '#facc15', color: '#0f172a', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
          Começar agora
        </a>
      </div>
    </main>
  );
}
