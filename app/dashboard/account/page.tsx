'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
export default function AccountPage() {
  const [email, setEmail] = useState('')
  const supabase = createClient()
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setEmail(user.email || '')
    }
    getUser()
  }, [])
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Mon compte</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Vos informations et votre plan</p>
      </div>
      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>Email</p>
        <p style={{ fontSize: '15px', color: '#fff', margin: 0 }}>{email}</p>
      </div>
      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>Plan actuel</p>
            <p style={{ fontSize: '15px', color: '#fff', margin: 0 }}>Free - 1% de commission</p>
          </div>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Passer au Pro</button>
        </div>
      </div>
    </div>
  )
}
