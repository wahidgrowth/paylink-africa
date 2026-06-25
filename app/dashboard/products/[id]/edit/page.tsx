'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
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

export default function EditProductPage() {
  const [pageType, setPageType] = useState<'link' | 'sales_page'>('link')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [rawContent, setRawContent] = useState('')
  const [market, setMarket] = useState<'afrique' | 'europe' | 'usa'>('afrique')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [slug, setSlug] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState('')
  const [pageContent, setPageContent] = useState<PageContent | null>(null)
  const [isPublished, setIsPublished] = useState(false)
  const [modificationRequest, setModificationRequest] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const getProduct = async () => {
      const { data } = await supabase
        .from('payment_links')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) {
        setTitle(data.title || '')
        setDescription(data.description || '')
        setContent(data.content || '')
        setRawContent(data.page_raw_content || '')
        setPrice(data.price?.toString() || '')
        setOriginalPrice(data.original_price?.toString() || '')
        setSlug(data.slug || '')
        setImagePreview(data.image_url || null)
        setPageType(data.page_type || 'link')
        setMarket(data.page_market || 'afrique')
        if (data.page_content) {
          setPageContent(data.page_content)
          setIsPublished(true)
          setShowPreview(true)
        }
      }
      setFetching(false)
    }
    getProduct()
  }, [])

  const fee = price ? Math.round(parseInt(price) * 0.01) : 0
  const sellerReceives = price ? parseInt(price) - fee : 0

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleGenerate = async () => {
    if (!title || !price) {
      setMessage('Le titre et le prix sont obligatoires.')
      return
    }

    // Mode modification
    if (isPublished && pageContent) {
      if (!modificationRequest.trim()) {
        setMessage('Décris ce que tu veux modifier.')
        return
      }
      setGenerating(true)
      setMessage('')
      try {
        const res = await fetch('/api/generate-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productTitle: title,
            price: parseInt(price),
            market,
            rawContent,
            modificationRequest,
            existingPageContent: pageContent,
          }),
        })
        const data = await res.json()
        if (data.error) {
          setMessage('Erreur lors de la modification. Réessaie.')
        } else {
          setPageContent(data.pageContent)
          setShowPreview(true)
          setModificationRequest('')
          setMessage('')
        }
      } catch {
        setMessage('Erreur serveur. Réessaie.')
      }
      setGenerating(false)
      return
    }

    // Mode génération initiale
    if (!rawContent || rawContent.length < 20) {
      setMessage('Ajoute plus de contenu pour générer ta page de vente.')
      return
    }
    setGenerating(true)
    setMessage('')
    try {
      const res = await fetch('/api/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawContent,
          productTitle: title,
          price: parseInt(price),
          market,
        }),
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
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

    let image_url = imagePreview

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

    const { error } = await supabase
      .from('payment_links')
      .update({
        title,
        description,
        content,
        price: parseInt(price),
        original_price: originalPrice ? parseInt(originalPrice) : null,
        image_url,
        page_type: pageType,
        page_market: market,
        page_raw_content: rawContent,
        page_content: pageContent,
      })
      .eq('id', params.id)

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

  if (fetching) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ padding: '32px' }}>
      <style>{`
        @media (max-width: 767px) {
          .ep-wrap { padding: 16px !important; }
          .ep-inner { max-width: 100% !important; }
          .ep-type-grid { grid-template-columns: 1fr !important; }
          .ep-price-grid { grid-template-columns: 1fr !important; }
          .ep-market-grid { grid-template-columns: 1fr !important; }
          .ep-btn-row { flex-direction: column !important; }
          .ep-preview-benefits { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="ep-inner" style={{ maxWidth: '700px' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Modifier le produit</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Modifie les informations de ta page de vente</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* TYPE */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>Type de produit</p>
            <div className="ep-type-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div onClick={() => setPageType('link')} style={{ padding: '16px', borderRadius: '10px', border: `1.5px solid ${pageType === 'link' ? '#10B981' : '#2a2a2a'}`, background: pageType === 'link' ? '#10B98110' : '#1A1A1A', cursor: 'pointer' }}>
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: pageType === 'link' ? '#10B981' : '#fff' }}>Lien de paiement</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>Simple et rapide.</p>
              </div>
              <div onClick={() => setPageType('sales_page')} style={{ padding: '16px', borderRadius: '10px', border: `1.5px solid ${pageType === 'sales_page' ? '#10B981' : '#2a2a2a'}`, background: pageType === 'sales_page' ? '#10B98110' : '#1A1A1A', cursor: 'pointer' }}>
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: pageType === 'sales_page' ? '#10B981' : '#fff' }}>Page de vente IA ✨</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>Notre IA génère ta page.</p>
              </div>
            </div>
          </div>

          {/* INFOS DE BASE */}
          <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Informations de base</p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Image de couverture</label>
              <div onClick={() => document.getElementById('image-input-edit')?.click()} style={{ width: '100%', height: '180px', background: '#1A1A1A', borderRadius: '10px', border: '0.5px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Clique pour changer l'image</p>
                )}
                {imagePreview && <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#000000AA', borderRadius: '6px', padding: '4px 10px' }}><p style={{ margin: 0, fontSize: '11px', color: '#fff' }}>Changer</p></div>}
              </div>
              <input id="image-input-edit" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Titre du produit *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Description courte</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Lien public</label>
              <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '12px 16px', border: '0.5px solid #1F1F1F' }}>
                <span style={{ color: '#6B7280', fontSize: '13px' }}>paylinkafrica.com/p/</span>
                <span style={{ color: '#10B981', fontSize: '13px', fontWeight: '600' }}>{slug}</span>
              </div>
              <p style={{ fontSize: '11px', color: '#444', margin: '6px 0 0' }}>Le lien ne peut pas être modifié après création.</p>
            </div>
          </div>

          {/* CONTENU */}
          {pageType === 'link' ? (
            <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
              <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Page de vente</p>
              <RichEditor content={content} onChange={setContent} />
            </div>
          ) : (
            <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
              <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Page de vente IA ✨</p>

              {/* MARCHÉ */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Marché cible</label>
                <div className="ep-market-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[{ key: 'afrique', label: '🌍 Afrique' }, { key: 'europe', label: '🇪🇺 Europe' }, { key: 'usa', label: '🇺🇸 USA' }].map((m) => (
                    <div key={m.key} onClick={() => setMarket(m.key as typeof market)} style={{ padding: '10px', borderRadius: '8px', border: `1.5px solid ${market === m.key ? '#10B981' : '#2a2a2a'}`, background: market === m.key ? '#10B98110' : '#1A1A1A', cursor: 'pointer', textAlign: 'center', fontSize: '13px', fontWeight: market === m.key ? '700' : '400', color: market === m.key ? '#10B981' : '#9CA3AF' }}>
                      {m.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* PAGE PAS ENCORE GÉNÉRÉE */}
              {!isPublished && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Ton contenu brut *</label>
                    <textarea value={rawContent} onChange={(e) => setRawContent(e.target.value)} placeholder="Colle ici tout ce que tu veux dire sur ton produit..." rows={8} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
                    <p style={{ fontSize: '11px', color: '#444', margin: '6px 0 0' }}>{rawContent.length} caractères</p>
                  </div>
                  <button onClick={handleGenerate} disabled={generating} style={{ width: '100%', background: generating ? '#1A1A1A' : '#10B98115', border: `1px solid ${generating ? '#2a2a2a' : '#10B98140'}`, color: generating ? '#6B7280' : '#10B981', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '8px', cursor: generating ? 'not-allowed' : 'pointer' }}>
                    {generating ? '✨ Génération en cours...' : '✨ Générer ma page de vente'}
                  </button>
                </>
              )}

              {/* PAGE DÉJÀ PUBLIÉE — champ modification uniquement */}
              {isPublished && (
                <>
                  <div style={{ background: '#10B98110', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', border: '0.5px solid #10B98130' }}>
                    <p style={{ fontSize: '13px', color: '#10B981', margin: 0 }}>✓ Ta page de vente est active. Dis à l'IA ce que tu veux modifier.</p>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Que veux-tu modifier ?</label>
                    <textarea
                      value={modificationRequest}
                      onChange={(e) => setModificationRequest(e.target.value)}
                      placeholder="Ex: Rends le titre plus accrocheur, le témoignage doit venir du Bénin, ajoute plus d'urgence dans le CTA..."
                      rows={4}
                      style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
                    />
                  </div>

                  <button onClick={handleGenerate} disabled={generating} style={{ width: '100%', background: generating ? '#1A1A1A' : '#10B98115', border: `1px solid ${generating ? '#2a2a2a' : '#10B98140'}`, color: generating ? '#6B7280' : '#10B981', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '8px', cursor: generating ? 'not-allowed' : 'pointer' }}>
                    {generating ? '✨ Modification en cours...' : '✨ Appliquer les modifications'}
                  </button>
                </>
              )}

              {/* PREVIEW */}
              {showPreview && pageContent && (
                <div style={{ marginTop: '20px', background: '#0D0D0D', borderRadius: '12px', border: '0.5px solid #10B98140', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #1F1F1F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#10B981', fontWeight: '700' }}>✓ Aperçu de ta page</p>
                    <button onClick={() => setShowPreview(!showPreview)} style={{ background: 'transparent', border: 'none', color: '#6B7280', fontSize: '12px', cursor: 'pointer' }}>
                      {showPreview ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '16px', textAlign: 'center', padding: '20px', background: '#111', borderRadius: '10px' }}>
                      <p style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '0 0 8px', lineHeight: '1.3' }}>{pageContent.headline}</p>
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
                      <div className="ep-preview-benefits" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
            <div className="ep-price-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Prix de vente (FCFA) *</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Prix barré (FCFA)</label>
                <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} style={inputStyle} />
              </div>
            </div>
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

        </div>

        {message && (
          <div style={{ background: '#EF444415', border: '0.5px solid #EF444440', borderRadius: '8px', padding: '12px 16px', margin: '16px 0' }}>
            <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{message}</p>
          </div>
        )}

        <div className="ep-btn-row" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button onClick={() => router.back()} style={{ flex: 1, background: 'transparent', border: '0.5px solid #2a2a2a', color: '#9CA3AF', fontSize: '14px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, background: loading ? '#059669' : '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder →'}
          </button>
        </div>

      </div>
    </div>
  )
}