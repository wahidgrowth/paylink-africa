'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Transaction = {
  id: string
  seller_receives: number
  created_at: string
  buyer_name: string
}

type Product = {
  id: string
  title: string
  slug: string
  price: number
}

type Stats = {
  totalRevenue: number
  totalSales: number
  totalViews: number
  conversionRate: string
}

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

  useEffect(() => {
    loadData()
  }, [period])

  const getStartDate = () => {
    const days = PERIODS[period].days
    if (days === -1) return null
    if (days === 0) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      return d.toISOString()
    }
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toISOString()
  }

  const loadData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

    const startDate = getStartDate()

    // Produits
    const { data: products } = await supabase
      .from('payment_links')
      .select('id, title, slug, price')
      .eq('user_id', user.id)

    if (!products || products.length === 0) {
      setLoading(false)
      return
    }

    const productIds = products.map((p: Product) => p.id)

    // Transactions
    let txQuery = supabase
      .from('transactions')
      .select('id, seller_receives, created_at, buyer_name')
      .eq('user_id', user.id)
      .eq('status', 'success')
      .order('created_at', { ascending: false })

    if (startDate) txQuery = txQuery.gte('created_at', startDate)
    const { data: txData } = await txQuery

    // Vues
    let viewsQuery = supabase
      .from('views')
      .select('link_id, created_at')
      .in('link_id', productIds)

    if (startDate) viewsQuery = viewsQuery.gte('created_at', startDate)
    const { data: viewsData } = await viewsQuery

    const totalRevenue = txData?.reduce((sum: number, t: Transaction) => sum + t.seller_receives, 0) || 0
    const totalSales = txData?.length || 0
    const totalViews = viewsData?.length || 0
    const conversionRate = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : '0'

    setStats({ totalRevenue, totalSales, totalViews, conversionRate })
    setTransactions(txData || [])

    // Stats par produit
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

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Analytiques</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Performance de tes pages de vente</p>
        </div>
      </div>

      {/* FILTRES PÉRIODE */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {PERIODS.map((p, i) => (
          <button
            key={i}
            onClick={() => setPeriod(i)}
            style={{ background: period === i ? '#10B981' : '#111111', border: `0.5px solid ${period === i ? '#10B981' : '#2a2a2a'}`, color: period === i ? '#000' : '#9CA3AF', fontSize: '13px', fontWeight: period === i ? '700' : '400', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
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

          {/* STATS PRINCIPALES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Revenus', value: stats.totalRevenue.toLocaleString('fr-FR') + ' FCFA', icon: '💰', color: '#10B981' },
              { label: 'Ventes', value: stats.totalSales.toString(), icon: '✅', color: '#10B981' },
              { label: 'Vues totales', value: stats.totalViews.toString(), icon: '👁️', color: '#6B7280' },
              { label: 'Taux de conversion', value: stats.conversionRate + '%', icon: '📈', color: parseFloat(stats.conversionRate) >= 5 ? '#10B981' : '#F59E0B' },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#111111', borderRadius: '12px', padding: '20px 24px', border: '0.5px solid #1F1F1F' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{stat.label}</p>
                  <span style={{ fontSize: '18px' }}>{stat.icon}</span>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {/* Header tableau */}
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
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '4px', background: '#1A1A1A', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(conversionNum * 10, 100)}%`, height: '100%', background: conversionNum >= 5 ? '#10B981' : conversionNum >= 2 ? '#F59E0B' : '#EF4444', borderRadius: '2px', transition: 'width 0.5s' }} />
                          </div>
                          <span style={{ fontSize: '12px', color: conversionNum >= 5 ? '#10B981' : conversionNum >= 2 ? '#F59E0B' : '#EF4444', fontWeight: '600', minWidth: '36px' }}>{conversion}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* DERNIÈRES TRANSACTIONS */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 20px' }}>Dernières transactions</h2>

            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ fontSize: '32px', margin: '0 0 8px' }}>💸</p>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Aucune transaction sur cette période</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', padding: '10px 16px', marginBottom: '4px' }}>
                  {['Client', 'Date', 'Montant'].map((h, i) => (
                    <p key={i} style={{ margin: 0, fontSize: '11px', color: '#444', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</p>
                  ))}
                </div>
                {transactions.map((tx, i) => (
                  <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', padding: '14px 16px', borderRadius: '8px', background: i % 2 === 0 ? '#0D0D0D' : 'transparent', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', background: '#10B98115', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>✓</div>
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