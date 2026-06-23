import Link from 'next/link'
import Logo from '@/components/Logo'

const faqs = [
  { q: "Mon paiement n'a pas ete recu", r: "Verifie que tu as bien confirme le paiement sur ton telephone Mobile Money. Si le probleme persiste, contacte-nous avec ta reference de transaction." },
  { q: "Comment retirer mes revenus ?", r: "Les retraits seront disponibles des l'integration complete de CinetPay. Tes revenus sont en securite et seront verses sur ton Mobile Money." },
  { q: "Mon lien ne fonctionne pas", r: "Verifie que ton produit est bien active dans ton dashboard. Si le produit est Inactif, reactive-le depuis la page Mes produits." },
  { q: "Comment modifier mon produit ?", r: "Va dans Mes produits, clique sur l'icone crayon de ton produit, modifie les informations puis sauvegarde." },
]

export default function SupportPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      <style>{`
        .support-nav { padding: 16px 40px; }
        .support-pad { padding: 64px 24px; }
        .support-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
        .support-footer { display: flex; justify-content: space-between; align-items: center; }

        @media (max-width: 767px) {
          .support-nav { padding: 16px; }
          .support-pad { padding: 40px 16px; }
          .support-cards { grid-template-columns: 1fr; gap: 12px; }
          .support-footer { flex-direction: column; gap: 20px; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className="support-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid #1F1F1F' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
        </Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link href="/pricing" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: '14px' }}>Tarifs</Link>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '13px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>Connexion</button>
          </Link>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}>Commencer</button>
          </Link>
        </div>
      </nav>

      <div className="support-pad" style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#6B7280', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
            ← Retour
          </Link>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Support</p>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 12px' }}>Comment pouvons-nous vous aider ?</h1>
          <p style={{ fontSize: '15px', color: '#6B7280', margin: 0 }}>Notre equipe est disponible 7j/7 de 8h a 22h.</p>
        </div>

        {/* CANAUX */}
        <div className="support-cards">
          <div style={{ background: '#111111', borderRadius: '16px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: '#25D366' }}>WhatsApp</p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px' }}>Recommande — Reponse rapide</p>
            <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 20px', fontWeight: '500' }}>+229 01 96 XX XX XX</p>
            <a href="https://wa.me/22901960000" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{ width: '100%', background: '#25D366', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>Ouvrir WhatsApp</button>
            </a>
          </div>
          <div style={{ background: '#111111', borderRadius: '16px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: '#10B981' }}>Email</p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px' }}>Reponse sous 24h</p>
            <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 20px', fontWeight: '500' }}>support@paylinkafrica.com</p>
            <a href="mailto:support@paylinkafrica.com" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>Envoyer un email</button>
            </a>
          </div>
        </div>

        {/* INFOS */}
        <div style={{ background: '#111111', borderRadius: '16px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 20px' }}>Informations utiles</h2>
          {[
            { label: 'Horaires', value: 'Disponible 7j/7 de 8h a 22h (heure de Cotonou)' },
            { label: 'Delai de reponse', value: 'Quelques minutes via WhatsApp — Sous 24h par email' },
            { label: 'Informations a fournir', value: "Email d'inscription, description du probleme, captures si possible" },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', paddingBottom: i < 2 ? '16px' : '0', borderBottom: i < 2 ? '0.5px solid #1F1F1F' : 'none', marginBottom: i < 2 ? '16px' : '0' }}>
              <div style={{ width: '32px', height: '32px', background: '#10B98115', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, fontSize: '12px', fontWeight: '700' }}>
                {i === 0 ? '7j' : i === 1 ? '⚡' : 'i'}
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#fff' }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ background: '#111111', borderRadius: '16px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 20px' }}>Questions frequentes</h2>
          {faqs.map((item, i) => (
            <div key={i} style={{ padding: '14px 0', borderBottom: i < faqs.length - 1 ? '0.5px solid #1F1F1F' : 'none' }}>
              <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>{item.q}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>{item.r}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#444', margin: '28px 0 0' }}>
          Problemes urgents ? Privilegiez <span style={{ color: '#25D366' }}>WhatsApp</span> pour une reponse immediate.
        </p>

      </div>

      {/* FOOTER */}
      <footer style={{ padding: '28px 16px', borderTop: '0.5px solid #1F1F1F', marginTop: '40px' }}>
        <div className="support-footer" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Logo size="sm" />
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/about" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>A propos</Link>
            <Link href="/legal/cgu" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>CGU</Link>
            <Link href="/legal/confidentialite" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>Confidentialite</Link>
          </div>
          <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>2026 PayLink Africa</p>
        </div>
      </footer>

    </div>
  )
}