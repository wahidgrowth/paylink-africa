'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

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
  user_id: string
}

const COUNTRIES = [
  {
    code: 'BJ', name: 'Bénin', flag: '🇧🇯',
    operators: [
      { name: 'MTN MoMo', color: '#FCD34D', bg: '#FCD34D20' },
      { name: 'Moov Money', color: '#60A5FA', bg: '#60A5FA20' },
      { name: 'Celtiis', color: '#A78BFA', bg: '#A78BFA20' },
    ]
  },
  {
    code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮',
    operators: [
      { name: 'MTN MoMo', color: '#FCD34D', bg: '#FCD34D20' },
      { name: 'Moov Money', color: '#60A5FA', bg: '#60A5FA20' },
      { name: 'Orange Money', color: '#FB923C', bg: '#FB923C20' },
      { name: 'Wave', color: '#A78BFA', bg: '#A78BFA20' },
    ]
  },
  {
    code: 'SN', name: 'Sénégal', flag: '🇸🇳',
    operators: [
      { name: 'Orange Money', color: '#FB923C', bg: '#FB923C20' },
      { name: 'Free Money', color: '#10B981', bg: '#10B98120' },
      { name: 'Wave', color: '#A78BFA', bg: '#A78BFA20' },
    ]
  },
  {
    code: 'TG', name: 'Togo', flag: '🇹🇬',
    operators: [
      { name: 'T-Money (Togocel)', color: '#EF4444', bg: '#EF444420' },
      { name: 'Moov Money', color: '#60A5FA', bg: '#60A5FA20' },
    ]
  },
  {
    code: 'CM', name: 'Cameroun', flag: '🇨🇲',
    operators: [
      { name: 'MTN MoMo', color: '#FCD34D', bg: '#FCD34D20' },
      { name: 'Orange Money', color: '#FB923C', bg: '#FB923C20' },
    ]
  },
  {
    code: 'ML', name: 'Mali', flag: '🇲🇱',
    operators: [
      { name: 'Orange Money', color: '#FB923C', bg: '#FB923C20' },
      { name: 'Moov (Malitel)', color: '#60A5FA', bg: '#60A5FA20' },
    ]
  },
  {
    code: 'BF', name: 'Burkina Faso', flag: '🇧🇫',
    operators: [
      { name: 'Orange Money', color: '#FB923C', bg: '#FB923C20' },
      { name: 'Moov Money', color: '#60A5FA', bg: '#60A5FA20' },
      { name: 'Coris Money', color: '#10B981', bg: '#10B98120' },
    ]
  },
  {
    code: 'GN', name: 'Guinée', flag: '🇬🇳',
    operators: [
      { name: 'MTN MoMo', color: '#FCD34D', bg: '#FCD34D20' },
      { name: 'Orange Money', color: '#FB923C', bg: '#FB923C20' },
    ]
  },
  {
    code: 'CD', name: 'RD Congo', flag: '🇨🇩',
    operators: [
      { name: 'Airtel Money', color: '#EF4444', bg: '#EF444420' },
      { name: 'Orange Money', color: '#FB923C', bg: '#FB923C20' },
      { name: 'M-Pesa', color: '#10B981', bg: '#10B98120' },
    ]
  },
  {
    code: 'NE', name: 'Niger', flag: '🇳🇪',
    operators: [
      { name: 'Airtel Money', color: '#EF4444', bg: '#EF444420' },
      { name: 'Orange Money', color: '#FB923C', bg: '#FB923C20' },
    ]
  },
]

const LockIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const CheckIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const ProductIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
const SadIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>

declare global {
  interface Window { fbq: (...args: unknown[]) => void }
}

