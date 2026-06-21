'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [pixelId, setPixelId] = useState('')
  const [pixelSaved, setPixelSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email || '')
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, pixel_id')
        .eq('id', user.id)
        .maybeSingle()

      if (profile) {
        setFirstName(profile.first_name || '')
        setLastName(profile.last_name || '')
        setPixelId(profile.pixel_id || '')
      }
    }
    getUser()
  }, [])

  const savePixel = async () => {
    if (!userId) return
    setLoading(true)
    await supabase
      .from('profiles')
      .update({ pixel_id: pixelId })
      .eq('id', userId)
    setPixelSaved(true)
    setLoading(false)
    setTimeout(() => setPixelSaved(false), 3000)
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
    <div style={{ maxWidth: '600px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Mon compte</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Gérez vos informations et vos intégrations</p>
      </div>

      {/* PROFIL */}
      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Profil</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>Prénom</p>
            <p style={{ fontSize: '15px', color: '#fff', margin: 0, fontWeight: '500' }}>{firstName || '—'}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>Nom</p>
            <p style={{ fontSize: '15px', color: '#fff', margin: 0, fontWeight: '500' }}>{lastName || '—'}</p>
          </div>
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>Email</p>
          <p style={{ fontSize: '15px', color: '#fff', margin: 0, fontWeight: '500' }}>{email}</p>
        </div>
      </div>

      {/* PLAN */}
      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Plan actuel</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>Plan Free</span>
              <span style={{ background: '#1A1A1A', color: '#6B7280', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>ACTIF</span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>1% de commission · 3 produits max</p>
          </div>
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
              Passer au Pro →
            </button>
          </Link>
        </div>

        <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '14px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>Ce que tu débloques avec Pro :</p>
          {['0.5% de commission (économie directe)', 'Produits illimités', 'Audit IA de tes pages de vente', 'Diagnostic WhatsApp hebdomadaire'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < 3 ? '6px' : '0' }}>
              <span style={{ color: '#10B981', fontSize: '12px' }}>✓</span>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PIXEL FACEBOOK */}
      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Pixel Facebook</p>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px', lineHeight: '1.6' }}>
          Ton Pixel ID sera automatiquement injecté sur toutes tes pages de vente. Il trackera les événements <strong style={{ color: '#9CA3AF' }}>PageView</strong>, <strong style={{ color: '#9CA3AF' }}>InitiateCheckout</strong> et <strong style={{ color: '#9CA3AF' }}>Purchase</strong>.
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Pixel ID</label>
          <input
            type="text"
            placeholder="Ex: 775792902189733"
            value={pixelId}
            onChange={(e) => setPixelId(e.target.value)}
            style={inputStyle}
          />
          <p style={{ fontSize: '11px', color: '#444', margin: '6px 0 0' }}>
            Trouve ton Pixel ID dans Meta Business Suite → Événements → Pixels
          </p>
        </div>

        <button
          onClick={savePixel}
          disabled={loading}
          style={{ background: pixelSaved ? '#059669' : '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          {pixelSaved ? '✓ Pixel sauvegardé !' : loading ? 'Sauvegarde...' : 'Sauvegarder le Pixel'}
        </button>
      </div>

      {/* DÉCONNEXION */}
      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
        <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>Session</p>
        <button
          onClick={async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = '/'
          }}
          style={{ background: 'transparent', border: '0.5px solid #EF444440', color: '#EF4444', fontSize: '13px', fontWeight: '600', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
        >
          Se déconnecter
        </button>
      </div>

    </div>
  )
}