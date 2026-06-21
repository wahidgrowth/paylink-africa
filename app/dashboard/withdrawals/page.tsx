'use client'
export default function WithdrawalsPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Retraits</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Retirez vos revenus vers votre Mobile Money</p>
        </div>
        <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Demander un retrait</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px' }}>Solde disponible</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#10B981', margin: 0 }}>0 FCFA</p>
        </div>
        <div style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px' }}>Total retire</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#fff', margin: 0 }}>0 FCFA</p>
        </div>
      </div>
      <div style={{ background: '#111111', borderRadius: '12px', padding: '40px', border: '0.5px solid #1F1F1F', textAlign: 'center' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#fff', margin: '0 0 8px' }}>Aucun retrait effectue</h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Vos demandes de retrait apparaitront ici.</p>
      </div>
    </div>
  )
}
