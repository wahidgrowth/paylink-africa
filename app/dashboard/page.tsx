'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [firstName, setFirstName] = useState('')
  const [stats, setStats] = useState({ products: 0, revenue: 0, sales: 0, views: 0 })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data: profile } = await supabase.from('profiles').select('first_name').eq('id', user.id).maybeSingle()
      if (profile?.first_name) setFirstName(profile.first_name)

      const { data: products } = await supabase.from('payment_links').select('id, price').eq('user_id', user.id)
      const { data: transactions } = await supabase.from('transactions').select('seller_receives, status').eq('user_id', user.id).eq('status', 'success')

      let totalViews = 0
      if (products && products.length > 0) {
        const ids = products.map(p => p.id)
        const { count } = await supabase.from('views').select('*', { count: 'exact', head: true }).in('link_id', ids)
        totalViews = count || 0
      }

      setStats({
        products: products?.length || 0,
        revenue: transactions?.reduce((sum, t) => sum + t.seller_receives, 0) || 0,
        sales: transactions?.length || 0,
        views: totalViews,
      })
    }
    getData()
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Tableau de bord</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Bienvenue{firstName ? ', ' + firstName : ''} !</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Produits actifs', value: stats.products },
          { label: 'Vues totales', value: stats.views },
          { label: 'Ventes', value: stats.sales },
          { label: 'Revenus', value: stats.revenue.toLocaleString() + ' FCFA' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px' }}>{stat.label}</p>
            <p style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#fff', margin: 0 }}>Mes produits</h2>
          <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>+ Creer un produit</button>
          </Link>
        </div>
        <div style={{ background: '#0D0D0D', borderRadius: '10px', padding: '40px', textAlign: 'center', border: '0.5px dashed #2a2a2a' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 16px' }}>Aucun produit cree pour linstant.</p>
          <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Creer mon premier produit</button>
          </Link>
        </div>
      </div>
    </div>
  )
}