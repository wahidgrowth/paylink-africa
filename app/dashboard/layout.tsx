'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const nav = [
  { href: '/dashboard', label: 'Accueil', icon: '🏠' },
  { href: '/dashboard/products', label: 'Mes produits', icon: '🛍️' },
  { href: '/dashboard/analytics', label: 'Analytiques', icon: '📊' },
  { href: '/dashboard/audit', label: 'Audit IA', icon: '🤖' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: '💸' },
  { href: '/dashboard/withdrawals', label: 'Retraits', icon: '🏦' },
  { href: '/dashboard/account', label: 'Mon compte', icon: '⚙️' },
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
      <aside style={{ width: '220px', background: '#111111', borderRight: '0.5px solid #1F1F1F', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', top: 0, left: 0, height: '100vh' }}>

        {/* LOGO */}
        <div style={{ padding: '0 20px 32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', background: '#10B981', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', color: '#000' }}>P</div>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>PayLink <span style={{ color: '#10B981' }}>Africa</span></span>
            </div>
          </Link>
        </div>

        {/* NAV */}
        <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
          {nav.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', marginBottom: '2px', background: active ? '#10B98120' : 'transparent', color: active ? '#10B981' : '#9CA3AF', fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span style={{ fontWeight: active ? '600' : '400' }}>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* DÉCONNEXION */}
        <div style={{ padding: '12px 12px 0' }}>
          <div style={{ borderTop: '0.5px solid #1F1F1F', paddingTop: '12px' }}>
            <button
              onClick={handleLogout}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#6B7280', fontSize: '14px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <span style={{ fontSize: '16px' }}>🚪</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

      </aside>
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px' }}>{children}</main>
    </div>
  )
}