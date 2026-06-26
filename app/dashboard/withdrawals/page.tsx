'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const BankIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="12" y1="10" x2="12" y2="21"/><line x1="7" y1="10" x2="7" y2="21"/><line x1="17" y1="10" x2="17" y2="21"/></svg>
const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const ArrowIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>

export default function WithdrawalsPage() {
  const [balance, setBalance] = useState(0)
  const [totalWithdrawn] = useState(0)
  const [loading, setLoading] = useState(true)
  const [kycStatus, setKycStatus] = useState<string>('not_started')
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('kyc_status')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.kyc_status) setKycStatus(profile.kyc_status)

      const { data: transactions } = await supabase
        .from('transactions')
        .select('seller_receives')
        .eq('user_id', user.id)
        .eq('status', 'success')

      const totalEarned = transactions?.reduce((sum, t) => sum + t.seller_receives, 0) || 0
      setBalance(totalEarned)
      setLoading(false)
    }
    getData()
  }, [])

  const kycApproved = kycStatus === 'approved'
  const kycPending = kycStatus === 'pending'
  const canWithdraw = kycApproved && balance > 0

  return (
    <div style={{ padding: '32px' }}>
      <style>{`
        @media (max-width: 767px) {
          .wd-wrap { padding: 16px !important; }
          .wd-header { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
          .wd-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* BANDEAU KYC */}
      {!kycApproved && (
        <div style={{
          background: kycPending ? '#F59E0B10' : '#EF444410',
          borderRadius: '12px',
          padding: '16px 20px',
          border: `0.5px solid ${kycPending ? '#F59E0B40' : '#EF444440'}`,
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: kycPending ? '#F59E0B' : '#EF4444', flexShrink: 0 }}><ShieldIcon /></div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                {kycPending ? 'Vérification en cours' : 'Identité non vérifiée'}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF', lineHeight: '1.5' }}>
                {kycPending
                  ? 'Ton dossier KYC est en cours de vérification. Tu pourras retirer dès validation.'
                  : 'Vérifie ton identité pour débloquer les retraits Mobile Money.'}
              </p>
            </div>
          </div>
          {!kycPending && (
            <Link href="/dashboard/kyc" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <button style={{ background: '#EF4444', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '700', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Vérifier mon identité <ArrowIcon />
              </button>
            </Link>
          )}
        </div>
      )}

      {/* HEADER */}
      <div className="wd-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Retraits</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Retire tes revenus vers ton Mobile Money</p>
        </div>
        <button
          disabled={!canWithdraw}
          style={{
            background: canWithdraw ? '#10B981' : '#1A1A1A',
            border: 'none',
            color: canWithdraw ? '#000' : '#444',
            fontSize: '13px',
            fontWeight: '700',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: canWithdraw ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
          }}
        >
          Demander un retrait
        </button>
      </div>

      {/* STATS */}
      <div className="wd-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px' }}>Solde disponible</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#10B981', margin: '0 0 4px' }}>
            {loading ? '...' : balance.toLocaleString('fr-FR') + ' FCFA'}
          </p>
          {!kycApproved && balance > 0 && (
            <p style={{ fontSize: '11px', color: '#F59E0B', margin: 0 }}>
              {kycPending ? 'En attente de vérification KYC' : 'Vérification KYC requise pour retirer'}
            </p>
          )}
        </div>
        <div style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px' }}>Total retiré</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: 0 }}>
            {totalWithdrawn.toLocaleString('fr-FR')} FCFA
          </p>
        </div>
      </div>

      {/* INFO PAIEMENT */}
      <div style={{ background: '#10B98110', borderRadius: '12px', padding: '16px 20px', border: '0.5px solid #10B98130', marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: '#10B981', margin: 0, lineHeight: '1.6' }}>
          Les retraits seront disponibles dès l'intégration du système de paiement. Tes revenus sont en sécurité et seront versés directement sur ton Mobile Money.
        </p>
      </div>

      {/* LISTE VIDE */}
      <div style={{ background: '#111111', borderRadius: '12px', padding: '40px', border: '0.5px solid #1F1F1F', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><BankIcon /></div>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 8px' }}>Aucun retrait effectué</h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Tes demandes de retrait apparaîtront ici.</p>
      </div>

    </div>
  )
}