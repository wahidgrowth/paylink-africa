'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Logo from '@/components/Logo'

const HomeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const ProductIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
const AuditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const CartIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
const TransactionIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const WithdrawIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
const AccountIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const KycIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const SupportIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const MoreIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>

const sidebarItems = [
  { href: '/dashboard', label: 'Accueil', icon: <HomeIcon /> },
  { href: '/dashboard/products', label: 'Mes produits', icon: <ProductIcon /> },
  { href: '/dashboard/audit', label: 'Audit IA', icon: <AuditIcon /> },
  { href: '/dashboard/cart', label: 'Panier', icon: <CartIcon /> },
  { href: '/dashboard/transactions', label: 'Transactions', icon: <TransactionIcon /> },
  { href: '/dashboard/withdrawals', label: 'Retraits', icon: <WithdrawIcon /> },
  { href: '/dashboard/account', label: 'Mon compte', icon: <AccountIcon /> },
  { href: '/dashboard/kyc', label: 'Vérification KYC', icon: <KycIcon /> },
  { href: '/support', label: 'Support', icon: <SupportIcon /> },
]

const bottomNavItems = [
  { href: '/dashboard', label: 'Accueil', icon: <HomeIcon /> },
  { href: '/dashboard/products', label: 'Produits', icon: <ProductIcon /> },
  { href: '/dashboard/transactions', label: 'Transactions', icon: <TransactionIcon /> },
  { href: '/dashboard/withdrawals', label: 'Retraits', icon: <WithdrawIcon /> },
  { href: '/dashboard/account', label: 'Compte', icon: <AccountIcon /> },
]

const moreItems = [
  { href: '/dashboard/audit', label: 'Audit IA', icon: <AuditIcon /> },
  { href: '/dashboard/cart', label: 'Panier', icon: <CartIcon /> },
  { href: '/dashboard/kyc', label: 'KYC', icon: <KycIcon /> },
  { href: '/support', label: 'Support', icon: <SupportIcon /> },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const isMoreActive = moreItems.some(item => isActive(item.href))

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>

      {/* SIDEBAR — desktop uniquement */}
      <div className="dashboard-sidebar">
        <div style={{ padding: '24px 16px 16px' }}>
          <Logo size="sm" showText />
        </div>
        <nav style={{ padding: '8px 12px' }}>
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                marginBottom: '2px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                color: isActive(item.href) ? '#10B981' : '#9CA3AF',
                background: isActive(item.href) ? 'rgba(16,185,129,0.08)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="dashboard-main">
        {children}
      </div>

      {/* MENU "PLUS" — mobile uniquement */}
      {showMore && (
        <div
          onClick={() => setShowMore(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.5)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'fixed', bottom: '64px', left: '16px', right: '16px', background: '#111111', borderRadius: '16px', border: '0.5px solid #1F1F1F', padding: '8px', zIndex: 41 }}
          >
            {moreItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMore(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isActive(item.href) ? '#10B981' : '#fff',
                  background: isActive(item.href) ? 'rgba(16,185,129,0.08)' : 'transparent',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM NAV — mobile uniquement */}
      <nav
        className="dashboard-bottom-nav"
        style={{ justifyContent: 'space-around', alignItems: 'center' }}
      >
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              color: isActive(item.href) ? '#10B981' : '#6B7280',
              fontSize: '10px',
              fontWeight: '500',
              flex: 1,
              padding: '8px 0',
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {/* BOUTON PLUS */}
        <button
          onClick={() => setShowMore(!showMore)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: isMoreActive || showMore ? '#10B981' : '#6B7280',
            fontSize: '10px',
            fontWeight: '500',
            flex: 1,
            padding: '8px 0',
            cursor: 'pointer',
          }}
        >
          <MoreIcon />
          Plus
        </button>
      </nav>

    </div>
  )
}