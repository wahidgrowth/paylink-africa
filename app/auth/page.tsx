'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      if (error) setMessage(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Vérifie ton email pour confirmer ton compte !')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-white text-2xl font-bold mb-2">PayLink Africa</h1>
        <p className="text-zinc-400 mb-6">{isLogin ? 'Connexion' : 'Créer un compte'}</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 mb-3 outline-none"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 mb-4 outline-none"
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg"
        >
          {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
        </button>

        {message && <p className="text-yellow-400 mt-4 text-sm">{message}</p>}

        <p className="text-zinc-400 mt-4 text-sm text-center">
          {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)} className="text-green-400 cursor-pointer">
            {isLogin ? "S'inscrire" : 'Se connecter'}
          </span>
        </p>
      </div>
    </div>
  )
}