export default function PaymentPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [pixelId, setPixelId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [selectedOperator, setSelectedOperator] = useState(COUNTRIES[0].operators[0])
  const [success, setSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const getProduct = async () => {
      const { data } = await supabase
        .from('payment_links')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_active', true)
        .single()

      if (data) {
        setProduct(data)
        await supabase.from('views').insert({ link_id: data.id })
        const { data: profile } = await supabase
          .from('profiles')
          .select('pixel_id')
          .eq('id', data.user_id)
          .maybeSingle()
        if (profile?.pixel_id) setPixelId(profile.pixel_id)
      }
      setLoading(false)
    }
    getProduct()
  }, [])

  useEffect(() => {
    if (!pixelId) return
    const script = document.createElement('script')
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)
  }, [pixelId])

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
    if (pixelId && window.fbq) {
      window.fbq('track', 'Purchase', { value: product?.price, currency: 'XOF' })
    }
    setSuccess(true)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value)
    if (pixelId && window.fbq) {
      window.fbq('track', 'InitiateCheckout', { value: product?.price, currency: 'XOF' })
    }
  }

  const fee = product ? Math.round(product.price * 0.01) : 0
  const total = product ? product.price + fee : 0
  const discount = product?.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0

  const selectStyle = {
    width: '100%',
    background: '#1A1A1A',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 16px',
    border: '0.5px solid #2a2a2a',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
    cursor: 'pointer',
    appearance: 'none' as const,
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
    </div>
  )

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
        <div style={{ width: '72px', height: '72px', background: '#10B98120', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckIcon />
        </div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>Paiement confirmé !</h1>
        <p style={{ color: '#6B7280', fontSize: '15px', margin: '0 0 24px', lineHeight: '1.6' }}>
          Merci {buyerName}. Ton paiement de <strong style={{ color: '#10B981' }}>{total.toLocaleString('fr-FR')} FCFA</strong> a bien été reçu.
        </p>
        {product.file_url && (
          <a href={product.file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto 16px' }}>
              <DownloadIcon /> Télécharger mon fichier
            </button>
          </a>
        )}
        <p style={{ color: '#444', fontSize: '12px', margin: 0 }}>Tu recevras une confirmation via {selectedOperator.name}.</p>
      </div>
    </div>
  )

  // FORMULAIRE CHECKOUT (réutilisé mobile + desktop)
  const CheckoutForm = () => (
    <div style={{ background: '#111111', borderRadius: '16px', border: '0.5px solid #1F1F1F', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '0.5px solid #1F1F1F', background: '#0D0D0D' }}>
        {product.original_price && product.original_price > product.price && (
          <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#6B7280', textDecoration: 'line-through' }}>
            {product.original_price.toLocaleString('fr-FR')} FCFA
          </p>
        )}
        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#6B7280' }}>Total à payer</p>
        <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#10B981' }}>
          {total.toLocaleString('fr-FR')} <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>FCFA</span>
        </p>
        {product.original_price && product.original_price > product.price && (
          <div style={{ display: 'inline-block', background: '#EF444420', color: '#EF4444', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', marginTop: '8px' }}>
            Tu économises {(product.original_price - product.price).toLocaleString('fr-FR')} FCFA
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: '500' }}>Votre nom</label>
          <input type="text" placeholder="Ex: Kofi Mensah" value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
            style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
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
          <input type="tel" placeholder="Ex: 97 00 00 00" value={phone} onChange={handlePhoneChange}
            style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', border: `0.5px solid ${selectedOperator.color}60`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
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
            <span style={{ fontSize: '14px', color: '#10B981', fontWeight: '700' }}>{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>

        <button onClick={handlePay} disabled={!buyerName || !phone}
          style={{ width: '100%', background: buyerName && phone ? '#10B981' : '#1A1A1A', border: 'none', color: buyerName && phone ? '#000' : '#444', fontSize: '15px', fontWeight: '700', padding: '16px', borderRadius: '10px', cursor: buyerName && phone ? 'pointer' : 'not-allowed', marginBottom: '12px' }}>
          {`Payer via ${selectedOperator.name} →`}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ color: '#444', display: 'flex' }}><LockIcon /></span>
          <span style={{ fontSize: '11px', color: '#444' }}>Paiement sécurisé · Propulsé par PayLink Africa</span>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 24px', borderBottom: '0.5px solid #1F1F1F' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
        </Link>
      </nav>

      {/* DESKTOP — 2 colonnes */}
      {!isMobile && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', alignItems: 'start', gap: '0' }}>
          <div style={{ paddingRight: '48px' }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '32px', border: '0.5px solid #1F1F1F' }} />
            ) : (
              <div style={{ width: '100%', height: '240px', background: '#111111', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', border: '0.5px solid #1F1F1F' }}>
                <ProductIcon />
              </div>
            )}
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: '0 0 12px', lineHeight: '1.2' }}>{product.title}</h1>
            {product.description && <p style={{ fontSize: '17px', color: '#9CA3AF', margin: '0 0 20px', lineHeight: '1.6' }}>{product.description}</p>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', color: '#10B981' }}>
                {product.price.toLocaleString('fr-FR')} <span style={{ fontSize: '18px', color: '#6B7280', fontWeight: '400' }}>FCFA</span>
              </span>
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
            <div style={{ borderTop: '0.5px solid #1F1F1F', paddingTop: '24px' }}>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Paiement accepté dans 10 pays</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {COUNTRIES.map(c => (
                  <div key={c.code} style={{ background: '#111111', border: '0.5px solid #1F1F1F', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', color: '#9CA3AF' }}>
                    {c.flag} {c.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ position: 'sticky', top: '24px' }}>
            <CheckoutForm />
          </div>
        </div>
      )}

      {/* MOBILE — 1 colonne */}
      {isMobile && (
        <div style={{ padding: '0 0 100px 0' }}>

          {/* IMAGE */}
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} style={{ width: '100%', maxHeight: '260px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '200px', background: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ProductIcon />
            </div>
          )}

          {/* INFOS PRODUIT */}
          <div style={{ padding: '20px 16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '0 0 10px', lineHeight: '1.3' }}>{product.title}</h1>
            {product.description && <p style={{ fontSize: '15px', color: '#9CA3AF', margin: '0 0 16px', lineHeight: '1.6' }}>{product.description}</p>}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span style={{ fontSize: '28px', fontWeight: '800', color: '#10B981' }}>
                {product.price.toLocaleString('fr-FR')} <span style={{ fontSize: '15px', color: '#6B7280', fontWeight: '400' }}>FCFA</span>
              </span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span style={{ fontSize: '16px', color: '#6B7280', textDecoration: 'line-through' }}>{product.original_price.toLocaleString('fr-FR')} FCFA</span>
                  <span style={{ background: '#EF444420', color: '#EF4444', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px' }}>-{discount}%</span>
                </>
              )}
            </div>

            {product.content && (
              <div style={{ borderTop: '0.5px solid #1F1F1F', paddingTop: '20px', marginBottom: '20px' }}>
                <div dangerouslySetInnerHTML={{ __html: product.content }} className="rich-content" style={{ fontSize: '14px' }} />
              </div>
            )}

            <div style={{ borderTop: '0.5px solid #1F1F1F', paddingTop: '16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Accepté dans 10 pays</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {COUNTRIES.map(c => (
                  <div key={c.code} style={{ background: '#111111', border: '0.5px solid #1F1F1F', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', color: '#9CA3AF' }}>
                    {c.flag}
                  </div>
                ))}
              </div>
            </div>

            {/* CHECKOUT INLINE MOBILE */}
            {!showCheckout ? (
              <button
                onClick={() => setShowCheckout(true)}
                style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '16px', fontWeight: '700', padding: '18px', borderRadius: '12px', cursor: 'pointer' }}
              >
                Payer {total.toLocaleString('fr-FR')} FCFA →
              </button>
            ) : (
              <div style={{ marginTop: '8px' }}>
                <CheckoutForm />
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}