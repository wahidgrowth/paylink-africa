'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function EditProductPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [slug, setSlug] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const productId = params.id as string

  useEffect(() => {
    const getProduct = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data, error } = await supabase
        .from('payment_links')
        .select('*')
        .eq('id', productId)
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        router.push('/dashboard/products')
        return
      }

      setTitle(data.title || '')
      setDescription(data.description || '')
      setPrice(data.price?.toString() || '')
      setSlug(data.slug || '')
      setExistingImageUrl(data.image_url || null)
      setImagePreview(data.image_url || null)
      setFetching(false)
    }
    getProduct()
  }, [productId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const fee = price ? Math.round(parseInt(price) * 0.01) : 0
  const sellerReceives = price ? parseInt(price) - fee : 0

  const handleSubmit = async () => {
    if (!title || !price || !slug) {
      setMessage('Titre, prix et slug sont obligatoires')
      return
    }
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

    let image_url = existingImageUrl

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `${user.id}/${slug}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, imageFile, { upsert: true })

      if (uploadError) {
        setMessage('Erreur upload image : ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(path)
      image_url = urlData.publicUrl
    }

    const { error } = await supabase
      .from('payment_links')
      .update({ title, description, price: parseInt(price), slug, image_url })
      .eq('id', productId)

    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard/products')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    background: '#1A1A1A',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 16px',
    border: '0.5px solid #2a2a2a',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  }

  if (fetching) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '600px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Modifier le produit</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Mets à jour les informations de ta page de vente</p>
      </div>

      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* IMAGE */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Image du produit</label>
          <div
            onClick={() => document.getElementById('image-input')?.click()}
            style={{ width: '100%', height: '180px', background: '#1A1A1A', borderRadius: '10px', border: '0.5px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '28px', margin: '0 0 8px' }}>📷</p>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 4px' }}>Clique pour ajouter une image</p>
                <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>JPG, PNG — max 5MB</p>
              </div>
            )}
            {imagePreview && (
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#000000AA', borderRadius: '6px', padding: '4px 10px' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#fff' }}>Changer l'image</p>
              </div>
            )}
          </div>
          <input id="image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </div>

        {/* TITRE */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Titre *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Formation Marketing Digital" style={inputStyle} />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décris ton produit..." rows={4} style={{ ...inputStyle, resize: 'none' }} />
        </div>

        {/* PRIX */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Prix (FCFA) *</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 25000" style={inputStyle} />
        </div>

        {/* SLUG */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Lien personnalisé *</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#1A1A1A', borderRadius: '8px', border: '0.5px solid #2a2a2a', padding: '12px 16px' }}>
            <span style={{ color: '#6B7280', fontSize: '14px', flexShrink: 0 }}>paylinkafrica.com/p/</span>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} style={{ flex: 1, background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '14px' }} />
          </div>
        </div>

        {/* RÉCAP */}
        {price && parseInt(price) > 0 && (
          <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '16px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Récapitulatif</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>Prix de vente</span>
              <span style={{ fontSize: '13px', color: '#fff' }}>{parseInt(price).toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>Commission PayLink (1%)</span>
              <span style={{ fontSize: '13px', color: '#F59E0B' }}>-{fee.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '0.5px solid #1F1F1F' }}>
              <span style={{ fontSize: '13px', color: '#10B981', fontWeight: '600' }}>Tu reçois</span>
              <span style={{ fontSize: '14px', color: '#10B981', fontWeight: '700' }}>{sellerReceives.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        )}

      </div>

      {message && (
        <div style={{ background: '#EF444415', border: '0.5px solid #EF444440', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
          <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{message}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => router.back()} style={{ flex: 1, background: 'transparent', border: '0.5px solid #2a2a2a', color: '#9CA3AF', fontSize: '14px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
          Annuler
        </button>
        <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, background: loading ? '#059669' : '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications →'}
        </button>
      </div>

    </div>
  )
}