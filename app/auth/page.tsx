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

const EyeOnIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
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

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: '6px',
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
    <div style={{ height: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

      <style>{`
        .auth-left { display: flex; }
        .auth-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .auth-container { display: flex; min-height: 100vh; }
        .auth-mobile-header { display: none; }

        @media (max-width: 767px) {
          .auth-container { flex-direction: column; }
          .auth-left { display: none !important; }
          .auth-right { padding: 24px 16px 40px; align-items: flex-start; }
          .auth-mobile-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 0.5px solid #1F1F1F; }
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
        <div className="auth-left" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Image
            src="/auth-illustration.jpg"
            alt=""
            fill
            priority
            sizes="50vw"
            style={{ objectFit: 'cover' }}
          />
          {/* Dégradé pour lisibilité du texte en bas */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.75) 25%, rgba(10,10,10,0.1) 55%, rgba(10,10,10,0.4) 100%)' }} />

          {/* Logo en haut */}
          <div style={{ position: 'absolute', top: '40px', left: '48px', zIndex: 2 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Logo size="md" />
            </Link>
          </div>

          {/* Texte en bas */}
          <div style={{ position: 'absolute', bottom: '56px', left: '48px', right: '48px', zIndex: 2 }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: '0 0 12px', lineHeight: '1.25' }}>
              Un lien, tous les pays,<br />tout ton argent.
            </h2>
            <p style={{ fontSize: '14px', color: '#D1D5DB', margin: 0, lineHeight: '1.6' }}>
              Paiements simplifiés, conversions optimisées grâce à PayLink Africa.
            </p>
          </div>
        </div>

        {/* PANNEAU DROIT — Formulaire */}
        <div className="auth-right">
          <div style={{ width: '100%', maxWidth: '400px' }}>

            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', margin: '0 0 4px' }}>
              {isLogin ? 'Connexion à votre compte' : 'Créer un compte'}
            </h1>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 28px' }}>
              {isLogin ? 'Entrez votre e-mail et mot de passe pour vous connecter' : 'Gratuit. Sans carte bancaire.'}
            </p>

            {!isLogin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Prénom</label>
                  <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Nom</label>
                  <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Adresse e-mail</label>
              <input type="email" placeholder="email@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: !isLogin && password ? '8px' : '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Mot de passe</label>
                {isLogin && (
                  <Link href="/auth/mot-de-passe-oublie" style={{ fontSize: '12px', color: '#10B981', textDecoration: 'underline' }}>
                    Mot de passe oublié ?
                  </Link>
                )}
              </div>
              <div style={{ position: 'relative' }}>
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
            </div>

            {!isLogin && password && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map((level) => (
                    <div key={level} style={{ flex: 1, height: '3px', borderRadius: '2px', background: strength.score >= level ? strength.color : '#1F1F1F' }} />
                  ))}
                </div>
                {strength.label && <p style={{ margin: 0, fontSize: '11px', color: strength.color }}>{strength.label}</p>}
              </div>
            )}

            {isLogin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div onClick={() => setRememberMe(!rememberMe)} style={{ width: '18px', height: '18px', borderRadius: '4px', border: `1.5px solid ${rememberMe ? '#10B981' : '#2a2a2a'}`, background: rememberMe ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  {rememberMe && <span style={{ color: '#000', fontSize: '11px', fontWeight: '700' }}>✓</span>}
                </div>
                <p onClick={() => setRememberMe(!rememberMe)} style={{ margin: 0, fontSize: '13px', color: '#D1D5DB', cursor: 'pointer' }}>
                  Se souvenir de moi
                </p>
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
              {loading ? 'Chargement...' : isLogin ? 'Connexion' : 'Créer mon compte gratuitement →'}
            </button>

            {message && (
              <div style={{ marginTop: '16px', background: '#EF444415', border: '0.5px solid #EF444440', borderRadius: '8px', padding: '12px 16px' }}>
                <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{message}</p>
              </div>
            )}

            <p style={{ color: '#6B7280', marginTop: '20px', fontSize: '13px', textAlign: 'center' }}>
              {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
              <span onClick={() => { setIsLogin(!isLogin); setMessage('') }} style={{ color: '#10B981', cursor: 'pointer', fontWeight: '600' }}>
                {isLogin ? "Ouvrir un compte" : 'Se connecter'}
              </span>
            </p>

            <p style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link href="/" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>← Retour à l'accueil</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}