'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
const nav = [
  { href: '/dashboard', label: 'Accueil' },
  { href: '/dashboard/products', label: 'Mes produits' },
  { href: '/dashboard/cart', label: 'Panier' },
  { href: '/dashboard/transactions', label: 'Transactions' },
  { href: '/dashboard/withdrawals', label: 'Retraits' },
  { href: '/dashboard/account', label: 'Mon compte' },
]
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/auth') }
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <aside style={{ width: '240px', background: '#111111', borderRight: '0.5px solid #1F1F1F', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', top: 0, left: 0, height: '100vh' }}>
        <div style={{ padding: '0 20px 32px' }}><span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>PayLink <span style={{ color: '#10B981' }}>Africa</span></span></div>
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {nav.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px', background: active ? '#10B98120' : 'transparent', color: active ? '#10B981' : '#9CA3AF', fontSize: '14px', cursor: 'pointer' }}>
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: '0 12px' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#6B7280', fontSize: '14px', cursor: 'pointer' }}>Deconnexion</button>
        </div>
      </aside>
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>{children}</main>
    </div>
  )
}
