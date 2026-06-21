'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Transaction = { seller_receives: number; status: string; created_at: string; buyer_name?: string }
type Product = { id: string; price: number; title: string; slug: string }

export default function Dashboard() {
  const [firstName, setFirstName] = useState('')
  const [stats, setStats] = useState({ products: 0, revenue: 0, sales: 0, views: 0 })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data: profile } = await supabase.from('profiles').select('first_name').eq('id', user.id).maybeSingle()
      if (profile?.first_name) setFirstName(profile.first_name)

      const { data: productData } = await supabase.from('payment_links').select('id, price, title, slug').eq('user_id', user.id)
      const { data: txData } = await supabase.from('transactions').select('seller_receives, status, created_at, buyer_name').eq('user_id', user.id).eq('status', 'success').order('created_at', { ascending: false }).limit(5)

      let totalViews = 0
      if (productData && productData.length > 0) {
        const ids = productData.map((p: Product) => p.id)
        const { count } = await supabase.from('views').select('*', { count: 'exact', head: true }).in('link_id', ids)
        totalViews = count || 0
      }

      const totalRevenue = txData?.reduce((sum: number, t: Transaction) => sum + t.seller_receives, 0) || 0

      setProducts(productData || [])
      setTransactions(txData || [])
      setStats({
        products: productData?.length || 0,
        revenue: totalRevenue,
        sales: txData?.length || 0,
        views: totalViews,
      })
      setLoading(false)
    }
    getData()
  }, [])

  const conversionRate = stats.views > 0 ? ((stats.sales / stats.views) * 100).toFixed(1) : '0'

  const getHour = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>Chargement...</p>
    </div>
  )

  return (
    <div>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>
            {getHour()}{firstName ? ', ' + firstName : ''} 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
            + Nouveau produit
          </button>
        </Link>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Revenus totaux', value: stats.revenue.toLocaleString('fr-FR') + ' FCFA', icon: '💰', color: '#10B981' },
          { label: 'Ventes réussies', value: stats.sales.toString(), icon: '✅', color: '#10B981' },
          { label: 'Vues totales', value: stats.views.toString(), icon: '👁️', color: '#6B7280' },
          { label: 'Taux de conversion', value: conversionRate + '%', icon: '📈', color: conversionRate >= '5' ? '#10B981' : '#F59E0B' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#111111', borderRadius: '12px', padding: '20px 24px', border: '0.5px solid #1F1F1F' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{stat.label}</p>
              <span style={{ fontSize: '18px' }}>{stat.icon}</span>
            </div>
            <p style={{ fontSize: '24px', fontWeight: '700', color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ACTIONS RAPIDES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Créer un produit', desc: 'Nouvelle page de vente', href: '/dashboard/products/new', icon: '➕', primary: true },
          { label: 'Voir mes produits', desc: stats.products + ' produit(s) actif(s)', href: '/dashboard/links', icon: '🔗', primary: false },
          { label: 'Audit IA', desc: 'Optimiser mes conversions', href: '/dashboard/audit', icon: '🤖', primary: false },
        ].map((action) => (
          <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: action.primary ? '#10B98115' : '#111111', borderRadius: '12px', padding: '16px 20px', border: `0.5px solid ${action.primary ? '#10B98140' : '#1F1F1F'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '22px' }}>{action.icon}</span>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: action.primary ? '#10B981' : '#fff' }}>{action.label}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{action.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* DERNIÈRES TRANSACTIONS + PRODUITS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Dernières transactions */}
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: 0 }}>Dernières ventes</h2>
            <Link href="/dashboard/transactions" style={{ textDecoration: 'none', fontSize: '12px', color: '#10B981' }}>Voir tout →</Link>
          </div>
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontSize: '32px', margin: '0 0 8px' }}>💸</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Tes premières ventes apparaîtront ici</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions.map((tx, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < transactions.length - 1 ? '0.5px solid #1F1F1F' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#10B98115', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</div>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#fff', fontWeight: '500' }}>{tx.buyer_name || 'Client'}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>{new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#10B981' }}>+{tx.seller_receives.toLocaleString('fr-FR')} FCFA</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mes produits */}
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: 0 }}>Mes produits</h2>
            <Link href="/dashboard/links" style={{ textDecoration: 'none', fontSize: '12px', color: '#10B981' }}>Voir tout →</Link>
          </div>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontSize: '32px', margin: '0 0 8px' }}>🛍️</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px' }}>Aucun produit créé pour l'instant</p>
              <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '12px', fontWeight: '700', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Créer mon premier produit</button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {products.slice(0, 4).map((product, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < Math.min(products.length, 4) - 1 ? '0.5px solid #1F1F1F' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#1A1A1A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🔗</div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: '500' }}>{product.title}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{product.price.toLocaleString('fr-FR')} FCFA</p>
                    <Link href={`/p/${product.slug}`} target="_blank" style={{ textDecoration: 'none', fontSize: '11px', color: '#10B981', background: '#10B98115', padding: '3px 8px', borderRadius: '4px' }}>↗</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}