'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

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

const OPERATORS = [
  { name: 'MTN', color: '#FCD34D', bg: '#FCD34D20', prefixes: ['96', '97', '67', '61', '62'] },
  { name: 'Moov', color: '#60A5FA', bg: '#60A5FA20', prefixes: ['99', '98', '69', '65'] },
  { name: 'Orange', color: '#FB923C', bg: '#FB923C20', prefixes: ['07', '06', '08'] },
  { name: 'Wave', color: '#A78BFA', bg: '#A78BFA20', prefixes: ['70', '75', '76', '77', '78'] },
]

export default function PaymentPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [operator, setOperator] = useState<typeof OPERATORS[0] | null>(null)
  const [buyerName, setBuyerName] = useState('')
  const [success, setSuccess] = useState(false)
  const params = useParams()
  const supabase = createClient()

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
      }
      setLoading(false)
    }
    getProduct()
  }, [])

  const detectOperator = (phone: string) => {
    const prefix = phone.replace(/\s/g, '').slice(0, 2)
    return OPERATORS.find(op => op.prefixes.includes(prefix)) || null
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setPhone(val)
    setOperator(detectOperator(val))
  }

  const fee = product ? Math.round(product.price * 0.01) : 0
  const total = product ? product.price + fee : 0
  const discount = product?.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
    </div>
  )

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '40px', margin: '0 0 16px' }}>😕</p>
        <p style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: '0 0 8px' }}>Produit introuvable</p>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Ce lien n'existe pas ou a été désactivé.</p>
      </div>
    </div>
  )

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '40px', maxWidth: '400px' }}>
        <div style={{ width: '72px', height: '72px', background: '#10B98120', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>✅</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>Paiement confirmé !</h1>
        <p style={{ color: '#6B7280', fontSize: '15px', margin: '0 0 24px', lineHeight: '1.6' }}>
          Merci {buyerName}. Ton paiement de <strong style={{ color: '#10B981' }}>{total.toLocaleString('fr-FR')} FCFA</strong> a bien été reçu.
        </p>
        {product.file_url && (
          <a href={product.file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', marginBottom: '16px' }}>
              📄 Télécharger mon fichier →
            </button>
          </a>
        )}
        <p style={{ color: '#444', fontSize: '12px', margin: 0 }}>Tu recevras une confirmation via {operator?.name || 'Mobile Money'}.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 24px', borderBottom: '0.5px solid #1F1F1F' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: '#10B981', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', color: '#000' }}>P</div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>PayLink <span style={{ color: '#10B981' }}>Africa</span></span>
        </Link>
      </nav>

      {/* LAYOUT 2 COLONNES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '0', maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', alignItems: 'start' }}>

        {/* COLONNE GAUCHE */}
        <div style={{ paddingRight: '48px' }}>

          {/* Image */}
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '32px', border: '0.5px solid #1F1F1F' }} />
          ) : (
            <div style={{ width: '100%', height: '240px', background: '#111111', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', border: '0.5px solid #1F1F1F' }}>
              <span style={{ fontSize: '48px' }}>🛍️</span>
            </div>
          )}

          {/* Titre */}
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: '0 0 12px', lineHeight: '1.2' }}>{product.title}</h1>

          {/* Description courte */}
          {product.description && (
            <p style={{ fontSize: '17px', color: '#9CA3AF', margin: '0 0 20px', lineHeight: '1.6' }}>{product.description}</p>
          )}

          {/* Prix */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: '#10B981' }}>
              {product.price.toLocaleString('fr-FR')} <span style={{ fontSize: '18px', color: '#6B7280', fontWeight: '400' }}>FCFA</span>
            </span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span style={{ fontSize: '20px', color: '#6B7280', textDecoration: 'line-through' }}>
                  {product.original_price.toLocaleString('fr-FR')} FCFA
                </span>
                <span style={{ background: '#EF444420', color: '#EF4444', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Contenu riche */}
          {product.content && (
            <div style={{ borderTop: '0.5px solid #1F1F1F', paddingTop: '32px', marginBottom: '32px' }}>
              <div
                dangerouslySetInnerHTML={{ __html: product.content }}
                className="rich-content"
                style={{ fontSize: '15px' }}
              />
            </div>
          )}

          {/* Opérateurs */}
          <div style={{ borderTop: '0.5px solid #1F1F1F', paddingTop: '24px' }}>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Paiement accepté via</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {OPERATORS.map(op => (
                <div key={op.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: op.bg, border: `0.5px solid ${op.color}30`, borderRadius: '8px', padding: '8px 14px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: op.color }} />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: op.color }}>{op.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* COLONNE DROITE — Checkout sticky */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <div style={{ background: '#111111', borderRadius: '16px', border: '0.5px solid #1F1F1F', overflow: 'hidden' }}>

            {/* Header */}
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
                  Tu économises {(product.original_price - product.price).toLocaleString('fr-FR')} FCFA 🎉
                </div>
              )}
            </div>

            <div style={{ padding: '24px' }}>

              {/* Nom */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: '500' }}>Votre nom</label>
                <input
                  type="text"
                  placeholder="Ex: Kofi Mensah"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Téléphone */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: '500' }}>Numéro Mobile Money</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    placeholder="Ex: 97 00 00 00"
                    value={phone}
                    onChange={handlePhoneChange}
                    style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', border: `0.5px solid ${operator ? operator.color + '60' : '#2a2a2a'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  />
                  {operator && (
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: operator.bg, border: `0.5px solid ${operator.color}40`, borderRadius: '6px', padding: '3px 10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: operator.color }}>{operator.name}</span>
                    </div>
                  )}
                </div>
                {!operator && phone.length >= 2 && (
                  <p style={{ fontSize: '11px', color: '#F59E0B', margin: '4px 0 0' }}>Opérateur non reconnu</p>
                )}
              </div>

              {/* Récap */}
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

              {/* Bouton */}
              <button
                onClick={() => { if (buyerName && phone) setSuccess(true) }}
                disabled={!buyerName || !phone}
                style={{ width: '100%', background: buyerName && phone ? '#10B981' : '#1A1A1A', border: 'none', color: buyerName && phone ? '#000' : '#444', fontSize: '15px', fontWeight: '700', padding: '16px', borderRadius: '10px', cursor: buyerName && phone ? 'pointer' : 'not-allowed', transition: 'all 0.2s', marginBottom: '12px' }}
              >
                {operator ? `Payer via ${operator.name} →` : 'Payer maintenant →'}
              </button>

              {/* Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px' }}>🔒</span>
                <span style={{ fontSize: '11px', color: '#444' }}>Paiement sécurisé · Propulsé par PayLink Africa</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}