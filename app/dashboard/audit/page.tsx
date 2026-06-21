'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

type Product = { id: string; title: string; description: string; price: number; slug: string }

export default function AuditPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [audit, setAudit] = useState('')
  const [loading, setLoading] = useState(false)
  const [auditUsed, setAuditUsed] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('audit_used').eq('id', user.id).single()
      if (profile?.audit_used) setAuditUsed(true)
      const { data } = await supabase.from('payment_links').select('*').eq('user_id', user.id)
      if (data) setProducts(data)
      setLoadingProducts(false)
    }
    getData()
  }, [])

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
    if (data.error === 'AUDIT_USED') {
      setAuditUsed(true)
    } else {
      setAudit(data.audit)
      setAuditUsed(true)
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Audit IA</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Analyse ta page de vente et recois des recommandations pour augmenter tes conversions</p>
      </div>

      {auditUsed && !audit && (
        <div style={{ background: '#111111', borderRadius: '12px', padding: '32px', border: '0.5px solid #1F1F1F', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', background: '#F59E0B18', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '22px' }}>🔒</div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 8px' }}>Audit gratuit utilise</h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px', lineHeight: '1.6' }}>
            Tu as deja beneficie de ton audit IA gratuit. Passe au plan Pro pour des audits illimites et bien plus encore.
          </p>
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>
              Passer au Pro — 3 500 FCFA/mois
            </button>
          </Link>
        </div>
      )}

      {!auditUsed && (
        <>
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
            <div style={{ background: '#10B98118', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', border: '0.5px solid #10B98140' }}>
              <p style={{ fontSize: '12px', color: '#10B981', margin: 0 }}>Attention : tu ne disposes que d un seul audit gratuit. Utilise-le sur ton meilleur produit.</p>
            </div>
          )}

          <button onClick={runAudit} disabled={loading || !selectedProduct} style={{ width: '100%', background: selectedProduct ? '#10B981' : '#2a2a2a', border: 'none', color: selectedProduct ? '#000' : '#6B7280', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '8px', cursor: selectedProduct ? 'pointer' : 'not-allowed', marginBottom: '16px' }}>
            {loading ? 'Analyse en cours...' : 'Lancer l audit IA gratuit'}
          </button>
        </>
      )}

      {audit && (
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginTop: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 16px' }}>Rapport d audit</h2>
          <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{audit}</div>
          <div style={{ marginTop: '24px', padding: '16px', background: '#0D0D0D', borderRadius: '8px', border: '0.5px solid #1F1F1F', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 12px' }}>Tu veux des audits illimites + stats avancees + retrait prioritaire ?</p>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                Passer au Pro — 3 500 FCFA/mois
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}