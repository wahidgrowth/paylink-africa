'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'

type Product = { id: string; title: string; description: string; price: number; slug: string; user_id: string }

export default function PaymentPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [operator, setOperator] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [step, setStep] = useState<'page' | 'checkout' | 'success'>('page')
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const getProduct = async () => {
      const { data } = await supabase.from('payment_links').select('*').eq('slug', params.slug).eq('is_active', true).single()
      if (data) setProduct(data)
      setLoading(false)
    }
    getProduct()
  }, [])

  const detectOperator = (phone: string) => {
    const prefix = phone.replace(/\s/g, '').slice(0, 2)
    if (['96', '97', '67', '61', '62'].includes(prefix)) return 'MTN'
    if (['99', '98', '69', '65'].includes(prefix)) return 'Moov'
    if (['07', '06', '08'].includes(prefix)) return 'Orange'
    if (['07', '70', '75', '76', '77', '78'].includes(prefix)) return 'Wave'
    return ''
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setPhone(val)
    setOperator(detectOperator(val))
  }

  const fee = product ? Math.round(product.price * 0.01) : 0
  const total = product ? product.price + fee : 0

  if (loading) return <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#6B7280' }}>Chargement...</p></div>

  if (!product) return <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#fff' }}>Produit introuvable.</p></div>

  if (step === 'success') return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ width: '64px', height: '64px', background: '#10B98120', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>✓</div>
        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '600', margin: '0 0 8px' }}>Paiement confirme !</h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Merci {buyerName}. Votre paiement a ete recu.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '8px', paddingTop: '20px' }}>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>PayLink Africa</span>
        </div>

        <div style={{ background: '#111111', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid #1F1F1F' }}>
          <div style={{ height: '6px', background: '#10B981' }}></div>
          <div style={{ padding: '24px' }}>
            <div style={{ background: '#1A1A1A', borderRadius: '10px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '0.5px solid #2a2a2a' }}>
              <span style={{ fontSize: '12px', color: '#444' }}>Image du produit</span>
            </div>

            <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: '0 0 8px' }}>{product.title}</h1>
            {product.description && <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 16px', lineHeight: '1.5' }}>{product.description}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#10B981' }}>{product.price.toLocaleString()} <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '400' }}>FCFA</span></span>
              <span style={{ fontSize: '11px', background: '#10B98118', color: '#10B981', padding: '4px 10px', borderRadius: '6px' }}>Mobile Money</span>
            </div>

            {step === 'page' && (
              <button onClick={() => setStep('checkout')} style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '15px', fontWeight: '700', padding: '14px', borderRadius: '10px', cursor: 'pointer' }}>
                Payer maintenant
              </button>
            )}

            {step === 'checkout' && (
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <input type="text" placeholder="Votre nom" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <input type="tel" placeholder="Numero Mobile Money" value={phone} onChange={handlePhoneChange} style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                  {operator && <p style={{ fontSize: '12px', color: '#10B981', margin: '6px 0 0' }}>{operator} detecte</p>}
                </div>
                <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '12px', marginBottom: '16px', border: '0.5px solid #1F1F1F' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>Produit</span>
                    <span style={{ fontSize: '12px', color: '#fff' }}>{product.price.toLocaleString()} FCFA</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>Frais Mobile Money</span>
                    <span style={{ fontSize: '12px', color: '#F59E0B' }}>{fee.toLocaleString()} FCFA</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '0.5px solid #1F1F1F' }}>
                    <span style={{ fontSize: '12px', color: '#fff', fontWeight: '500' }}>Total</span>
                    <span style={{ fontSize: '12px', color: '#fff', fontWeight: '600' }}>{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
                <button onClick={() => setStep('success')} style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '15px', fontWeight: '700', padding: '14px', borderRadius: '10px', cursor: 'pointer' }}>
                  Payer {total.toLocaleString()} FCFA
                </button>
                <p style={{ fontSize: '11px', color: '#444', textAlign: 'center', margin: '10px 0 0' }}>MTN · Moov · Orange · Wave</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}