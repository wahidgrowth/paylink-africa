'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/components/Logo'

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const levels = [
    { score: 0, label: '', color: '#1F1F1F' },
    { score: 1, label: 'Faible', color: '#EF4444' },
    { score: 2, label: 'Moyen', color: '#F59E0B' },
    { score: 3, label: 'Bon', color: '#10B981' },
    { score: 4, label: 'Fort', color: '#10B981' },
  ]
  return levels[score]
}

const MoneyIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const PhoneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const AiIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const GlobeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const EyeOnIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const strength = getPasswordStrength(password)

  const handleAuth = async () => {
    if (!isLogin && !acceptedTerms) {
      setMessage('Veuillez accepter les CGU et la politique de confidentialité.')
      return
    }
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage('Email ou mot de passe incorrect.')
      else router.push('/dashboard')
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message || "Erreur lors de l'inscription.")
      } else if (data.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, first_name: firstName, last_name: lastName })
        router.push('/dashboard')
      }
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

  const avantages = [
    { icon: <MoneyIcon />, title: '1% de commission seulement', desc: "Les concurrents prennent jusqu'à 15%. Pas nous." },
    { icon: <PhoneIcon />, title: 'MTN, Moov, Orange, Wave', desc: "Détection automatique de l'opérateur par numéro." },
    { icon: <AiIcon />, title: 'Audit IA inclus', desc: "Notre IA analyse ta page et optimise tes conversions." },
    { icon: <GlobeIcon />, title: '9+ pays africains', desc: 'Bénin, CI, Sénégal, Togo, Cameroun et plus encore.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}>

      <style>{`
        .auth-left { display: flex; }
        .auth-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .auth-container { display: flex; min-height: 100vh; }
        .auth-mobile-header { display: none; }
        .auth-mobile-avantages { display: none; }

        @media (max-width: 767px) {
          .auth-container { flex-direction: column; }
          .auth-left { display: none !important; }
          .auth-right { padding: 24px 16px 40px; align-items: flex-start; }
          .auth-mobile-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 0.5px solid #1F1F1F; }
          .auth-mobile-avantages { display: block; margin-top: 32px; }
        }
      `}</style>

      {/* HEADER MOBILE */}
      <div className="auth-mobile-header">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
        </Link>
        <Link href="/" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>← Retour</Link>
      </div>

      <div className="auth-container">

        {/* PANNEAU GAUCHE — Desktop only */}
        <div className="auth-left" style={{ flex: 1, background: '#111111', borderRight: '0.5px solid #1F1F1F', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ padding: '60px 48px 0', position: 'relative', zIndex: 2 }}>
            <Link href="/" style={{ textDecoration: 'none', marginBottom: '48px', display: 'inline-block' }}>
              <Logo size="md" />
            </Link>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 12px', lineHeight: '1.3' }}>
              Vends partout en Afrique.<br /><span style={{ color: '#10B981' }}>Garde presque tout.</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 40px', lineHeight: '1.7' }}>
              Crée ta page de vente, partage ton lien Mobile Money et encaisse en quelques secondes.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {avantages.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: '#10B98115', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGE — remplit l'espace restant en bas */}
          <div style={{ flex: 1, position: 'relative', marginTop: '32px', minHeight: '260px' }}>
            <Image
              src="/auth-illustration.jpg"
              alt=""
              fill
              priority
              sizes="50vw"
              style={{ objectFit: 'cover' }}
            />
            {/* Dégradé pour fondre l'image dans le fond du panneau */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #111111 0%, rgba(17,17,17,0) 25%, rgba(17,17,17,0) 70%, #111111 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #111111 0%, rgba(17,17,17,0) 15%)' }} />
          </div>
        </div>

        {/* PANNEAU DROIT — Formulaire */}
        <div className="auth-right">
          <div style={{ width: '100%', maxWidth: '400px' }}>

            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', margin: '0 0 4px' }}>
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h1>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 28px' }}>
              {isLogin ? 'Content de te revoir' : 'Gratuit. Sans carte bancaire.'}
            </p>

            {!isLogin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
              </div>
            )}

            <input type="email" placeholder="Adresse email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, marginBottom: '10px' }} />

            <div style={{ position: 'relative', marginBottom: !isLogin && password ? '8px' : '20px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '44px' }}
              />
              <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6B7280', display: 'flex' }}>
                {showPassword ? <EyeOffIcon /> : <EyeOnIcon />}
              </span>
            </div>

            {!isLogin && password && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map((level) => (
                    <div key={level} style={{ flex: 1, height: '3px', borderRadius: '2px', background: strength.score >= level ? strength.color : '#1F1F1F' }} />
                  ))}
                </div>
                {strength.label && <p style={{ margin: 0, fontSize: '11px', color: strength.color }}>{strength.label}</p>}
              </div>
            )}

            {!isLogin && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
                <div onClick={() => setAcceptedTerms(!acceptedTerms)} style={{ width: '18px', height: '18px', borderRadius: '4px', border: `1.5px solid ${acceptedTerms ? '#10B981' : '#2a2a2a'}`, background: acceptedTerms ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: '1px' }}>
                  {acceptedTerms && <span style={{ color: '#000', fontSize: '11px', fontWeight: '700' }}>✓</span>}
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.6' }}>
                  J'accepte les{' '}
                  <Link href="/legal/cgu" style={{ color: '#10B981', textDecoration: 'none' }} target="_blank">CGU</Link>
                  {' '}et la{' '}
                  <Link href="/legal/confidentialite" style={{ color: '#10B981', textDecoration: 'none' }} target="_blank">Politique de Confidentialité</Link>
                </p>
              </div>
            )}

            <button onClick={handleAuth} disabled={loading}
              style={{ width: '100%', background: loading ? '#059669' : '#10B981', border: 'none', color: '#000', fontWeight: '700', fontSize: '14px', padding: '14px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Chargement...' : isLogin ? 'Se connecter →' : 'Créer mon compte gratuitement →'}
            </button>

            {message && (
              <div style={{ marginTop: '16px', background: '#EF444415', border: '0.5px solid #EF444440', borderRadius: '8px', padding: '12px 16px' }}>
                <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{message}</p>
              </div>
            )}

            <p style={{ color: '#6B7280', marginTop: '20px', fontSize: '13px', textAlign: 'center' }}>
              {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
              <span onClick={() => { setIsLogin(!isLogin); setMessage('') }} style={{ color: '#10B981', cursor: 'pointer', fontWeight: '600' }}>
                {isLogin ? "S'inscrire gratuitement" : 'Se connecter'}
              </span>
            </p>

            <p style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link href="/" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>← Retour à l'accueil</Link>
            </p>

            {/* AVANTAGES MOBILE */}
            <div className="auth-mobile-avantages">
              <div style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
                <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 16px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Pourquoi PayLink Africa ?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {avantages.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '32px', height: '32px', background: '#10B98115', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#fff' }}>{item.title}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}