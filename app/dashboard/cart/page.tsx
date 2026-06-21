'use client'
export default function CartPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Panier</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Suivi des tentatives de paiement en temps reel</p>
      </div>
      <div style={{ background: '#111111', borderRadius: '12px', border: '0.5px solid #1F1F1F', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '0.5px solid #1F1F1F', background: '#0D0D0D' }}>
          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500' }}>ACHETEUR</span>
          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500' }}>TELEPHONE</span>
          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500' }}>MONTANT</span>
          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500' }}>STATUT</span>
          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500' }}>DATE</span>
        </div>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Aucune tentative de paiement pour le moment.</p>
        </div>
      </div>
    </div>
  )
}
