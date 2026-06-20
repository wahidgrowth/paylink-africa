'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
      } else {
        setUserEmail(user.email || '')
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">PayLink Africa</h1>
          <button
            onClick={handleLogout}
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
          >
            Déconnexion
          </button>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 mb-6">
          <p className="text-zinc-400 text-sm">Connecté en tant que</p>
          <p className="text-white font-medium">{userEmail}</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">🔗 Mes liens de paiement</h2>
          <p className="text-zinc-400">Aucun lien créé pour l'instant.</p>
        </div>
      </div>
    </div>
  )
}