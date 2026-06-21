'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Transaction = { id: string; seller_receives: number; created_at: string; buyer_name: string }
type Product = { id: string; title: string; slug: string; price: number }
type Stats = { totalRevenue: number; totalSales: number; totalViews: number; conversionRate: string }

const RevenueIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const SalesIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ViewsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const ConversionIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const EmptyIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>

const PERIODS = [
  { label: "Aujourd'hui", days: 0 },
  { label: '7 derniers jours', days: 7 },
  { label: '30 derniers jours', days: 30 },
  { label: 'Tout', days: -1 },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(1)
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalSales: 0, totalViews: 0, conversionRate: '0' })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [productStats, setProductStats] = useState<{ product: Product; views: number; sales: number; revenue: number }[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => { loadData() }, [period])

  const getStartDate = () => {
    const days = PERIODS[period].days
    if (days === -1) return null
    if (days === 0) {
      const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString()
    }
    const d = new Date(); d.setDate(d.getDate() - days); return d.toISOString()
  }

  const loadData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

    const startDate = getStartDate()
    const { data: products } = await supabase.from('payment_links').select('id, title, slug, price').eq('user_id', user.id)

    if (!products || products.length === 0) { setLoading(false); return }

    const productIds = products.map((p: Product) => p.id)

    let txQuery = supabase.from('transactions').select('id, seller_receives, created_at, buyer_name').eq('user_id', user.id).eq('status', 'success').order('created_at', { ascending: false })
    if (startDate) txQuery = txQuery.gte('created_at', startDate)
    const { data: txData } = await txQuery

    let viewsQuery = supabase.from('views').select('link_id, created_at').in('link_id', productIds)
    if (startDate) viewsQuery = viewsQuery.gte('created_at', startDate)
    const { data: viewsData } = await viewsQuery

    const totalRevenue = txData?.reduce((sum: number, t: Transaction) => sum + t.seller_receives, 0) || 0
    const totalSales = txData?.length || 0
    const totalViews = viewsData?.length || 0
    const conversionRate = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : '0'

    setStats({ totalRevenue, totalSales, totalViews, conversionRate })
    setTransactions(txData || [])

    const pStats = products.map((product: Product) => {
      const views = viewsData?.filter((v: { link_id: string }) => v.link_id === product.id).length || 0
      const productTx = txData?.filter((t: Transaction & { link_id?: string }) => t.link_id === product.id) || []
      const sales = productTx.length
      const revenue = productTx.reduce((sum: number, t: Transaction) => sum + t.seller_receives, 0)
      return { product, views, sales, revenue }
    })

    setProductStats(pStats.sort((a: { views: number }, b: { views: number }) => b.views - a.views))
    setLoading(false)
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Analytiques</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Performance de tes pages de vente</p>
      </div>

      {/* FILTRES */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {PERIODS.map((p, i) => (
          <button key={i} onClick={() => setPeriod(i)} style={{ background: period === i ? '#10B981' : '#111111', border: `0.5px solid ${period === i ? '#10B981' : '#2a2a2a'}`, color: period === i ? '#000' : '#9CA3AF', fontSize: '13px', fontWeight: period === i ? '700' : '400', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Chargement...</p>
        </div>
      ) : (
        <>
          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Revenus', value: stats.totalRevenue.toLocaleString('fr-FR') + ' FCFA', icon: <RevenueIcon />, color: '#10B981' },
              { label: 'Ventes', value: stats.totalSales.toString(), icon: <SalesIcon />, color: '#10B981' },
              { label: 'Vues totales', value: stats.totalViews.toString(), icon: <ViewsIcon />, color: '#6B7280' },
              { label: 'Taux de conversion', value: stats.conversionRate + '%', icon: <ConversionIcon />, color: parseFloat(stats.conversionRate) >= 5 ? '#10B981' : '#F59E0B' },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#111111', borderRadius: '12px', padding: '20px 24px', border: '0.5px solid #1F1F1F' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{stat.label}</p>
                  <span style={{ color: stat.color, display: 'flex' }}>{stat.icon}</span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: '700', color: stat.color, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* PERFORMANCE PAR PRODUIT */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 20px' }}>Performance par produit</h2>
            {productStats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Aucun produit créé</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', gap: '16px', padding: '10px 16px', marginBottom: '4px' }}>
                  {['Produit', 'Vues', 'Ventes', 'Revenus', 'Conversion'].map((h, i) => (
                    <p key={i} style={{ margin: 0, fontSize: '11px', color: '#444', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</p>
                  ))}
                </div>
                {productStats.map(({ product, views, sales, revenue }, i) => {
                  const conversion = views > 0 ? ((sales / views) * 100).toFixed(1) : '0'
                  const conversionNum = parseFloat(conversion)
                  return (
                    <div key={product.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', gap: '16px', padding: '14px 16px', borderRadius: '8px', background: i % 2 === 0 ? '#0D0D0D' : 'transparent', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#fff', fontWeight: '500' }}>{product.title}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#444', fontFamily: 'monospace' }}>/p/{product.slug}</p>
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF' }}>{views}</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF' }}>{sales}</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#10B981', fontWeight: '600' }}>{revenue.toLocaleString('fr-FR')} FCFA</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '4px', background: '#1A1A1A', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(conversionNum * 10, 100)}%`, height: '100%', background: conversionNum >= 5 ? '#10B981' : conversionNum >= 2 ? '#F59E0B' : '#EF4444', borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '12px', color: conversionNum >= 5 ? '#10B981' : conversionNum >= 2 ? '#F59E0B' : '#EF4444', fontWeight: '600', minWidth: '36px' }}>{conversion}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* TRANSACTIONS */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 20px' }}>Dernières transactions</h2>
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><EmptyIcon /></div>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Aucune transaction sur cette période</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', padding: '10px 16px', marginBottom: '4px' }}>
                  {['Client', 'Date', 'Montant'].map((h, i) => (
                    <p key={i} style={{ margin: 0, fontSize: '11px', color: '#444', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</p>
                  ))}
                </div>
                {transactions.map((tx, i) => (
                  <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', padding: '14px 16px', borderRadius: '8px', background: i % 2 === 0 ? '#0D0D0D' : 'transparent', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', background: '#10B98115', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
                        <UserIcon />
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: '500' }}>{tx.buyer_name || 'Client'}</p>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>{new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#10B981', fontWeight: '700' }}>+{tx.seller_receives.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}