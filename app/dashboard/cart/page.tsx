'use client'

export default function CartPage() {
  return (
    <div style={{ padding: '32px' }}>
      <style>{`
        @media (max-width: 767px) {
          .cart-wrap { padding: 16px !important; }
          .cart-header-row { display: none !important; }
        }
      `}</style>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Panier</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Suivi des tentatives de paiement en temps réel</p>
      </div>

      <div style={{ background: '#111111', borderRadius: '12px', border: '0.5px solid #1F1F1F', overflow: 'hidden' }}>
        <div className="cart-header-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '0.5px solid #1F1F1F', background: '#0D0D0D' }}>
          {['ACHETEUR', 'TELEPHONE', 'MONTANT', 'STATUT', 'DATE'].map((h, i) => (
            <span key={i} style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500' }}>{h}</span>
          ))}
        </div>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Aucune tentative de paiement pour le moment.</p>
        </div>
      </div>

    </div>
  )
}