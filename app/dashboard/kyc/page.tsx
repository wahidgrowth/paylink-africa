'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type KYCStatus = 'not_started' | 'pending' | 'approved' | 'rejected'

const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const FileIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>

export default function KYCPage() {
  const [status, setStatus] = useState<KYCStatus>('not_started')
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [idType, setIdType] = useState('cni')
  const [idNumber, setIdNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, kyc_status')
        .eq('id', user.id)
        .maybeSingle()
      if (profile) {
        setFirstName(profile.first_name || '')
        setLastName(profile.last_name || '')
        if (profile.kyc_status) setStatus(profile.kyc_status)
      }
    }
    getUser()
  }, [])

  const handleSubmit = async () => {
    if (!firstName || !lastName || !phone || !country || !idNumber) {
      setMessage('Tous les champs sont obligatoires.')
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({
      first_name: firstName,
      last_name: lastName,
      kyc_status: 'pending',
      kyc_phone: phone,
      kyc_country: country,
      kyc_id_type: idType,
      kyc_id_number: idNumber,
    }).eq('id', user.id)
    setStatus('pending')
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

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  }

  if (status === 'approved') return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Vérification KYC</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Statut de ton identité</p>
      </div>
      <div style={{ background: '#10B98115', borderRadius: '16px', padding: '40px', border: '1px solid #10B98140', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#000' }}>
          <CheckIcon />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>Identité vérifiée ✓</h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>
          Ton compte est vérifié. Tu bénéficies de toutes les fonctionnalités de PayLink Africa, y compris les retraits.
        </p>
      </div>
    </div>
  )

  if (status === 'pending') return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Vérification KYC</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Statut de ton identité</p>
      </div>
      <div style={{ background: '#F59E0B15', borderRadius: '16px', padding: '40px', border: '1px solid #F59E0B40', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: '#F59E0B20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#F59E0B' }}>
          <ClockIcon />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>Vérification en cours</h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 16px', lineHeight: '1.6' }}>
          Ton dossier a été soumis et est en cours de vérification. Délai habituel : 24 à 48h ouvrables.
        </p>
        <p style={{ fontSize: '13px', color: '#F59E0B', margin: 0 }}>
          Tu recevras une notification par email dès validation.
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '600px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Vérification KYC</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Vérifie ton identité pour accéder aux retraits et débloquer toutes les fonctionnalités</p>
      </div>

      {/* POURQUOI KYC */}
      <div style={{ background: '#10B98110', borderRadius: '12px', padding: '20px', border: '0.5px solid #10B98130', marginBottom: '28px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }}><ShieldIcon /></div>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Pourquoi vérifier mon identité ?</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
            La vérification KYC est requise par la réglementation financière pour activer les retraits Mobile Money et protéger ta boutique contre la fraude.
          </p>
        </div>
      </div>

      {/* ÉTAPES */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= s ? '#10B981' : '#1F1F1F', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* ÉTAPE 1 — Informations personnelles */}
      {step === 1 && (
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ color: '#10B981' }}><UserIcon /></div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#fff' }}>Informations personnelles</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Prénom *</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ex: Kofi" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Nom *</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Ex: Mensah" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Pays de résidence *</label>
            <select value={country} onChange={e => setCountry(e.target.value)} style={selectStyle}>
              <option value="">Sélectionne ton pays</option>
              <option value="BJ">Bénin</option>
              <option value="CI">Côte d'Ivoire</option>
              <option value="SN">Sénégal</option>
              <option value="TG">Togo</option>
              <option value="CM">Cameroun</option>
              <option value="ML">Mali</option>
              <option value="BF">Burkina Faso</option>
              <option value="GN">Guinée</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Numéro de téléphone *</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex: +229 01 96 00 00" style={inputStyle} />
          </div>

          <button
            onClick={() => {
              if (!firstName || !lastName || !country || !phone) { setMessage('Tous les champs sont obligatoires.'); return }
              setMessage('')
              setStep(2)
            }}
            style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '10px', cursor: 'pointer', marginTop: '20px' }}
          >
            Continuer →
          </button>
        </div>
      )}

      {/* ÉTAPE 2 — Document d'identité */}
      {step === 2 && (
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ color: '#10B981' }}><FileIcon /></div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#fff' }}>Document d'identité</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Type de document *</label>
            <select value={idType} onChange={e => setIdType(e.target.value)} style={selectStyle}>
              <option value="cni">Carte Nationale d'Identité (CNI)</option>
              <option value="passport">Passeport</option>
              <option value="permis">Permis de conduire</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Numéro du document *</label>
            <input type="text" value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="Ex: BJ12345678" style={inputStyle} />
          </div>

          <div style={{ background: '#0D0D0D', borderRadius: '10px', padding: '20px', border: '0.5px dashed #2a2a2a', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📎</div>
            <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>Envoie une copie de ton document</p>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#444' }}>JPG, PNG ou PDF — max 5MB</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.6' }}>
              Envoie le document par WhatsApp ou email après soumission.<br />
              Notre équipe vérifiera ton identité sous 24-48h.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', border: '0.5px solid #2a2a2a', color: '#9CA3AF', fontSize: '14px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
              Retour
            </button>
            <button
              onClick={() => {
                if (!idNumber) { setMessage('Le numéro du document est obligatoire.'); return }
                setMessage('')
                setStep(3)
              }}
              style={{ flex: 2, background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 — Confirmation */}
      {step === 3 && (
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ color: '#10B981' }}><ShieldIcon /></div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#fff' }}>Confirmation</p>
          </div>

          <div style={{ background: '#0D0D0D', borderRadius: '10px', padding: '16px', border: '0.5px solid #1F1F1F', marginBottom: '20px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Récapitulatif</p>
            {[
              { label: 'Nom complet', value: `${firstName} ${lastName}` },
              { label: 'Pays', value: country },
              { label: 'Téléphone', value: phone },
              { label: 'Document', value: idType === 'cni' ? 'CNI' : idType === 'passport' ? 'Passeport' : 'Permis de conduire' },
              { label: 'Numéro', value: idNumber },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? '0.5px solid #1F1F1F' : 'none' }}>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>{item.label}</span>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#F59E0B10', borderRadius: '8px', padding: '14px', border: '0.5px solid #F59E0B30', marginBottom: '20px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#F59E0B', lineHeight: '1.6' }}>
              Après soumission, envoie une copie de ton document par WhatsApp au <strong>+229 01 96 XX XX XX</strong> ou par email à <strong>support@paylinkafrica.com</strong>
            </p>
          </div>

          {message && (
            <div style={{ background: '#EF444415', border: '0.5px solid #EF444440', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
              <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{message}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, background: 'transparent', border: '0.5px solid #2a2a2a', color: '#9CA3AF', fontSize: '14px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
              Retour
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ flex: 2, background: loading ? '#059669' : '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Soumission...' : 'Soumettre ma vérification →'}
            </button>
          </div>
        </div>
      )}

      {message && step !== 3 && (
        <div style={{ background: '#EF444415', border: '0.5px solid #EF444440', borderRadius: '8px', padding: '12px 16px', marginTop: '16px' }}>
          <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{message}</p>
        </div>
      )}

    </div>
  )
}