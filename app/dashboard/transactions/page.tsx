'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Transaction = {
  id: string
  seller_receives: number
  amount: number
  status: string
  created_at: string
  buyer_name: string
  buyer_phone: string
}

const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const EmptyIcon = () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const RevenueIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const CheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ListIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setTransactions(data || [])
      setLoading(false)
    }
    getData()
  }, [])

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.status === filter)

  const totalRevenue = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.seller_receives, 0)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'success': return { bg: '#10B98120', color: '#10B981', label: 'Réussi' }
      case 'pending': return { bg: '#F59E0B20', color: '#F59E0B', label: 'En attente' }
      case 'failed': return { bg: '#EF444420', color: '#EF4444', label: 'Échoué' }
      default: return { bg: '#1A1A1A', color: '#6B7280', label: status }
    }
  }

  return (
    <div>

      {/* HEADER */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Transactions</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Historique de tous tes paiements reçus</p>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total encaissé', value: totalRevenue.toLocaleString('fr-FR') + ' FCFA', color: '#10B981', icon: <RevenueIcon /> },
          { label: 'Transactions réussies', value: transactions.filter(t => t.status === 'success').length.toString(), color: '#10B981', icon: <CheckIcon /> },
          { label: 'Total transactions', value: transactions.length.toString(), color: '#9CA3AF', icon: <ListIcon /> },
        ].map((s, i) => (
          <div key={i} style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{s.label}</p>
              <span style={{ color: s.color, display: 'flex' }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: '22px', fontWeight: '700', color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* FILTRES */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'success', label: 'Réussies' },
          { key: 'pending', label: 'En attente' },
          { key: 'failed', label: 'Échouées' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            style={{ background: filter === f.key ? '#10B981' : '#111111', border: `0.5px solid ${filter === f.key ? '#10B981' : '#2a2a2a'}`, color: filter === f.key ? '#000' : '#9CA3AF', fontSize: '13px', fontWeight: filter === f.key ? '700' : '400', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* LISTE */}
      <div style={{ background: '#111111', borderRadius: '12px', border: '0.5px solid #1F1F1F', overflow: 'hidden' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', padding: '14px 24px', borderBottom: '0.5px solid #1F1F1F' }}>
          {['Client', 'Date', 'Montant', 'Statut'].map((h, i) => (
            <p key={i} style={{ margin: 0, fontSize: '11px', color: '#444', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</p>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><EmptyIcon /></div>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
              {filter === 'all' ? 'Aucune transaction pour le moment' : `Aucune transaction "${filter}"`}
            </p>
          </div>
        ) : (
          filtered.map((tx, i) => {
            const status = getStatusStyle(tx.status)
            return (
              <div
                key={tx.id}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', padding: '16px 24px', borderBottom: i < filtered.length - 1 ? '0.5px solid #1F1F1F' : 'none', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', background: '#10B98115', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
                    <UserIcon />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#fff', fontWeight: '500' }}>{tx.buyer_name || 'Client'}</p>
                    {tx.buyer_phone && <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>{tx.buyer_phone}</p>}
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>
                  {new Date(tx.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#10B981', fontWeight: '700' }}>
                  +{tx.seller_receives.toLocaleString('fr-FR')} FCFA
                </p>
                <div>
                  <span style={{ background: status.bg, color: status.color, fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}>
                    {status.label}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}