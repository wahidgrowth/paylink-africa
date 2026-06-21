'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message || 'Erreur de connexion')
      else router.push('/dashboard')
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message || error.code || 'Erreur inscription')
      } else if (data.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, first_name: firstName, last_name: lastName })
        router.push('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#111111', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '420px', border: '0.5px solid #1F1F1F' }}>
        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>PayLink <span style={{ color: '#10B981' }}>Africa</span></h1>
        <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 28px' }}>{isLogin ? 'Connexion' : 'Creer un compte'}</p>

        {!isLogin && (
          <>
            <input type="text" placeholder="Prenom" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
          </>
        )}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />

        <button onClick={handleAuth} disabled={loading} style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontWeight: '700', fontSize: '14px', padding: '14px', borderRadius: '10px', cursor: 'pointer' }}>
          {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
        </button>

        {message && <p style={{ color: '#F59E0B', marginTop: '16px', fontSize: '13px' }}>{message}</p>}

        <p style={{ color: '#6B7280', marginTop: '16px', fontSize: '13px', textAlign: 'center' }}>
          {isLogin ? 'Pas encore de compte ?' : 'Deja un compte ?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#10B981', cursor: 'pointer' }}>
            {isLogin ? "S'inscrire" : 'Se connecter'}
          </span>
        </p>
      </div>
    </div>
  )
}