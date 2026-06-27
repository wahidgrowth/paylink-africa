'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

type PageContent = {
  hero_headline: string
  hero_subheadline: string
  hero_stats: { number: string; label: string }[]
  problem_title: string
  problem_intro: string
  problem_points: string[]
  problem_quote: string
  solution_title: string
  solution_text: string
  benefits_title: string
  benefits: { icon: string; title: string; text: string }[]
  steps_title: string
  steps: { number: string; title: string; text: string }[]
  testimonials: { name: string; location: string; text: string; result: string }[]
  faq_title: string
  faq: { question: string; answer: string }[]
  guarantee_title: string
  guarantee_text: string
  urgency_text: string
  cta_text: string
  value_items: { label: string; value: string }[]
  final_headline: string
  // Ancien format (compatibilité)
  headline?: string
  subheadline?: string
  problem?: string
  solution?: string
  benefits_old?: string[]
  testimonial?: { name: string; text: string; location: string }
  guarantee?: string
  cta_urgency?: string
}

type Product = {
  id: string
  title: string
  description: string
  content: string
  price: number
  original_price?: number
  slug: string
  image_url?: string
  file_url?: string
  redirect_url?: string
  user_id: string
  page_type?: string
  page_content?: PageContent
  page_color?: string
  page_cta_text?: string
  page_market?: string
}

const COUNTRIES = [
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', operators: [{ name: 'MTN MoMo', color: '#FCD34D' }, { name: 'Moov Money', color: '#60A5FA' }, { name: 'Celtiis', color: '#A78BFA' }] },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', operators: [{ name: 'MTN MoMo', color: '#FCD34D' }, { name: 'Moov Money', color: '#60A5FA' }, { name: 'Orange Money', color: '#FB923C' }, { name: 'Wave', color: '#A78BFA' }] },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', operators: [{ name: 'Orange Money', color: '#FB923C' }, { name: 'Free Money', color: '#10B981' }, { name: 'Wave', color: '#A78BFA' }] },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', operators: [{ name: 'T-Money', color: '#EF4444' }, { name: 'Moov Money', color: '#60A5FA' }] },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', operators: [{ name: 'MTN MoMo', color: '#FCD34D' }, { name: 'Orange Money', color: '#FB923C' }] },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', operators: [{ name: 'Orange Money', color: '#FB923C' }, { name: 'Moov', color: '#60A5FA' }] },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', operators: [{ name: 'Orange Money', color: '#FB923C' }, { name: 'Moov Money', color: '#60A5FA' }] },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', operators: [{ name: 'MTN MoMo', color: '#FCD34D' }, { name: 'Orange Money', color: '#FB923C' }] },
  { code: 'CD', name: 'RD Congo', flag: '🇨🇩', operators: [{ name: 'Airtel Money', color: '#EF4444' }, { name: 'Orange Money', color: '#FB923C' }] },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', operators: [{ name: 'Airtel Money', color: '#EF4444' }, { name: 'Orange Money', color: '#FB923C' }] },
]

const LockIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const CheckIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const CheckSmall = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const ProductIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
const SadIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const StarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const PlusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const MinusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>

declare global { interface Window { fbq: (...args: unknown[]) => void } }

