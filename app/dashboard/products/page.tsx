'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Product = { id: string; title: string; price: number; slug: string; is_active: boolean; created_at: string }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getProducts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      const { data } = await supabase.from('payment_links').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      if (data) setProducts(data)
      setLoading(false)
    }
    getProducts()
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Mes produits</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Gerez vos produits et liens de paiement</p>
        </div>
        <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>+ Creer un produit</button>
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#6B7280' }}>Chargement...</p>
      ) : products.length === 0 ? (
        <div style={{ background: '#111111', borderRadius: '12px', padding: '40px', border: '0.5px solid #1F1F1F', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 16px' }}>Aucun produit cree.</p>
          <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Creer mon premier produit</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {products.map((product) => (
            <div key={product.id} style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '15px', fontWeight: '500', color: '#fff', margin: '0 0 4px' }}>{product.title}</p>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>paylinkafrica.com/p/{product.slug}</p>
                <span style={{ fontSize: '11px', background: product.is_active ? '#10B98118' : '#2a2a2a', color: product.is_active ? '#10B981' : '#6B7280', padding: '2px 8px', borderRadius: '4px' }}>{product.is_active ? 'Actif' : 'Inactif'}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 8px' }}>{product.price.toLocaleString()} FCFA</p>
                <button onClick={() => navigator.clipboard.writeText(`https://paylinkafrica.com/p/${product.slug}`)} style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Copier le lien</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}