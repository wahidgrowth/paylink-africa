'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

const BankIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="12" y1="10" x2="12" y2="21"/><line x1="7" y1="10" x2="7" y2="21"/><line x1="17" y1="10" x2="17" y2="21"/></svg>

export default function WithdrawalsPage() {
  const [balance, setBalance] = useState(0)
  const [totalWithdrawn] = useState(0)
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
    <div style={{ padding: '32px' }}>
      <style>{`
        @media (max-width: 767px) {
          .wd-wrap { padding: 16px !important; }
          .wd-header { flex-direction: column !important; gap: 12px !important; }
          .wd-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* HEADER */}
      <div className="wd-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Retraits</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Retirez vos revenus vers votre Mobile Money</p>
        </div>
        <button
          style={{ background: balance > 0 ? '#10B981' : '#1A1A1A', border: 'none', color: balance > 0 ? '#000' : '#444', fontSize: '13px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', cursor: balance > 0 ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}
          disabled={balance === 0}
        >
          Demander un retrait
        </button>
      </div>

      {/* STATS */}
      <div className="wd-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
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

      {/* LISTE VIDE */}
      <div style={{ background: '#111111', borderRadius: '12px', padding: '40px', border: '0.5px solid #1F1F1F', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><BankIcon /></div>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 8px' }}>Aucun retrait effectué</h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Vos demandes de retrait apparaîtront ici.</p>
      </div>

    </div>
  )
}