export default function PaymentPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [pixelId, setPixelId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [selectedOperator, setSelectedOperator] = useState(COUNTRIES[0].operators[0])
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const getProduct = async () => {
      const { data } = await supabase.from('payment_links').select('*').eq('slug', params.slug).eq('is_active', true).single()
      if (data) {
        setProduct(data)
        await supabase.from('views').insert({ link_id: data.id })
        const { data: profile } = await supabase.from('profiles').select('pixel_id').eq('id', data.user_id).maybeSingle()
        if (profile?.pixel_id) setPixelId(profile.pixel_id)
      }
      setLoading(false)
    }
    getProduct()
  }, [])

  useEffect(() => {
    if (!pixelId) return
    const script = document.createElement('script')
    script.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`
    document.head.appendChild(script)
  }, [pixelId])

  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [showModal])

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = COUNTRIES.find(c => c.code === e.target.value) || COUNTRIES[0]
    setSelectedCountry(country)
    setSelectedOperator(country.operators[0])
    setPhone('')
  }

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = selectedCountry.operators.find(o => o.name === e.target.value) || selectedCountry.operators[0]
    setSelectedOperator(op)
  }

  const handlePay = () => {
    if (!buyerName || !phone) return
    if (pixelId && window.fbq) window.fbq('track', 'Purchase', { value: product?.price, currency: 'XOF' })
    if (product?.redirect_url) { window.location.href = product.redirect_url; return }
    setSuccess(true)
    setShowModal(false)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value)
    if (pixelId && window.fbq) window.fbq('track', 'InitiateCheckout', { value: product?.price, currency: 'XOF' })
  }

  const fee = product ? Math.round(product.price * 0.01) : 0
  const total = product ? product.price + fee : 0
  const discount = product?.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0
  const accentColor = product?.page_color || '#10B981'

  const selectStyle = { width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' as const, cursor: 'pointer', appearance: 'none' as const }

  if (loading) return <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Chargement...</p></div>

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><SadIcon /></div>
        <p style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: '0 0 8px' }}>Produit introuvable</p>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Ce lien n'existe pas ou a été désactivé.</p>
      </div>
    </div>
  )

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <div style={{ width: '72px', height: '72px', background: '#10B98120', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><CheckIcon /></div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>Paiement confirmé !</h1>
        <p style={{ color: '#6B7280', fontSize: '15px', margin: '0 0 24px', lineHeight: '1.6' }}>Merci {buyerName}. Ton paiement de <strong style={{ color: '#10B981' }}>{total.toLocaleString('fr-FR')} FCFA</strong> a bien été reçu.</p>
        {product.file_url && (
          <a href={product.file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto 16px' }}><DownloadIcon /> Télécharger mon fichier</button>
          </a>
        )}
      </div>
    </div>
  )

  // MODAL CHECKOUT
  const CheckoutModal = () => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }} onClick={() => setShowModal(false)}>
      <div style={{ background: '#111111', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '0 0 32px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '0.5px solid #1F1F1F', position: 'sticky', top: 0, background: '#111111', zIndex: 1 }}>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>Total à payer</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: accentColor }}>{total.toLocaleString('fr-FR')} <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>FCFA</span></p>
          </div>
          <button onClick={() => setShowModal(false)} style={{ background: '#1A1A1A', border: '0.5px solid #2a2a2a', color: '#9CA3AF', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><CloseIcon /></button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: '500' }}>Votre nom</label>
            <input type="text" placeholder="Ex: Kofi Mensah" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} style={{ ...selectStyle, appearance: 'auto' as const }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: '500' }}>Pays</label>
            <select value={selectedCountry.code} onChange={handleCountryChange} style={selectStyle}>
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: '500' }}>Opérateur Mobile Money</label>
            <select value={selectedOperator.name} onChange={handleOperatorChange} style={{ ...selectStyle, border: `0.5px solid ${selectedOperator.color}60`, color: selectedOperator.color }}>
              {selectedCountry.operators.map(op => <option key={op.name} value={op.name} style={{ color: '#fff' }}>{op.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: '500' }}>Numéro Mobile Money</label>
            <input type="tel" placeholder="Ex: 97 00 00 00" value={phone} onChange={handlePhoneChange} style={{ ...selectStyle, appearance: 'auto' as const }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedOperator.color }} />
              <span style={{ fontSize: '11px', color: selectedOperator.color, fontWeight: '600' }}>{selectedOperator.name}</span>
            </div>
          </div>
          <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '14px', marginBottom: '16px', border: '0.5px solid #1F1F1F' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>Prix produit</span>
              <span style={{ fontSize: '13px', color: '#fff' }}>{product.price.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>Frais Mobile Money</span>
              <span style={{ fontSize: '13px', color: '#F59E0B' }}>+{fee.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '0.5px solid #1F1F1F' }}>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>Total</span>
              <span style={{ fontSize: '14px', color: accentColor, fontWeight: '700' }}>{total.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
          <button onClick={handlePay} disabled={!buyerName || !phone} style={{ width: '100%', background: buyerName && phone ? accentColor : '#1A1A1A', border: 'none', color: buyerName && phone ? '#000' : '#444', fontSize: '15px', fontWeight: '700', padding: '16px', borderRadius: '10px', cursor: buyerName && phone ? 'pointer' : 'not-allowed', marginBottom: '12px' }}>
            {`Payer via ${selectedOperator.name} →`}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ color: '#444', display: 'flex' }}><LockIcon /></span>
            <span style={{ fontSize: '11px', color: '#444' }}>Paiement sécurisé · Propulsé par PayLink Africa</span>
          </div>
        </div>
      </div>
    </div>
  )

  // ============================================================
  // PAGE DE VENTE IA — NOUVEAU TEMPLATE STYLE SYSTEME.IO
  // ============================================================
  if (product.page_type === 'sales_page' && product.page_content) {
    const pc = product.page_content
    const isNewFormat = !!pc.hero_headline
    const ctaText = pc.cta_text || product.page_cta_text || 'Accéder maintenant'

    // Compatibilité ancien format
    if (!isNewFormat) {
      return (
        <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
          <nav style={{ display: 'flex', justifyContent: 'center', padding: '16px 24px', borderBottom: '0.5px solid #1F1F1F' }}>
            <Link href="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
          </nav>
          <div style={{ textAlign: 'center', padding: '64px 24px', maxWidth: '760px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', margin: '0 0 20px' }}>{pc.headline}</h1>
            <p style={{ fontSize: '18px', color: '#9CA3AF', margin: '0 0 40px', lineHeight: '1.6' }}>{pc.subheadline}</p>
            <button onClick={() => setShowModal(true)} style={{ background: accentColor, border: 'none', color: '#000', fontSize: '18px', fontWeight: '800', padding: '18px 48px', borderRadius: '12px', cursor: 'pointer' }}>
              {ctaText} →
            </button>
          </div>
          {showModal && <CheckoutModal />}
        </div>
      )
    }

    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
        <style>{`
          .sp-container { max-width: 820px; margin: 0 auto; padding: 0 24px; }
          .sp-section { padding: 72px 0; }
          .sp-section-alt { padding: 72px 0; background: #0D0D0D; border-top: 0.5px solid #1F1F1F; border-bottom: 0.5px solid #1F1F1F; }
          .sp-benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .sp-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .sp-testimonials-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .sp-label { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 20px; }
          .sp-nav { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; border-bottom: 0.5px solid #1F1F1F; position: sticky; top: 0; background: rgba(10,10,10,0.95); backdrop-filter: blur(10px); z-index: 100; }
          .sp-cta-btn { background: ${accentColor}; border: none; color: #000; font-size: 16px; font-weight: 800; padding: 16px 36px; border-radius: 10px; cursor: pointer; white-space: nowrap; }
          @media (max-width: 767px) {
            .sp-container { padding: 0 16px; }
            .sp-section { padding: 48px 0; }
            .sp-section-alt { padding: 48px 0; }
            .sp-benefits-grid { grid-template-columns: 1fr; gap: 12px; }
            .sp-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
            .sp-testimonials-grid { grid-template-columns: 1fr; gap: 16px; }
            .sp-nav { padding: 12px 16px; }
            .sp-nav-cta { display: none; }
          }
        `}</style>

        {/* NAV STICKY */}
        <nav className="sp-nav">
          <Link href="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
          <button className="sp-nav-cta sp-cta-btn" onClick={() => setShowModal(true)} style={{ fontSize: '14px', padding: '10px 24px' }}>
            {ctaText} — {product.price.toLocaleString('fr-FR')} FCFA
          </button>
        </nav>

        {/* HERO */}
        <div style={{ borderBottom: '0.5px solid #1F1F1F' }}>
          <div className="sp-container">
            <div className="sp-section" style={{ textAlign: 'center' }}>
              {product.image_url && (
                <img src={product.image_url} alt={product.title} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '16px', marginBottom: '48px', border: '0.5px solid #1F1F1F' }} />
              )}
              <h1 style={{ fontSize: 'clamp(30px, 5vw, 56px)', fontWeight: '800', lineHeight: '1.1', margin: '0 0 24px', color: '#fff', letterSpacing: '-0.5px' }}>
                {pc.hero_headline}
              </h1>
              <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#9CA3AF', margin: '0 0 16px', lineHeight: '1.7', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
                {pc.hero_subheadline}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
                <button className="sp-cta-btn" onClick={() => setShowModal(true)} style={{ fontSize: '18px', padding: '20px 56px' }}>
                  {ctaText} →
                </button>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                  {product.price.toLocaleString('fr-FR')} FCFA · Paiement Mobile Money sécurisé
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        {pc.hero_stats && pc.hero_stats.length > 0 && (
          <div style={{ borderBottom: '0.5px solid #1F1F1F', padding: '40px 0' }}>
            <div className="sp-container">
              <div className="sp-stats-grid">
                {pc.hero_stats.map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '20px', background: '#111', borderRadius: '12px', border: '0.5px solid #1F1F1F' }}>
                    <p style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', color: accentColor, margin: '0 0 6px', lineHeight: 1 }}>{stat.number}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: '1.4' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROBLÈME */}
        <div className="sp-section-alt">
          <div className="sp-container">
            <p className="sp-label" style={{ color: accentColor }}>{pc.problem_title || 'Le vrai problème'}</p>
            {pc.problem_intro && (
              <p style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: '#fff', fontWeight: '600', margin: '0 0 32px', lineHeight: '1.5', maxWidth: '640px' }}>
                {pc.problem_intro}
              </p>
            )}
            {pc.problem_points && pc.problem_points.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {pc.problem_points.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px 20px', background: '#0A0A0A', borderRadius: '10px', border: '0.5px solid #1F1F1F' }}>
                    <div style={{ flexShrink: 0, marginTop: '2px' }}><XIcon /></div>
                    <p style={{ margin: 0, fontSize: '15px', color: '#9CA3AF', lineHeight: '1.5' }}>{point}</p>
                  </div>
                ))}
              </div>
            )}
            {pc.problem_quote && (
              <blockquote style={{ margin: '32px 0 0', padding: '20px 24px', borderLeft: `3px solid ${accentColor}`, background: '#0A0A0A', borderRadius: '0 10px 10px 0' }}>
                <p style={{ margin: 0, fontSize: '17px', color: '#fff', fontStyle: 'italic', lineHeight: '1.6' }}>
                  "{pc.problem_quote}"
                </p>
              </blockquote>
            )}
          </div>
        </div>

        {/* SOLUTION */}
        <div className="sp-section">
          <div className="sp-container">
            <p className="sp-label" style={{ color: accentColor }}>{pc.solution_title || 'La solution'}</p>
            <p style={{ fontSize: 'clamp(18px, 3vw, 22px)', color: '#fff', lineHeight: '1.7', margin: 0, maxWidth: '640px', fontWeight: '500' }}>
              {pc.solution_text}
            </p>
          </div>
        </div>

        {/* BÉNÉFICES */}
        <div className="sp-section-alt">
          <div className="sp-container">
            <p className="sp-label" style={{ color: accentColor }}>{pc.benefits_title || 'Ce que tu obtiens'}</p>
            <div className="sp-benefits-grid">
              {pc.benefits && pc.benefits.map((benefit, i) => (
                <div key={i} style={{ background: '#0A0A0A', borderRadius: '14px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{benefit.icon}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{benefit.title}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA INTERMÉDIAIRE */}
        <div style={{ padding: '56px 0', textAlign: 'center', borderBottom: '0.5px solid #1F1F1F' }}>
          <div className="sp-container">
            <button className="sp-cta-btn" onClick={() => setShowModal(true)} style={{ fontSize: '18px', padding: '20px 56px', marginBottom: '12px' }}>
              {ctaText} →
            </button>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{product.price.toLocaleString('fr-FR')} FCFA</p>
          </div>
        </div>

        {/* COMMENT ÇA MARCHE */}
        {pc.steps && pc.steps.length > 0 && (
          <div className="sp-section">
            <div className="sp-container">
              <p className="sp-label" style={{ color: accentColor }}>{pc.steps_title || 'Comment ça marche'}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {pc.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', padding: '24px 0', borderBottom: i < pc.steps.length - 1 ? '0.5px solid #1F1F1F' : 'none' }}>
                    <div style={{ width: '48px', height: '48px', background: `${accentColor}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `0.5px solid ${accentColor}30` }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: accentColor }}>{step.number}</span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 6px' }}>{step.title}</h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TÉMOIGNAGES */}
        {pc.testimonials && pc.testimonials.length > 0 && (
          <div className="sp-section-alt">
            <div className="sp-container">
              <p className="sp-label" style={{ color: accentColor }}>Ce qu'ils disent</p>
              <div className="sp-testimonials-grid">
                {pc.testimonials.map((t, i) => (
                  <div key={i} style={{ background: '#0A0A0A', borderRadius: '14px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                      {[1,2,3,4,5].map(s => <StarIcon key={s} />)}
                    </div>
                    <p style={{ fontSize: '15px', color: '#fff', lineHeight: '1.7', margin: '0 0 20px', fontStyle: 'italic' }}>"{t.text}"</p>
                    {t.result && (
                      <div style={{ background: `${accentColor}15`, borderRadius: '8px', padding: '8px 12px', marginBottom: '16px', display: 'inline-block' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: accentColor, fontWeight: '700' }}>✓ {t.result}</p>
                      </div>
                    )}
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: '700' }}>{t.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7280' }}>{t.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        {pc.faq && pc.faq.length > 0 && (
          <div className="sp-section">
            <div className="sp-container">
              <p className="sp-label" style={{ color: accentColor }}>{pc.faq_title || 'Questions fréquentes'}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {pc.faq.map((item, i) => (
                  <div key={i} style={{ borderBottom: '0.5px solid #1F1F1F' }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: '100%', background: 'transparent', border: 'none', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '16px' }}
                    >
                      <span style={{ fontSize: '15px', fontWeight: '600', color: '#fff', lineHeight: '1.4' }}>{item.question}</span>
                      <span style={{ color: accentColor, flexShrink: 0 }}>{openFaq === i ? <MinusIcon /> : <PlusIcon />}</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ paddingBottom: '20px' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF', lineHeight: '1.7' }}>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GARANTIE */}
        <div className="sp-section-alt">
          <div className="sp-container" style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: `${accentColor}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: accentColor }}>
              <ShieldIcon />
            </div>
            <p className="sp-label" style={{ color: accentColor }}>{pc.guarantee_title || 'Garantie'}</p>
            <p style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#9CA3AF', lineHeight: '1.8', margin: '0 auto', maxWidth: '560px' }}>
              {pc.guarantee_text}
            </p>
          </div>
        </div>

        {/* TABLEAU DE VALEUR + PRIX FINAL */}
        <div className="sp-section">
          <div className="sp-container">
            <div style={{ background: '#111', borderRadius: '20px', border: `1px solid ${accentColor}30`, overflow: 'hidden', maxWidth: '560px', margin: '0 auto' }}>
              <div style={{ padding: '28px 32px', borderBottom: '0.5px solid #1F1F1F' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>{product.title}</h2>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Ce que tu obtiens</p>
              </div>
              {pc.value_items && pc.value_items.length > 0 && (
                <div style={{ padding: '20px 32px' }}>
                  {pc.value_items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < pc.value_items.length - 1 ? '0.5px solid #1F1F1F' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '20px', height: '20px', background: `${accentColor}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CheckSmall style={{ color: accentColor }} />
                        </div>
                        <span style={{ fontSize: '14px', color: '#9CA3AF' }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'line-through' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ padding: '24px 32px', background: `${accentColor}08`, borderTop: '0.5px solid #1F1F1F' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '42px', fontWeight: '800', color: accentColor, lineHeight: 1 }}>{product.price.toLocaleString('fr-FR')}</span>
                  <span style={{ fontSize: '16px', color: '#6B7280' }}>FCFA</span>
                  {product.original_price && product.original_price > product.price && (
                    <>
                      <span style={{ fontSize: '18px', color: '#444', textDecoration: 'line-through' }}>{product.original_price.toLocaleString('fr-FR')} FCFA</span>
                      <span style={{ background: '#EF444420', color: '#EF4444', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>-{discount}%</span>
                    </>
                  )}
                </div>
                {pc.urgency_text && (
                  <p style={{ fontSize: '13px', color: '#F59E0B', margin: '0 0 20px', fontWeight: '600' }}>⚡ {pc.urgency_text}</p>
                )}
                <button className="sp-cta-btn" onClick={() => setShowModal(true)} style={{ width: '100%', fontSize: '16px', padding: '18px', marginBottom: '12px', borderRadius: '10px' }}>
                  {ctaText} →
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>📲 Paiement Mobile Money sécurisé</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>🛡️ {pc.guarantee_title || 'Satisfait ou remboursé'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div style={{ padding: '72px 24px', textAlign: 'center', background: `linear-gradient(180deg, #0A0A0A 0%, ${accentColor}10 100%)`, borderTop: '0.5px solid #1F1F1F' }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '800', color: '#fff', margin: '0 0 16px', lineHeight: '1.2' }}>
              {pc.final_headline}
            </h2>
            <button className="sp-cta-btn" onClick={() => setShowModal(true)} style={{ fontSize: '18px', padding: '20px 56px', marginBottom: '16px' }}>
              {ctaText} →
            </button>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Paiement Mobile Money · 10 pays africains</p>
          </div>
        </div>

        <footer style={{ padding: '24px 16px', borderTop: '0.5px solid #1F1F1F', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>Propulsé par <Link href="/" style={{ color: accentColor, textDecoration: 'none', fontWeight: '600' }}>PayLink Africa</Link></p>
        </footer>

        {showModal && <CheckoutModal />}
      </div>
    )
  }

  // ============================================================
  // PAGE LIEN SIMPLE
  // ============================================================
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .pl-desktop { display: grid; grid-template-columns: 1fr 420px; max-width: 1100px; margin: 0 auto; padding: 40px 24px; align-items: start; }
        .pl-mobile { display: none; }
        @media (max-width: 767px) {
          .pl-desktop { display: none; }
          .pl-mobile { display: block; padding: 0 0 100px 0; }
        }
      `}</style>

      <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 24px', borderBottom: '0.5px solid #1F1F1F' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
      </nav>

      <div className="pl-desktop">
        <div style={{ paddingRight: '48px' }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '32px', border: '0.5px solid #1F1F1F' }} />
          ) : (
            <div style={{ width: '100%', height: '240px', background: '#111111', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', border: '0.5px solid #1F1F1F' }}><ProductIcon /></div>
          )}
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: '0 0 12px', lineHeight: '1.2' }}>{product.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: '#10B981' }}>{product.price.toLocaleString('fr-FR')} <span style={{ fontSize: '18px', color: '#6B7280', fontWeight: '400' }}>FCFA</span></span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span style={{ fontSize: '20px', color: '#6B7280', textDecoration: 'line-through' }}>{product.original_price.toLocaleString('fr-FR')} FCFA</span>
                <span style={{ background: '#EF444420', color: '#EF4444', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>-{discount}%</span>
              </>
            )}
          </div>
          {product.content && (
            <div style={{ borderTop: '0.5px solid #1F1F1F', paddingTop: '32px', marginBottom: '32px' }}>
              <div dangerouslySetInnerHTML={{ __html: product.content }} className="rich-content" style={{ fontSize: '15px' }} />
            </div>
          )}
        </div>
        <div style={{ position: 'sticky', top: '24px' }}>
          <div style={{ background: '#111111', borderRadius: '16px', border: '0.5px solid #1F1F1F', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '0.5px solid #1F1F1F', background: '#0D0D0D' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#6B7280' }}>Total à payer</p>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#10B981' }}>{total.toLocaleString('fr-FR')} <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>FCFA</span></p>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Votre nom</label>
                <input type="text" placeholder="Ex: Kofi Mensah" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} style={{ ...selectStyle, appearance: 'auto' as const }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Pays</label>
                <select value={selectedCountry.code} onChange={handleCountryChange} style={selectStyle}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Opérateur</label>
                <select value={selectedOperator.name} onChange={handleOperatorChange} style={{ ...selectStyle, color: selectedOperator.color }}>
                  {selectedCountry.operators.map(op => <option key={op.name} value={op.name} style={{ color: '#fff' }}>{op.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Numéro Mobile Money</label>
                <input type="tel" placeholder="Ex: 97 00 00 00" value={phone} onChange={handlePhoneChange} style={{ ...selectStyle, appearance: 'auto' as const }} />
              </div>
              <button onClick={handlePay} disabled={!buyerName || !phone} style={{ width: '100%', background: buyerName && phone ? '#10B981' : '#1A1A1A', border: 'none', color: buyerName && phone ? '#000' : '#444', fontSize: '15px', fontWeight: '700', padding: '16px', borderRadius: '10px', cursor: buyerName && phone ? 'pointer' : 'not-allowed', marginBottom: '12px' }}>
                {`Payer via ${selectedOperator.name} →`}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span style={{ color: '#444', display: 'flex' }}><LockIcon /></span>
                <span style={{ fontSize: '11px', color: '#444' }}>Paiement sécurisé · PayLink Africa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pl-mobile">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} style={{ width: '100%', maxHeight: '260px', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '200px', background: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ProductIcon /></div>
        )}
        <div style={{ padding: '20px 16px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '0 0 10px', lineHeight: '1.3' }}>{product.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#10B981' }}>{product.price.toLocaleString('fr-FR')} <span style={{ fontSize: '15px', color: '#6B7280', fontWeight: '400' }}>FCFA</span></span>
          </div>
          {product.content && (
            <div style={{ borderTop: '0.5px solid #1F1F1F', paddingTop: '20px', marginBottom: '20px' }}>
              <div dangerouslySetInnerHTML={{ __html: product.content }} className="rich-content" style={{ fontSize: '14px' }} />
            </div>
          )}
          <button onClick={() => setShowModal(true)} style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '16px', fontWeight: '700', padding: '18px', borderRadius: '12px', cursor: 'pointer' }}>
            Payer {total.toLocaleString('fr-FR')} FCFA →
          </button>
        </div>
      </div>

      {showModal && <CheckoutModal />}
    </div>
  )
}