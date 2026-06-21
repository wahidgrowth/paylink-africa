'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('@/components/RichEditor'), { ssr: false })

export default function NewProductPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [slug, setSlug] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileUpload, setFileUpload] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 50)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setSlug(generateSlug(e.target.value))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileUpload(file)
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

    let image_url = null
    let file_url = null

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
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
      image_url = urlData.publicUrl
    }

    if (fileUpload) {
      const ext = fileUpload.name.split('.').pop()
      const path = `${user.id}/${slug}-file-${Date.now()}.${ext}`
      const { error: fileError } = await supabase.storage
        .from('product-images')
        .upload(path, fileUpload, { upsert: true })
      if (fileError) {
        setMessage('Erreur upload fichier : ' + fileError.message)
        setLoading(false)
        return
      }
      const { data: fileUrlData } = supabase.storage.from('product-images').getPublicUrl(path)
      file_url = fileUrlData.publicUrl
    }

    const { error } = await supabase.from('payment_links').insert({
      user_id: user.id,
      title,
      description,
      content,
      price: parseInt(price),
      original_price: originalPrice ? parseInt(originalPrice) : null,
      slug,
      image_url,
      file_url,
    })

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

  return (
    <div style={{ maxWidth: '700px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Créer un produit</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Configure ta page de vente complète</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* SECTION 1 — Informations de base */}
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Informations de base</p>

          {/* IMAGE */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Image de couverture</label>
            <div
              onClick={() => document.getElementById('image-input')?.click()}
              style={{ width: '100%', height: '200px', background: '#1A1A1A', borderRadius: '10px', border: '0.5px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
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
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Titre du produit *</label>
            <input type="text" value={title} onChange={handleTitleChange} placeholder="Ex: Formation Marketing Digital" style={inputStyle} />
          </div>

          {/* DESCRIPTION COURTE */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Description courte <span style={{ color: '#444' }}>(sous le titre)</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Une phrase qui résume ton produit..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>

          {/* SLUG */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Lien personnalisé *</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#1A1A1A', borderRadius: '8px', border: '0.5px solid #2a2a2a', padding: '12px 16px' }}>
              <span style={{ color: '#6B7280', fontSize: '14px', flexShrink: 0 }}>paylinkafrica.com/p/</span>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} style={{ flex: 1, background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '14px' }} />
            </div>
          </div>
        </div>

        {/* SECTION 2 — Page de vente */}
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Page de vente</p>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px' }}>Écris ici tout ce qui va convaincre ton client d'acheter — titres, arguments, bénéfices, FAQ...</p>
          <RichEditor content={content} onChange={setContent} />
        </div>

        {/* SECTION 3 — Prix */}
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Prix</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Prix de vente (FCFA) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 25000" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Prix barré (FCFA) <span style={{ color: '#444' }}>optionnel</span></label>
              <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Ex: 50000" style={inputStyle} />
            </div>
          </div>

          {price && parseInt(price) > 0 && (
            <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '14px', border: '0.5px solid #1F1F1F' }}>
              {originalPrice && parseInt(originalPrice) > parseInt(price) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Prix barré</span>
                  <span style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'line-through' }}>{parseInt(originalPrice).toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}
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

        {/* SECTION 4 — Fichier digital */}
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Fichier digital</p>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px' }}>PDF, ebook, template... Le lien de téléchargement sera partagé après paiement. <span style={{ color: '#444' }}>(optionnel)</span></p>

          <div
            onClick={() => document.getElementById('file-input')?.click()}
            style={{ width: '100%', padding: '24px', background: '#1A1A1A', borderRadius: '10px', border: '0.5px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '12px' }}
          >
            {fileUpload ? (
              <>
                <span style={{ fontSize: '20px' }}>📄</span>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: '500' }}>{fileUpload.name}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>{(fileUpload.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </>
            ) : (
              <>
                <span style={{ fontSize: '20px' }}>📎</span>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>Clique pour uploader ton fichier</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#444' }}>PDF, ZIP, MP4 — max 50MB</p>
                </div>
              </>
            )}
          </div>
          <input id="file-input" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>

      </div>

      {message && (
        <div style={{ background: '#EF444415', border: '0.5px solid #EF444440', borderRadius: '8px', padding: '12px 16px', margin: '16px 0' }}>
          <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{message}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button onClick={() => router.back()} style={{ flex: 1, background: 'transparent', border: '0.5px solid #2a2a2a', color: '#9CA3AF', fontSize: '14px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
          Annuler
        </button>
        <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, background: loading ? '#059669' : '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Création en cours...' : 'Créer le produit →'}
        </button>
      </div>

    </div>
  )
}