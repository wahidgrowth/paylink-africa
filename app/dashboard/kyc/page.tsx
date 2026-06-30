'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type KYCStatus = 'not_started' | 'pending' | 'approved' | 'rejected'

const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const AttachIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
const CameraIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>

export default function KYCPage() {
  const [status, setStatus] = useState<KYCStatus>('not_started')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [idFront, setIdFront] = useState<File | null>(null)
  const [idBack, setIdBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
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
    if (!firstName || !lastName || !phone || !country) {
      setMessage('Tous les champs sont obligatoires.')
      return
    }
    if (!idFront || !idBack || !selfie) {
      setMessage('Les 3 documents sont obligatoires : recto, verso et photo personnelle.')
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let idFrontUrl = null
    let idBackUrl = null
    let selfieUrl = null

    try {
      const frontExt = idFront.name.split('.').pop()
      const frontPath = `${user.id}/kyc-front-${Date.now()}.${frontExt}`
      await supabase.storage.from('product-images').upload(frontPath, idFront, { upsert: true })
      idFrontUrl = supabase.storage.from('product-images').getPublicUrl(frontPath).data.publicUrl

      const backExt = idBack.name.split('.').pop()
      const backPath = `${user.id}/kyc-back-${Date.now()}.${backExt}`
      await supabase.storage.from('product-images').upload(backPath, idBack, { upsert: true })
      idBackUrl = supabase.storage.from('product-images').getPublicUrl(backPath).data.publicUrl

      const selfieExt = selfie.name.split('.').pop()
      const selfiePath = `${user.id}/kyc-selfie-${Date.now()}.${selfieExt}`
      await supabase.storage.from('product-images').upload(selfiePath, selfie, { upsert: true })
      selfieUrl = supabase.storage.from('product-images').getPublicUrl(selfiePath).data.publicUrl
    } catch {
      setMessage('Erreur lors de l\'envoi des documents. Réessaie.')
      setLoading(false)
      return
    }

    await supabase.from('profiles').update({
      first_name: firstName,
      last_name: lastName,
      kyc_status: 'pending',
      kyc_phone: phone,
      kyc_country: country,
      kyc_id_front_url: idFrontUrl,
      kyc_id_back_url: idBackUrl,
      kyc_selfie_url: selfieUrl,
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

  const selectStyle = { ...inputStyle, cursor: 'pointer' }

  const UploadBox = ({ file, onChange, label, icon, id }: { file: File | null; onChange: (f: File) => void; label: string; icon: React.ReactNode; id: string }) => (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>{label} *</label>
      <div
        onClick={() => document.getElementById(id)?.click()}
        style={{ background: file ? '#10B98110' : '#0D0D0D', borderRadius: '10px', padding: '20px', border: `0.5px dashed ${file ? '#10B98140' : '#2a2a2a'}`, textAlign: 'center', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{icon}</div>
        {file ? (
          <p style={{ margin: 0, fontSize: '13px', color: '#10B981', fontWeight: '600' }}>✓ {file.name}</p>
        ) : (
          <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>Clique pour ajouter une photo</p>
        )}
      </div>
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f) }}
        style={{ display: 'none' }}
      />
    </div>
  )

  if (status === 'approved') return (
    <div style={{ padding: '32px' }}>
      <div style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Vérification KYC</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Statut de ton identité</p>
        </div>
        <div style={{ background: '#10B98115', borderRadius: '16px', padding: '40px', border: '1px solid #10B98140', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#000' }}>
            <CheckIcon />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>Identité vérifiée</h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>
            Ton compte est vérifié. Tu bénéficies de toutes les fonctionnalités de PayLink Africa, y compris les retraits.
          </p>
        </div>
      </div>
    </div>
  )

  if (status === 'pending') return (
    <div style={{ padding: '32px' }}>
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
            Tu recevras une notification dès validation.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '32px' }}>
      <style>{`
        @media (max-width: 767px) {
          .kyc-wrap { padding: 16px !important; }
          .kyc-inner { max-width: 100% !important; }
          .kyc-name-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="kyc-inner" style={{ maxWidth: '600px' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Vérification KYC</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Vérifie ton identité pour accéder aux retraits</p>
        </div>

        {/* POURQUOI KYC */}
        <div style={{ background: '#10B98110', borderRadius: '12px', padding: '20px', border: '0.5px solid #10B98130', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }}><ShieldIcon /></div>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Pourquoi vérifier mon identité ?</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
              La vérification KYC est requise pour activer les retraits Mobile Money et protéger ton compte contre la fraude.
            </p>
          </div>
        </div>

        {/* INFOS PERSONNELLES */}
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '16px' }}>
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#10B981', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Informations personnelles</p>
          <div className="kyc-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Prénom *</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ex: Kofi" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Nom *</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Ex: Mensah" style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Pays de résidence *</label>
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
            <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Numéro de téléphone *</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex: +229 01 96 00 00" style={inputStyle} />
          </div>
        </div>

        {/* DOCUMENTS */}
        <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#10B981', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Documents</p>
          <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
            Pièce d'identité (recto et verso) + une photo de toi tenant un papier avec la date d'aujourd'hui écrite dessus.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <UploadBox file={idFront} onChange={setIdFront} label="Pièce d'identité — Recto" icon={<AttachIcon />} id="id-front" />
            <UploadBox file={idBack} onChange={setIdBack} label="Pièce d'identité — Verso" icon={<AttachIcon />} id="id-back" />
            <UploadBox file={selfie} onChange={setSelfie} label="Photo de toi avec papier daté" icon={<CameraIcon />} id="id-selfie" />
          </div>
        </div>

        {message && (
          <div style={{ background: '#EF444415', border: '0.5px solid #EF444440', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
            <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{message}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', background: loading ? '#059669' : '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Envoi en cours...' : 'Soumettre ma vérification →'}
        </button>

      </div>
    </div>
  )
}