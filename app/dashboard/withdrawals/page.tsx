'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function WithdrawalsPage() {
  const [balance, setBalance] = useState(0)
  const [totalWithdrawn, setTotalWithdrawn] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: transactions } = await supabase
        .from('transactions')
        .select('seller_receives')
        .eq('user_id', user.id)
        .eq('status', 'success')

      const totalEarned = transactions?.reduce((sum, t) => sum + t.seller_receives, 0) || 0
      setBalance(totalEarned)
      setLoading(false)
    }
    getData()
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Retraits</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Retirez vos revenus vers votre Mobile Money</p>
        </div>
        <button
          style={{ background: balance > 0 ? '#10B981' : '#1A1A1A', border: 'none', color: balance > 0 ? '#000' : '#444', fontSize: '13px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', cursor: balance > 0 ? 'pointer' : 'not-allowed' }}
          disabled={balance === 0}
        >
          Demander un retrait
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px' }}>Solde disponible</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#10B981', margin: 0 }}>
            {loading ? '...' : balance.toLocaleString('fr-FR') + ' FCFA'}
          </p>
        </div>
        <div style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px' }}>Total retiré</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: 0 }}>
            {totalWithdrawn.toLocaleString('fr-FR')} FCFA
          </p>
        </div>
      </div>

      {/* INFO */}
      <div style={{ background: '#10B98110', borderRadius: '12px', padding: '16px 20px', border: '0.5px solid #10B98130', marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: '#10B981', margin: 0, lineHeight: '1.6' }}>
          Les retraits seront disponibles dès l'intégration CinetPay. Vos revenus sont en sécurité et seront versés directement sur votre Mobile Money.
        </p>
      </div>

      {/* LISTE RETRAITS */}
      <div style={{ background: '#111111', borderRadius: '12px', padding: '40px', border: '0.5px solid #1F1F1F', textAlign: 'center' }}>
        <p style={{ fontSize: '32px', margin: '0 0 12px' }}>🏦</p>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 8px' }}>Aucun retrait effectué</h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Vos demandes de retrait apparaîtront ici.</p>
      </div>
    </div>
  )
}