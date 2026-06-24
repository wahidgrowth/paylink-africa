'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'

const navItems = [
  {
    href: '/dashboard',
    label: 'Accueil',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    )
  },
  {
    href: '/dashboard/products',
    label: 'Produits',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    )
  },
  {
    href: '/dashboard/transactions',
    label: 'Transactions',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2v20M2 12h20"/>
        <circle cx="12" cy="12" r="9"/>
      </svg>
    )
  },
  {
    href: '/dashboard/withdrawals',
    label: 'Retraits',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    )
  },
  {
    href: '/dashboard/account',
    label: 'Compte',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    )
  },
]

const sidebarOnlyItems = [
  {
    href: '/dashboard/audit',
    label: 'Audit IA',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    )
  },
  {
    href: '/dashboard/cart',
    label: 'Panier',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    )
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>

      {/* SIDEBAR — desktop uniquement */}
      <div className="dashboard-sidebar">
        <div style={{ padding: '24px 16px 16px' }}>
          <Logo size="sm" showText />
        </div>
        <nav style={{ padding: '8px 12px' }}>
          {[...navItems, ...sidebarOnlyItems].map((item) => (
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

      {/* BOTTOM NAV — mobile uniquement */}
      <nav
        className="dashboard-bottom-nav"
        style={{ justifyContent: 'space-around', alignItems: 'center' }}
      >
        {navItems.map((item) => (
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
      </nav>

    </div>
  )
}