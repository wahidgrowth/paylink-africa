'use client'
export default function LinksPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Mes liens</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Gerez vos liens de paiement</p>
        </div>
        <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>+ Creer un lien</button>
      </div>
      <div style={{ background: '#111111', borderRadius: '12px', padding: '40px', border: '0.5px solid #1F1F1F', textAlign: 'center' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#fff', margin: '0 0 8px' }}>Aucun lien cree</h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 20px' }}>Cree ton premier lien de paiement et commence a vendre.</p>
        <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Creer mon premier lien</button>
      </div>
    </div>
  )
}
