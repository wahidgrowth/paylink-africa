'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
        setMessage(error.message || 'Erreur lors de l\'inscription.')
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

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

      {/* PANNEAU GAUCHE — Avantages (visible desktop) */}
      <div style={{ flex: 1, background: '#111111', borderRight: '0.5px solid #1F1F1F', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
          <div style={{ width: '36px', height: '36px', background: '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', color: '#000' }}>P</div>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>PayLink <span style={{ color: '#10B981' }}>Africa</span></span>
        </Link>

        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 12px', lineHeight: '1.3' }}>
          Vends partout en Afrique.<br /><span style={{ color: '#10B981' }}>Garde presque tout.</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 48px', lineHeight: '1.7' }}>
          Crée ta page de vente, partage ton lien Mobile Money et encaisse en quelques secondes.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { icon: '💸', title: '1% de commission seulement', desc: 'Les concurrents prennent jusqu\'à 15%. Pas nous.' },
            { icon: '📱', title: 'MTN, Moov, Orange, Wave', desc: 'Détection automatique de l\'opérateur par numéro.' },
            { icon: '🤖', title: 'Audit IA inclus', desc: 'Claude analyse ta page et optimise tes conversions.' },
            { icon: '🌍', title: '9+ pays africains', desc: 'Bénin, CI, Sénégal, Togo, Cameroun et plus encore.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', background: '#10B98115', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>{item.title}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PANNEAU DROIT — Formulaire */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', margin: '0 0 4px' }}>
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 32px' }}>
            {isLogin ? 'Content de te revoir 👋' : 'Gratuit. Sans carte bancaire.'}
          </p>

          {!isLogin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...inputStyle, marginBottom: '12px' }}
          />

          {/* Mot de passe avec œil */}
          <div style={{ position: 'relative', marginBottom: !isLogin && password ? '8px' : '20px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: '44px' }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px', color: '#6B7280' }}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          {/* Barre de force du mot de passe */}
          {!isLogin && password && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3, 4].map((level) => (
                  <div key={level} style={{ flex: 1, height: '3px', borderRadius: '2px', background: strength.score >= level ? strength.color : '#1F1F1F', transition: 'background 0.3s' }} />
                ))}
              </div>
              {strength.label && (
                <p style={{ margin: 0, fontSize: '11px', color: strength.color }}>{strength.label}</p>
              )}
            </div>
          )}

          {/* Checkbox CGU */}
          {!isLogin && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
              <div
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                style={{ width: '18px', height: '18px', borderRadius: '4px', border: `1.5px solid ${acceptedTerms ? '#10B981' : '#2a2a2a'}`, background: acceptedTerms ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: '1px' }}
              >
                {acceptedTerms && <span style={{ color: '#000', fontSize: '11px', fontWeight: '700' }}>✓</span>}
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.6' }}>
                J'accepte les{' '}
                <Link href="/legal/cgu" style={{ color: '#10B981', textDecoration: 'none' }} target="_blank">Conditions Générales d'Utilisation</Link>
                {' '}et la{' '}
                <Link href="/legal/confidentialite" style={{ color: '#10B981', textDecoration: 'none' }} target="_blank">Politique de Confidentialité</Link>
              </p>
            </div>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            style={{ width: '100%', background: loading ? '#059669' : '#10B981', border: 'none', color: '#000', fontWeight: '700', fontSize: '14px', padding: '14px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {loading ? 'Chargement...' : isLogin ? 'Se connecter →' : "Créer mon compte gratuitement →"}
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

          <p style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>← Retour à l'accueil</Link>
          </p>

        </div>
      </div>

    </div>
  )
}