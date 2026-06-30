'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const ArrowIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const WalletIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const PiggyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><line x1="9" y1="9" x2="9.01" y2="9"/></svg>
const RevenueIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const BuildingIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="9" x2="9" y2="9"/><line x1="9" y1="13" x2="9" y2="13"/><line x1="9" y1="17" x2="9" y2="17"/><line x1="15" y1="9" x2="15" y2="9"/><line x1="15" y1="13" x2="15" y2="13"/><line x1="15" y1="17" x2="15" y2="17"/></svg>

export default function WithdrawalsPage() {
  const [balance, setBalance] = useState(0)
  const [totalWithdrawn] = useState(0)
  const [loading, setLoading] = useState(true)
  const [kycStatus, setKycStatus] = useState<string>('not_started')
  const [search, setSearch] = useState('')
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

  const statCards = [
    { label: 'SOLDE TOTAL', value: balance, suffix: 'FCFA', icon: <RevenueIcon />, iconBg: '#1A1A1A', sub: 'Transactions approuvées', subColor: '#6B7280' },
    { label: 'SOLDE DISPONIBLE', value: balance, suffix: 'FCFA', icon: <WalletIcon />, iconBg: '#10B98115', sub: 'Disponible', subColor: '#10B981', valueColor: '#10B981' },
    { label: 'RETRAIT EN ATTENTE', value: 0, suffix: 'FCFA', icon: <ClockIcon />, iconBg: '#F59E0B15', sub: 'Demandes en attente', subColor: '#F59E0B' },
    { label: 'SOLDE RETIRÉ', value: totalWithdrawn, suffix: 'FCFA', icon: <PiggyIcon />, iconBg: '#A78BFA15', sub: 'Demandes validées', subColor: '#A78BFA' },
  ]

  return (
    <div style={{ padding: '32px' }}>
      <style>{`
        @media (max-width: 767px) {
          .wd-wrap { padding: 16px !important; }
          .wd-header { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
          .wd-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .wd-bottom { grid-template-columns: 1fr !important; }
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
      <div className="wd-header" style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Gestion du Portefeuille</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Suis ton solde et gère tes moyens de retrait</p>
      </div>

      {/* 4 STATS CARDS */}
      <div className="wd-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {statCards.map((card, i) => (
          <div key={i} style={{ background: '#111111', borderRadius: '14px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
            <div style={{ width: '40px', height: '40px', background: card.iconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              {card.icon}
            </div>
            <p style={{ fontSize: '10px', color: '#6B7280', fontWeight: '700', letterSpacing: '1px', margin: '0 0 8px' }}>{card.label}</p>
            <p style={{ fontSize: '24px', fontWeight: '800', color: card.valueColor || '#fff', margin: '0 0 8px' }}>
              {loading ? '...' : card.value.toLocaleString('fr-FR') + '.00'} <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>{card.suffix}</span>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: card.subColor }} />
              <span style={{ fontSize: '10px', color: card.subColor, fontWeight: '600', letterSpacing: '0.5px' }}>{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM GRID */}
      <div className="wd-bottom" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>

        {/* HISTORIQUE DES RETRAITS */}
        <div style={{ background: '#111111', borderRadius: '14px', border: '0.5px solid #1F1F1F', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '0.5px solid #1F1F1F', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClockIcon /> Historique des Retraits
            </h2>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}><SearchIcon /></span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: '#1A1A1A', border: '0.5px solid #2a2a2a', borderRadius: '8px', padding: '8px 12px 8px 32px', fontSize: '13px', color: '#fff', outline: 'none', width: '180px' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #1F1F1F' }}>
                  {['ID', 'MONTANT', 'STATUT', 'DATE DE CRÉATION', 'VERS'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 24px', fontSize: '10px', color: '#6B7280', fontWeight: '700', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px 24px', color: '#444', fontSize: '13px', fontStyle: 'italic' }}>
                    Aucun retrait trouvé
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* COLONNE DROITE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* RETRAITS INSTANTANÉS */}
          <div style={{ background: '#0D0D0D', borderRadius: '14px', padding: '24px', border: '0.5px solid #1F1F1F', position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 10px' }}>Retraits Instantanés</h3>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 20px', lineHeight: '1.6' }}>
              Le délai de retrait est de 24h. Passé ce délai, contacte le support.
            </p>
            <button
              disabled={!canWithdraw}
              style={{
                width: '100%',
                background: canWithdraw ? '#10B981' : '#1A1A1A',
                border: 'none',
                color: canWithdraw ? '#000' : '#444',
                fontSize: '14px',
                fontWeight: '700',
                padding: '14px',
                borderRadius: '10px',
                cursor: canWithdraw ? 'pointer' : 'not-allowed',
              }}
            >
              Demander un retrait
            </button>
          </div>

          {/* MOYENS DE PAIEMENT */}
          <div style={{ background: '#111111', borderRadius: '14px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 6px' }}>Moyens de Paiement</h3>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>Gère tes comptes Mobile Money</p>
              </div>
              <button style={{ background: '#10B98115', border: '0.5px solid #10B98140', color: '#10B981', fontSize: '12px', fontWeight: '700', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <PlusIcon /> Ajouter
              </button>
            </div>
            <div style={{ width: '100%', padding: '24px', background: '#0D0D0D', borderRadius: '10px', border: '0.5px dashed #2a2a2a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <BuildingIcon />
              <p style={{ fontSize: '12px', color: '#444', margin: 0, textAlign: 'center' }}>Aucun moyen de paiement ajouté</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}