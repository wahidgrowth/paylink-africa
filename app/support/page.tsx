export default function SupportPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', margin: '0 0 12px' }}>Support</h1>
        <p style={{ fontSize: '16px', color: '#6B7280', margin: '0 0 32px' }}>Notre equipe est disponible 7j/7.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#25D366', margin: '0 0 8px' }}>WhatsApp</p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 24px' }}>+229 01 96 XX XX XX</p>
            <a href="https://wa.me/22901960000" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{ width: '100%', background: '#25D366', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>Ouvrir WhatsApp</button>
            </a>
          </div>
          <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#10B981', margin: '0 0 8px' }}>Email</p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 24px' }}>support@paylinkafrica.com</p>
            <a href="mailto:support@paylinkafrica.com" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>Envoyer un email</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}