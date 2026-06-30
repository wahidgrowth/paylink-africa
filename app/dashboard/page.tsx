'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Transaction = { seller_receives: number; status: string; created_at: string; buyer_name?: string }
type Product = { id: string; price: number; title: string; slug: string }

const RevenueIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const SalesIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ViewsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const ConversionIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
const AuditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const ProductIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>

const DEMO_TRANSACTIONS: Transaction[] = [
  { buyer_name: 'Kossi Adjavon', seller_receives: 24750, status: 'success', created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { buyer_name: 'Aïcha Diallo', seller_receives: 14850, status: 'success', created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { buyer_name: 'Moussa Koné', seller_receives: 49500, status: 'success', created_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString() },
  { buyer_name: 'Fatou Sow', seller_receives: 9900, status: 'success', created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() },
  { buyer_name: 'Ibrahim Touré', seller_receives: 29700, status: 'success', created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString() },
]

const DEMO_PRODUCTS: Product[] = [
  { id: 'demo-1', title: 'Formation Marketing Digital', price: 25000, slug: 'formation-marketing-digital' },
  { id: 'demo-2', title: 'Pack Templates Canva', price: 10000, slug: 'pack-templates-canva' },
  { id: 'demo-3', title: 'Coaching Business 1-on-1', price: 50000, slug: 'coaching-business' },
  { id: 'demo-4', title: 'Ebook Réussir sur Instagram', price: 5000, slug: 'ebook-instagram' },
]

export default function Dashboard() {
  const [firstName, setFirstName] = useState('')
  const [stats, setStats] = useState({ products: 4, revenue: 3555000, sales: 237, views: 3590 })
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS)
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      const { data: profile } = await supabase.from('profiles').select('first_name').eq('id', user.id).maybeSingle()
      if (profile?.first_name) setFirstName(profile.first_name)
    }
    getData()
  }, [])

  const conversionRate = '6.6'

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
    <div style={{ padding: '32px' }}>
      <style>{`
        @media (max-width: 767px) {
          .dash-wrap { padding: 16px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .actions-grid { grid-template-columns: 1fr !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
          .dash-header { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>

      {/* HEADER */}
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>
            {getHour()}{firstName ? ', ' + firstName : ''}
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Nouveau produit
          </button>
        </Link>
      </div>

      {/* STATS */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Revenus totaux', value: stats.revenue.toLocaleString('fr-FR') + ' FCFA', icon: <RevenueIcon />, color: '#10B981' },
          { label: 'Ventes réussies', value: stats.sales.toString(), icon: <SalesIcon />, color: '#10B981' },
          { label: 'Vues totales', value: stats.views.toLocaleString('fr-FR'), icon: <ViewsIcon />, color: '#6B7280' },
          { label: 'Taux de conversion', value: conversionRate + '%', icon: <ConversionIcon />, color: '#10B981' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#111111', borderRadius: '12px', padding: '20px 16px', border: '0.5px solid #1F1F1F' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{stat.label}</p>
              <span style={{ color: stat.color, display: 'flex' }}>{stat.icon}</span>
            </div>
            <p style={{ fontSize: '22px', fontWeight: '700', color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ACTIONS RAPIDES */}
      <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Créer un produit', desc: 'Nouvelle page de vente', href: '/dashboard/products/new', icon: <PlusIcon />, primary: true },
          { label: 'Voir mes produits', desc: stats.products + ' produit(s) actif(s)', href: '/dashboard/products', icon: <LinkIcon />, primary: false },
          { label: 'Audit IA', desc: 'Optimiser mes conversions', href: '/dashboard/audit', icon: <AuditIcon />, primary: false },
        ].map((action) => (
          <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: action.primary ? '#10B98115' : '#111111', borderRadius: '12px', padding: '16px', border: `0.5px solid ${action.primary ? '#10B98140' : '#1F1F1F'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: action.primary ? '#10B981' : '#6B7280', display: 'flex', alignItems: 'center', width: '32px', height: '32px', background: action.primary ? '#10B98125' : '#1A1A1A', borderRadius: '8px', justifyContent: 'center', flexShrink: 0 }}>{action.icon}</span>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: action.primary ? '#10B981' : '#fff' }}>{action.label}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{action.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* DERNIÈRES TRANSACTIONS + PRODUITS */}
      <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: 0 }}>Dernières ventes</h2>
            <Link href="/dashboard/transactions" style={{ textDecoration: 'none', fontSize: '12px', color: '#10B981' }}>Voir tout →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map((tx, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < transactions.length - 1 ? '0.5px solid #1F1F1F' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', background: '#10B98115', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                    <SalesIcon />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#fff', fontWeight: '500' }}>{tx.buyer_name || 'Client'}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>{new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#10B981' }}>+{tx.seller_receives.toLocaleString('fr-FR')} FCFA</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: 0 }}>Mes produits</h2>
            <Link href="/dashboard/products" style={{ textDecoration: 'none', fontSize: '12px', color: '#10B981' }}>Voir tout →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.slice(0, 4).map((product, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < Math.min(products.length, 4) - 1 ? '0.5px solid #1F1F1F' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', background: '#1A1A1A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                    <ProductIcon />
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: '500' }}>{product.title}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{product.price.toLocaleString('fr-FR')} FCFA</p>
                  <Link href={`/p/${product.slug}`} target="_blank" style={{ textDecoration: 'none', fontSize: '11px', color: '#10B981', background: '#10B98115', padding: '3px 8px', borderRadius: '4px' }}>↗</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}