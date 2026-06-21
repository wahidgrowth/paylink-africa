'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

type Product = { id: string; title: string; description: string; price: number; slug: string }

export default function AuditPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [audit, setAudit] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const supabase = createClient()

  useState(() => {
    const getProducts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('payment_links').select('*').eq('user_id', user.id)
      if (data) setProducts(data)
      setLoadingProducts(false)
    }
    getProducts()
  })

  const runAudit = async () => {
    if (!selectedProduct) return
    setLoading(true)
    setAudit('')

    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: selectedProduct }),
    })

    const data = await response.json()
    setAudit(data.audit)
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Audit IA</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Analyse ta page de vente et recois des recommandations pour augmenter tes conversions</p>
      </div>

      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '12px' }}>Choisis un produit a auditer</label>
        {loadingProducts ? (
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Chargement...</p>
        ) : products.length === 0 ? (
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Aucun produit cree.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {products.map((product) => (
              <div key={product.id} onClick={() => setSelectedProduct(product)} style={{ padding: '14px 16px', borderRadius: '8px', border: selectedProduct?.id === product.id ? '1px solid #10B981' : '0.5px solid #2a2a2a', background: selectedProduct?.id === product.id ? '#10B98110' : '#1A1A1A', cursor: 'pointer' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#fff', margin: '0 0 2px' }}>{product.title}</p>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{product.price.toLocaleString()} FCFA</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <button onClick={runAudit} disabled={loading} style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '8px', cursor: 'pointer', marginBottom: '16px' }}>
          {loading ? 'Analyse en cours...' : 'Lancer l audit IA'}
        </button>
      )}

      {audit && (
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 16px' }}>Rapport d audit</h2>
          <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{audit}</div>
        </div>
      )}
    </div>
  )
}