'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [firstName, setFirstName] = useState('')
  const [userId, setUserId] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUserId(user.id)
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .maybeSingle()
      console.log('Profile data:', data, 'Error:', error)
      if (data?.first_name) setFirstName(data.first_name)
    }
    getUser()
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Tableau de bord</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Bienvenue{firstName ? ', ' + firstName : ''} !</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px' }}>Produits actifs</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#fff', margin: 0 }}>0</p>
        </div>
        <div style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px' }}>Revenus du mois</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#fff', margin: 0 }}>0 FCFA</p>
        </div>
        <div style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px' }}>Paiements recus</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#fff', margin: 0 }}>0</p>
        </div>
      </div>
      <div style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#fff', margin: 0 }}>Mes produits</h2>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>+ Creer un produit</button>
        </div>
        <div style={{ background: '#0D0D0D', borderRadius: '10px', padding: '40px', textAlign: 'center', border: '0.5px dashed #2a2a2a' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 16px' }}>Aucun produit cree pour linstant.</p>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Creer mon premier produit</button>
        </div>
      </div>
    </div>
  )
}