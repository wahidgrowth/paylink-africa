'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('@/components/RichEditor'), { ssr: false })

export default function NewProductPage() {
  const [pageType, setPageType] = useState<'link' | 'sales_page'>('link')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [rawContent, setRawContent] = useState('')
  const [market, setMarket] = useState<'afrique' | 'europe' | 'usa'>('afrique')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [slug, setSlug] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileUpload, setFileUpload] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [message, setMessage] = useState('')
  const [pageGenerated, setPageGenerated] = useState(false)
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

  const handleGenerate = async () => {
    if (!rawContent || rawContent.length < 20) {
      setMessage('Ajoute plus de contenu pour générer ta page de vente.')
      return
    }
    if (!title || !price) {
      setMessage('Le titre et le prix sont obligatoires avant de générer.')
      return
    }
    setGenerating(true)
    setMessage('')
    try {
      const res = await fetch('/api/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawContent, productTitle: title, price: parseInt(price), market }),
      })
      const data = await res.json()
      if (data.error) {
        setMessage('Erreur lors de la génération. Réessaie.')
      } else {
        setPageGenerated(true)
        setMessage('')
      }
    } catch {
      setMessage('Erreur serveur. Réessaie.')
    }
    setGenerating(false)
  }

  const handleSubmit = async () => {
    if (!title || !price || !slug) {
      setMessage('Titre, prix et slug sont obligatoires')
      return
    }
    if (pageType === 'sales_page' && !pageGenerated) {
      setMessage('Génère ta page de vente avant de publier.')
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
      page_type: pageType,
      page_market: market,
      page_raw_content: rawContent,
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
    <div style={{ padding: '32px' }}>
      <style>{`
        @media (max-width: 767px) {
          .np-wrap { padding: 16px !important; }
          .np-inner { max-width: 100% !important; }
          .np-type-grid { grid-template-columns: 1fr !important; }
          .np-price-grid { grid-template-columns: 1fr !important; }
          .np-market-grid { grid-template-columns: 1fr !important; }
          .np-btn-row { flex-direction: column !important; }
        }
      `}</style>

      <div className="np-inner" style={{ maxWidth: '700px' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Créer un produit</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Configure ta page de vente</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* CHOIX DU TYPE */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>Type de produit</p>
            <div className="np-type-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div
                onClick={() => setPageType('link')}
                style={{ padding: '16px', borderRadius: '10px', border: `1.5px solid ${pageType === 'link' ? '#10B981' : '#2a2a2a'}`, background: pageType === 'link' ? '#10B98110' : '#1A1A1A', cursor: 'pointer' }}
              >
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: pageType === 'link' ? '#10B981' : '#fff' }}>Lien de paiement</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>Simple et rapide. Formulaire de paiement direct.</p>
              </div>
              <div
                onClick={() => setPageType('sales_page')}
                style={{ padding: '16px', borderRadius: '10px', border: `1.5px solid ${pageType === 'sales_page' ? '#10B981' : '#2a2a2a'}`, background: pageType === 'sales_page' ? '#10B98110' : '#1A1A1A', cursor: 'pointer' }}
              >
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: pageType === 'sales_page' ? '#10B981' : '#fff' }}>Page de vente IA ✨</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>Notre IA génère ta page de vente complète.</p>
              </div>
            </div>
          </div>

          {/* INFORMATIONS DE BASE */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Informations de base</p>

            {/* IMAGE */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Image de couverture</label>
              <div
                onClick={() => document.getElementById('image-input')?.click()}
                style={{ width: '100%', height: '180px', background: '#1A1A1A', borderRadius: '10px', border: '0.5px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 4px' }}>Clique pour ajouter une image</p>
                    <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>JPG, PNG — max 5MB</p>
                  </div>
                )}
                {imagePreview && (
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#000000AA', borderRadius: '6px', padding: '4px 10px' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: '#fff' }}>Changer</p>
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

            {/* DESCRIPTION */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Description courte</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Une phrase qui résume ton produit..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </div>

            {/* SLUG */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Lien personnalisé *</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#1A1A1A', borderRadius: '8px', border: '0.5px solid #2a2a2a', padding: '12px 16px', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ color: '#6B7280', fontSize: '13px', flexShrink: 0 }}>paylinkafrica.com/p/</span>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} style={{ flex: 1, minWidth: '100px', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '14px' }} />
              </div>
            </div>
          </div>

          {/* PAGE DE VENTE — selon le type choisi */}
          {pageType === 'link' ? (
            <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
              <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Page de vente</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px' }}>Écris ici tout ce qui va convaincre ton client d'acheter.</p>
              <RichEditor content={content} onChange={setContent} />
            </div>
          ) : (
            <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
              <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Page de vente IA ✨</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px', lineHeight: '1.6' }}>
                Colle tout ton contenu en vrac — description, bénéfices, témoignages, arguments. Notre IA structure tout automatiquement.
              </p>

              {/* MARCHÉ */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Tes clients sont principalement où ? *</label>
                <div className="np-market-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { key: 'afrique', label: '🌍 Afrique' },
                    { key: 'europe', label: '🇪🇺 Europe' },
                    { key: 'usa', label: '🇺🇸 USA' },
                  ].map((m) => (
                    <div
                      key={m.key}
                      onClick={() => setMarket(m.key as typeof market)}
                      style={{ padding: '10px', borderRadius: '8px', border: `1.5px solid ${market === m.key ? '#10B981' : '#2a2a2a'}`, background: market === m.key ? '#10B98110' : '#1A1A1A', cursor: 'pointer', textAlign: 'center', fontSize: '13px', fontWeight: market === m.key ? '700' : '400', color: market === m.key ? '#10B981' : '#9CA3AF' }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTENU BRUT */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Ton contenu brut *</label>
                <textarea
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  placeholder="Colle ici tout ce que tu veux dire sur ton produit — description, bénéfices, témoignages, prix, garantie, tout en vrac. L'IA s'occupe du reste."
                  rows={8}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                />
                <p style={{ fontSize: '11px', color: '#444', margin: '6px 0 0' }}>{rawContent.length} caractères — minimum 20 recommandés</p>
              </div>

              {/* BOUTON GÉNÉRER */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{ width: '100%', background: generating ? '#1A1A1A' : '#10B98115', border: `1px solid ${generating ? '#2a2a2a' : '#10B98140'}`, color: generating ? '#6B7280' : '#10B981', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '8px', cursor: generating ? 'not-allowed' : 'pointer' }}
              >
                {generating ? '✨ Génération en cours...' : pageGenerated ? '✓ Page générée — Régénérer' : '✨ Générer ma page de vente'}
              </button>

              {pageGenerated && (
                <div style={{ background: '#10B98115', border: '0.5px solid #10B98140', borderRadius: '8px', padding: '12px 16px', marginTop: '12px' }}>
                  <p style={{ color: '#10B981', fontSize: '13px', margin: 0 }}>✓ Ta page de vente a été générée avec succès. Elle sera visible sur ton lien public.</p>
                </div>
              )}
            </div>
          )}

          {/* PRIX */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Prix</p>
            <div className="np-price-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
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

          {/* FICHIER DIGITAL */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Fichier digital <span style={{ color: '#444', fontSize: '11px', fontWeight: '400', textTransform: 'none', letterSpacing: '0' }}>optionnel</span></p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px' }}>PDF, ebook, template... Partagé après paiement.</p>
            <div
              onClick={() => document.getElementById('file-input')?.click()}
              style={{ width: '100%', padding: '20px', background: '#1A1A1A', borderRadius: '10px', border: '0.5px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '12px' }}
            >
              {fileUpload ? (
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: '500' }}>{fileUpload.name}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>{(fileUpload.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>Clique pour uploader ton fichier</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#444' }}>PDF, ZIP, MP4 — max 50MB</p>
                </div>
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

        <div className="np-btn-row" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button onClick={() => router.back()} style={{ flex: 1, background: 'transparent', border: '0.5px solid #2a2a2a', color: '#9CA3AF', fontSize: '14px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, background: loading ? '#059669' : '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Création en cours...' : 'Créer le produit →'}
          </button>
        </div>

      </div>
    </div>
  )
}