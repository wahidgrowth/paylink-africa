'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 50)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setSlug(generateSlug(e.target.value))
  }

  const fee = price ? Math.round(parseInt(price) * 0.01) : 0
  const sellerReceives = price ? parseInt(price) - fee : 0

  const handleSubmit = async () => {
    if (!title || !price || !slug) { setMessage('Titre, prix et slug sont obligatoires'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }
    const { error } = await supabase.from('payment_links').insert({ user_id: user.id, title, description, price: parseInt(price), slug })
    if (error) { setMessage(error.message) } else { router.push('/dashboard/products') }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Creer un produit</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Configure ton lien de paiement</p>
      </div>
      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '16px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Titre *</label>
          <input type="text" value={title} onChange={handleTitleChange} placeholder="Ex: Formation Marketing Digital" style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Decris ton produit..." rows={3} style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box', resize: 'none' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Prix (FCFA) *</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 25000" style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Slug (URL) *</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#1A1A1A', borderRadius: '8px', border: '0.5px solid #2a2a2a', padding: '12px 16px' }}>
            <span style={{ color: '#6B7280', fontSize: '14px' }}>paylinkafrica.com/p/</span>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} style={{ flex: 1, background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '14px' }} />
          </div>
        </div>
        {price && (
          <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '16px', border: '0.5px solid #1F1F1F' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>Prix de vente</span>
              <span style={{ fontSize: '13px', color: '#fff' }}>{parseInt(price).toLocaleString()} FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>Frais PayLink (1%)</span>
              <span style={{ fontSize: '13px', color: '#F59E0B' }}>-{fee.toLocaleString()} FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '0.5px solid #1F1F1F' }}>
              <span style={{ fontSize: '13px', color: '#10B981', fontWeight: '500' }}>Tu recois</span>
              <span style={{ fontSize: '13px', color: '#10B981', fontWeight: '600' }}>{sellerReceives.toLocaleString()} FCFA</span>
            </div>
          </div>
        )}
      </div>
      {message && <p style={{ color: '#F59E0B', fontSize: '13px', marginBottom: '16px' }}>{message}</p>}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => router.back()} style={{ flex: 1, background: 'transparent', border: '0.5px solid #2a2a2a', color: '#9CA3AF', fontSize: '14px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Annuler</button>
        <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '600', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>{loading ? 'Creation...' : 'Creer le produit'}</button>
      </div>
    </div>
  )
}