import Link from 'next/link'
import Logo from '@/components/Logo'

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

export default function SupportPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '0.5px solid #1F1F1F' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
        </Link>
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

        {/* HEADER */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Support</p>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', margin: '0 0 12px' }}>Comment pouvons-nous t'aider ?</h1>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>Notre équipe est disponible pour répondre à toutes tes questions.</p>
        </div>

        {/* CANAUX DE CONTACT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>

          {/* WHATSAPP */}
          <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '0.5px solid #1F1F1F' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', color: '#25D366' }}>
              <WhatsAppIcon />
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#fff' }}>WhatsApp</p>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px' }}>Réponse rapide · Recommandé</p>
            <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 24px', fontWeight: '500' }}>+229 01 96 XX XX XX</p>
            
              href="https://wa.me/22901960000?text=Bonjour%2C%20j'ai%20besoin%20d'aide%20avec%20PayLink%20Africa"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{ width: '100%', background: '#25D366', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>
                Ouvrir WhatsApp →
              </button>
            </a>
          </div>

          {/* EMAIL */}
          <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '0.5px solid #1F1F1F' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', color: '#10B981' }}>
              <EmailIcon />
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#fff' }}>Email</p>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px' }}>Réponse sous 24h</p>
            <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 24px', fontWeight: '500' }}>support@paylinkafrica.com</p>
            
              href="mailto:support@paylinkafrica.com?subject=Demande%20de%20support%20PayLink%20Africa"
              style={{ textDecoration: 'none' }}
            >
              <button style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>
                Envoyer un email →
              </button>
            </a>
          </div>

        </div>

        {/* INFOS SUPPORT */}
        <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '0.5px solid #1F1F1F', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 20px' }}>Informations utiles</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: <ClockIcon />, label: 'Horaires', value: 'Disponible 7j/7 de 8h à 22h (heure de Cotonou)' },
              { icon: <ZapIcon />, label: 'Délai de réponse', value: 'Quelques minutes via WhatsApp · Sous 24h par email' },
              { icon: <InfoIcon />, label: 'Informations à fournir', value: "Ton email d'inscription, la description du problème et des captures d'écran si possible" },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', paddingBottom: i < 2 ? '16px' : '0', borderBottom: i < 2 ? '0.5px solid #1F1F1F' : 'none' }}>
                <div style={{ width: '32px', height: '32px', background: '#10B98115', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#fff' }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ RAPIDE */}
        <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '0.5px solid #1F1F1F' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 20px' }}>Questions fréquentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { q: 'Mon paiement n\'a pas été reçu', r: 'Vérifie que tu as bien confirmé le paiement sur ton téléphone Mobile Money. Si le problème persiste, contacte-nous avec ta référence de transaction.' },
              { q: 'Comment retirer mes revenus ?', r: 'Les retraits seront disponibles dès l\'intégration complète de CinetPay. Tes revenus sont en sécurité et seront versés sur ton Mobile Money.' },
              { q: 'Mon lien ne fonctionne pas', r: 'Vérifie que ton produit est bien activé dans ton dashboard. Si le produit est "Inactif", réactive-le depuis la page Mes produits.' },
              { q: 'Comment modifier mon produit ?', r: 'Va dans Mes produits → clique sur l\'icône crayon ✏️ de ton produit → modifie les informations → Sauvegarder.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: i < 3 ? '0.5px solid #1F1F1F' : 'none' }}>
                <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>{item.q}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>{item.r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NOTE BAS */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#444', margin: '32px 0 0' }}>
          Problèmes urgents ? Privilégie <span style={{ color: '#25D366' }}>WhatsApp</span> pour une réponse immédiate.
        </p>

      </div>

      {/* FOOTER */}
      <footer style={{ padding: '32px 40px', borderTop: '0.5px solid #1F1F1F', marginTop: '40px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size="sm" />
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/about" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>À propos</Link>
            <Link href="/legal/cgu" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>CGU</Link>
            <Link href="/legal/confidentialite" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>Confidentialité</Link>
          </div>
          <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>© 2026 PayLink Africa</p>
        </div>
      </footer>

    </div>
  )
}