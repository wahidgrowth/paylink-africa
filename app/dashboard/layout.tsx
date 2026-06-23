'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

const HomeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const ProductIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
const AnalyticsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const AuditIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const TransactionIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const WithdrawIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const KycIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const AccountIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const SupportIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const LogoutIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const MenuIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>

const sidebarNav = [
  { href: '/dashboard', label: 'Accueil', icon: <HomeIcon /> },
  { href: '/dashboard/products', label: 'Mes produits', icon: <ProductIcon /> },
  { href: '/dashboard/analytics', label: 'Analytiques', icon: <AnalyticsIcon /> },
  { href: '/dashboard/audit', label: 'Audit IA', icon: <AuditIcon /> },
  { href: '/dashboard/transactions', label: 'Transactions', icon: <TransactionIcon /> },
  { href: '/dashboard/withdrawals', label: 'Retraits', icon: <WithdrawIcon /> },
  { href: '/dashboard/kyc', label: 'Verification KYC', icon: <KycIcon /> },
  { href: '/dashboard/account', label: 'Mon compte', icon: <AccountIcon /> },
  { href: '/support', label: 'Support', icon: <SupportIcon /> },
]

// Barre mobile — 5 items max
const mobileNav = [
  { href: '/dashboard', label: 'Accueil', icon: <HomeIcon /> },
  { href: '/dashboard/products', label: 'Produits', icon: <ProductIcon /> },
  { href: '/dashboard/analytics', label: 'Stats', icon: <AnalyticsIcon /> },
  { href: '/dashboard/transactions', label: 'Ventes', icon: <TransactionIcon /> },
  { href: '/dashboard/account', label: 'Compte', icon: <AccountIcon /> },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>

      <style>{`
        .dash-sidebar {
          width: 220px;
          background: #111111;
          border-right: 0.5px solid #1F1F1F;
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 50;
        }
        .dash-main {
          margin-left: 220px;
          flex: 1;
          padding: 32px;
        }
        .dash-mobile-header { display: none; }
        .dash-mobile-nav { display: none; }

        @media (max-width: 767px) {
          .dash-sidebar { display: none !important; }
          .dash-main {
            margin-left: 0;
            padding: 16px 16px 90px;
          }
          .dash-mobile-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 16px;
            background: #111111;
            border-bottom: 0.5px solid #1F1F1F;
            position: sticky;
            top: 0;
            z-index: 50;
          }
          .dash-mobile-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #111111;
            border-top: 0.5px solid #1F1F1F;
            z-index: 50;
            padding: 8px 0 12px;
          }
        }
      `}</style>

      {/* SIDEBAR DESKTOP */}
      <aside className="dash-sidebar">
        <div style={{ padding: '0 20px 32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="sm" />
          </Link>
        </div>
        <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
          {sidebarNav.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', marginBottom: '2px', background: active ? '#10B98120' : 'transparent', color: active ? '#10B981' : '#9CA3AF', fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontWeight: active ? '600' : '400' }}>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: '12px 12px 0' }}>
          <div style={{ borderTop: '0.5px solid #1F1F1F', paddingTop: '12px' }}>
            <button onClick={handleLogout} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#6B7280', fontSize: '14px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}><LogoutIcon /></span>
              <span>Deconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* HEADER MOBILE */}
      <div className="dash-mobile-header" style={{ width: '100%' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
        </Link>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '0.5px solid #2a2a2a', color: '#6B7280', fontSize: '12px', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LogoutIcon /> Déco
        </button>
      </div>

      {/* CONTENU PRINCIPAL */}
      <main className="dash-main" style={{ flex: 1 }}>
        {children}
      </main>

      {/* BARRE NAVIGATION MOBILE */}
      <div className="dash-mobile-nav">
        {mobileNav.map((item) => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '6px 4px', color: active ? '#10B981' : '#6B7280' }}>
                <span style={{ display: 'flex' }}>{item.icon}</span>
                <span style={{ fontSize: '10px', fontWeight: active ? '600' : '400' }}>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}