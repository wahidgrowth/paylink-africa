import Link from 'next/link'
import Logo from '@/components/Logo'

const faqs = [
  { q: "Mon paiement n'a pas ete recu", r: "Verifie que tu as bien confirme le paiement sur ton telephone Mobile Money. Si le probleme persiste, contacte-nous avec ta reference de transaction." },
  { q: "Comment retirer mes revenus ?", r: "Les retraits seront disponibles des l'integration complete de CinetPay. Tes revenus sont en securite." },
  { q: "Mon lien ne fonctionne pas", r: "Verifie que ton produit est bien active dans ton dashboard. Si le produit est Inactif, reactive-le depuis la page Mes produits." },
  { q: "Comment modifier mon produit ?", r: "Va dans Mes produits, clique sur l'icone crayon de ton produit, modifie les informations puis sauvegarde." },
]

export default function SupportPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '0.5px solid #1F1F1F' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/pricing" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: '14px' }}>Tarifs</Link>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Connexion</button>
          </Link>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Commencer gratuitement</button>
          </Link>
        </div>
      </nav>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Support</p>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', margin: '0 0 12px' }}>Comment pouvons-nous vous aider ?</h1>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>Notre equipe est disponible pour repondre a toutes vos questions.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#25D366' }}>WhatsApp</p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px' }}>Recommande — Reponse rapide</p>
            <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 24px' }}>+229 01 96 XX XX XX</p>
            <a href="https://wa.me/22901960000" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{ width: '100%', background: '#25D366', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>Ouvrir WhatsApp</button>
            </a>
          </div>
          <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#10B981' }}>Email</p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px' }}>Reponse sous 24h</p>
            <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 24px' }}>support@paylinkafrica.com</p>
            <a href="mailto:support@paylinkafrica.com" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>Envoyer un email</button>
            </a>
          </div>
        </div>
        <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '0.5px solid #1F1F1F' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 20px' }}>Questions frequentes</h2>
          {faqs.map((item, i) => (
            <div key={i} style={{ padding: '16px 0', borderBottom: i < faqs.length - 1 ? '0.5px solid #1F1F1F' : 'none' }}>
              <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>{item.q}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>{item.r}</p>
            </div>
          ))}
        </div>
      </div>
      <footer style={{ padding: '32px 40px', borderTop: '0.5px solid #1F1F1F', marginTop: '40px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size="sm" />
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/about" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>A propos</Link>
            <Link href="/legal/cgu" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>CGU</Link>
          </div>
          <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>2026 PayLink Africa</p>
        </div>
      </footer>
    </div>
  )
}
