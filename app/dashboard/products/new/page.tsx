'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('@/components/RichEditor'), { ssr: false })

type PageContent = {
  headline: string
  subheadline: string
  problem: string
  solution: string
  benefits: string[]
  testimonial: { name: string; text: string; location: string }
  guarantee: string
  cta_urgency: string
  whatsapp_text: string
}

export default function NewProductPage() {
  const [pageType, setPageType] = useState<'link' | 'sales_page'>('link')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [rawContent, setRawContent] = useState('')
  const [market, setMarket] = useState<'afrique' | 'europe' | 'usa'>('afrique')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [showOriginalPrice, setShowOriginalPrice] = useState(false)
  const [slug, setSlug] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileUpload, setFileUpload] = useState<File | null>(null)
  const [redirectUrl, setRedirectUrl] = useState('')
  const [deliveryType, setDeliveryType] = useState<null | 'file' | 'redirect'>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [message, setMessage] = useState('')
  const [pageContent, setPageContent] = useState<PageContent | null>(null)
  const [showPreview, setShowPreview] = useState(false)
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
    setShowPreview(false)
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
        setPageContent(data.pageContent)
        setShowPreview(true)
        setMessage('')
      }
    } catch {
      setMessage('Erreur serveur. Réessaie.')
    }
    setGenerating(false)
  }

  const handleSubmit = async () => {
    if (!title || !price || !slug) {
      setMessage('Titre et prix sont obligatoires.')
      return
    }
    if (pageType === 'sales_page' && !pageContent) {
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
      const { error: uploadError } = await supabase.storage.from('product-images').upload(path, imageFile, { upsert: true })
      if (uploadError) { setMessage('Erreur upload image : ' + uploadError.message); setLoading(false); return }
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
      image_url = urlData.publicUrl
    }

    if (fileUpload && deliveryType === 'file') {
      const ext = fileUpload.name.split('.').pop()
      const path = `${user.id}/${slug}-file-${Date.now()}.${ext}`
      const { error: fileError } = await supabase.storage.from('product-images').upload(path, fileUpload, { upsert: true })
      if (fileError) { setMessage('Erreur upload fichier : ' + fileError.message); setLoading(false); return }
      const { data: fileUrlData } = supabase.storage.from('product-images').getPublicUrl(path)
      file_url = fileUrlData.publicUrl
    }

    const { error } = await supabase.from('payment_links').insert({
      user_id: user.id,
      title,
      content,
      price: parseInt(price),
      original_price: originalPrice ? parseInt(originalPrice) : null,
      slug,
      image_url,
      file_url,
      redirect_url: deliveryType === 'redirect' ? redirectUrl : null,
      page_type: pageType,
      page_market: market,
      page_raw_content: rawContent,
      page_content: pageContent,
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

  const CheckSmall = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>

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
          .np-preview-benefits { grid-template-columns: 1fr !important; }
          .np-delivery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="np-inner" style={{ maxWidth: '700px' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Créer un produit</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Configure ta page de vente en quelques secondes</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* CHOIX DU TYPE */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>Type de produit</p>
            <div className="np-type-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div onClick={() => setPageType('link')} style={{ padding: '16px', borderRadius: '10px', border: `1.5px solid ${pageType === 'link' ? '#10B981' : '#2a2a2a'}`, background: pageType === 'link' ? '#10B98110' : '#1A1A1A', cursor: 'pointer' }}>
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: pageType === 'link' ? '#10B981' : '#fff' }}>Lien de paiement</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>Simple et rapide. Formulaire de paiement direct.</p>
              </div>
              <div onClick={() => setPageType('sales_page')} style={{ padding: '16px', borderRadius: '10px', border: `1.5px solid ${pageType === 'sales_page' ? '#10B981' : '#2a2a2a'}`, background: pageType === 'sales_page' ? '#10B98110' : '#1A1A1A', cursor: 'pointer' }}>
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
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>
                Image de couverture <span style={{ color: '#444' }}>— optionnel</span>
              </label>
              <div onClick={() => document.getElementById('image-input')?.click()} style={{ width: '100%', height: '160px', background: '#1A1A1A', borderRadius: '10px', border: '0.5px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#444', margin: '0 0 4px' }}>Clique pour ajouter une image</p>
                    <p style={{ fontSize: '11px', color: '#333', margin: 0 }}>JPG, PNG — max 5MB</p>
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
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Nom du produit *</label>
              <input type="text" value={title} onChange={handleTitleChange} placeholder="Ex: Formation Marketing Digital" style={inputStyle} />
            </div>

            {/* SLUG */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Lien de paiement *</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#1A1A1A', borderRadius: '8px', border: '0.5px solid #2a2a2a', padding: '12px 16px', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ color: '#444', fontSize: '13px', flexShrink: 0 }}>paylinkafrica.com/p/</span>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} style={{ flex: 1, minWidth: '100px', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '14px' }} />
              </div>
              <p style={{ fontSize: '11px', color: '#444', margin: '6px 0 0' }}>Généré automatiquement depuis le nom. Tu peux le modifier.</p>
            </div>
          </div>

          {/* CONTENU */}
          {pageType === 'link' ? (
            <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
              <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Description</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px' }}>Décris ton produit pour convaincre tes clients d'acheter.</p>
              <RichEditor content={content} onChange={setContent} />
            </div>
          ) : (
            <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
              <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Page de vente IA ✨</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px', lineHeight: '1.6' }}>
                Colle tout ton contenu en vrac. Notre IA structure tout automatiquement.
              </p>

              {/* MARCHÉ */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Tes clients sont principalement où ?</label>
                <div className="np-market-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[{ key: 'afrique', label: '🌍 Afrique' }, { key: 'europe', label: '🇪🇺 Europe' }, { key: 'usa', label: '🇺🇸 USA' }].map((m) => (
                    <div key={m.key} onClick={() => setMarket(m.key as typeof market)} style={{ padding: '10px', borderRadius: '8px', border: `1.5px solid ${market === m.key ? '#10B981' : '#2a2a2a'}`, background: market === m.key ? '#10B98110' : '#1A1A1A', cursor: 'pointer', textAlign: 'center', fontSize: '13px', fontWeight: market === m.key ? '700' : '400', color: market === m.key ? '#10B981' : '#9CA3AF' }}>
                      {m.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTENU BRUT */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Ton contenu *</label>
                <textarea value={rawContent} onChange={(e) => setRawContent(e.target.value)} placeholder="Décris ton produit, ses bénéfices, pour qui c'est fait, ce que le client va obtenir... L'IA s'occupe du reste." rows={7} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
                <p style={{ fontSize: '11px', color: '#444', margin: '6px 0 0' }}>{rawContent.length} caractères</p>
              </div>

              <button onClick={handleGenerate} disabled={generating} style={{ width: '100%', background: generating ? '#1A1A1A' : '#10B98115', border: `1px solid ${generating ? '#2a2a2a' : '#10B98140'}`, color: generating ? '#6B7280' : '#10B981', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '8px', cursor: generating ? 'not-allowed' : 'pointer' }}>
                {generating ? '✨ Génération en cours...' : pageContent ? '✓ Page générée — Régénérer' : '✨ Générer ma page de vente'}
              </button>

              {/* PREVIEW */}
              {showPreview && pageContent && (
                <div style={{ marginTop: '20px', background: '#0D0D0D', borderRadius: '12px', border: '0.5px solid #10B98140', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #1F1F1F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#10B981', fontWeight: '700' }}>✓ Aperçu de ta page</p>
                    <button onClick={() => setShowPreview(!showPreview)} style={{ background: 'transparent', border: 'none', color: '#6B7280', fontSize: '12px', cursor: 'pointer' }}>Masquer</button>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '16px', textAlign: 'center', padding: '16px', background: '#111', borderRadius: '10px' }}>
                      <p style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '0 0 6px', lineHeight: '1.3' }}>{pageContent.headline}</p>
                      <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>{pageContent.subheadline}</p>
                    </div>
                    <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
                      <div style={{ background: '#111', borderRadius: '8px', padding: '14px' }}>
                        <p style={{ fontSize: '10px', color: '#EF4444', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' }}>Problème</p>
                        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0, lineHeight: '1.5' }}>{pageContent.problem}</p>
                      </div>
                      <div style={{ background: '#111', borderRadius: '8px', padding: '14px' }}>
                        <p style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' }}>Solution</p>
                        <p style={{ fontSize: '13px', color: '#fff', margin: 0, lineHeight: '1.5' }}>{pageContent.solution}</p>
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 10px' }}>Bénéfices</p>
                      <div className="np-preview-benefits" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {pageContent.benefits.map((b, i) => (
                          <div key={i} style={{ background: '#111', borderRadius: '8px', padding: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <div style={{ flexShrink: 0 }}><CheckSmall /></div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#fff', lineHeight: '1.4' }}>{b}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: '#111', borderRadius: '8px', padding: '14px', marginBottom: '10px' }}>
                      <p style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Témoignage</p>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 6px', fontStyle: 'italic', lineHeight: '1.5' }}>"{pageContent.testimonial.text}"</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#10B981', fontWeight: '600' }}>{pageContent.testimonial.name} — {pageContent.testimonial.location}</p>
                    </div>
                    <div style={{ background: '#111', borderRadius: '8px', padding: '14px' }}>
                      <p style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' }}>Garantie</p>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0, lineHeight: '1.5' }}>{pageContent.guarantee}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PRIX */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Prix</p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Prix de vente (FCFA) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 25000" style={inputStyle} />
            </div>

            {!showOriginalPrice ? (
              <button onClick={() => setShowOriginalPrice(true)} style={{ background: 'transparent', border: 'none', color: '#6B7280', fontSize: '13px', cursor: 'pointer', padding: '0', marginBottom: '16px', textDecoration: 'underline' }}>
                + Ajouter un prix barré
              </button>
            ) : (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>
                  Prix barré (FCFA)
                  <span onClick={() => { setShowOriginalPrice(false); setOriginalPrice('') }} style={{ color: '#444', cursor: 'pointer', fontSize: '11px', marginLeft: '8px', textDecoration: 'underline' }}>Supprimer</span>
                </label>
                <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Ex: 50000" style={inputStyle} />
              </div>
            )}

            {price && parseInt(price) > 0 && (
              <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '14px', border: '0.5px solid #1F1F1F' }}>
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

          {/* APRÈS PAIEMENT */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Après paiement <span style={{ color: '#444', fontSize: '11px', fontWeight: '400', textTransform: 'none', letterSpacing: '0' }}>— optionnel</span></p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px', lineHeight: '1.5' }}>Que reçoit ton client après avoir payé ?</p>

            {/* CHOIX */}
            {!deliveryType && (
              <div className="np-delivery-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div onClick={() => setDeliveryType('file')} style={{ padding: '16px', borderRadius: '10px', border: '0.5px dashed #2a2a2a', background: '#1A1A1A', cursor: 'pointer', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: '#fff' }}>📎 Fichier digital</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>PDF, ebook, ZIP, MP4...</p>
                </div>
                <div onClick={() => setDeliveryType('redirect')} style={{ padding: '16px', borderRadius: '10px', border: '0.5px dashed #2a2a2a', background: '#1A1A1A', cursor: 'pointer', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: '#fff' }}>🔗 Lien de redirection</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>Groupe WhatsApp, cours en ligne...</p>
                </div>
              </div>
            )}

            {/* FICHIER DIGITAL */}
            {deliveryType === 'file' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>Fichier digital</p>
                  <button onClick={() => { setDeliveryType(null); setFileUpload(null) }} style={{ background: 'transparent', border: 'none', color: '#444', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Changer</button>
                </div>
                <div onClick={() => document.getElementById('file-input')?.click()} style={{ width: '100%', padding: '20px', background: '#1A1A1A', borderRadius: '10px', border: '0.5px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '12px' }}>
                  {fileUpload ? (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#10B981', fontWeight: '600' }}>✓ {fileUpload.name}</p>
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
            )}

            {/* LIEN DE REDIRECTION */}
            {deliveryType === 'redirect' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>Lien de redirection</p>
                  <button onClick={() => { setDeliveryType(null); setRedirectUrl('') }} style={{ background: 'transparent', border: 'none', color: '#444', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Changer</button>
                </div>
                <input
                  type="url"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://chat.whatsapp.com/... ou https://ton-cours.com/..."
                  style={inputStyle}
                />
                <p style={{ fontSize: '11px', color: '#444', margin: '6px 0 0' }}>Le client sera redirigé vers ce lien après paiement.</p>
              </div>
            )}
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