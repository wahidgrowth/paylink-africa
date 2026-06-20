'use client'
export default function TransactionsPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Transactions</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Historique de vos paiements recus</p>
      </div>
      <div style={{ background: '#111111', borderRadius: '12px', padding: '40px', border: '0.5px solid #1F1F1F', textAlign: 'center' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#fff', margin: '0 0 8px' }}>Aucune transaction</h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Vos paiements recus apparaitront ici.</p>
      </div>
    </div>
  )
}
