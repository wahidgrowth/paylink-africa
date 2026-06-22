import Link from 'next/link'
import Logo from '@/components/Logo'

export default function AboutPage() {
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

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '64px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px' }}>À propos</p>
          <h1 style={{ fontSize: '44px', fontWeight: '800', color: '#fff', margin: '0 0 20px', lineHeight: '1.15' }}>
            Nous croyons que chaque<br />entrepreneur africain mérite<br /><span style={{ color: '#10B981' }}>de garder ce qu'il gagne.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: '1.7', margin: 0, maxWidth: '600px' }}>
            PayLink Africa est né d'un constat simple : les plateformes existantes prennent trop. Entre 5% et 15% de commission, des abonnements mensuels, des interfaces complexes. L'entrepreneur africain mérite mieux.
          </p>
        </div>

        {/* LE PROBLÈME */}
        <div style={{ marginBottom: '64px', paddingBottom: '64px', borderBottom: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px' }}>Le problème</p>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 20px' }}>Vendre en ligne en Afrique ne devrait pas coûter aussi cher</h2>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', margin: '0 0 16px' }}>
            En Afrique francophone, un entrepreneur qui vend un produit à 10 000 FCFA peut perdre jusqu'à 1 500 FCFA en frais de plateforme. Sur 100 ventes, c'est 150 000 FCFA qui disparaissent — sans compter les abonnements mensuels.
          </p>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', margin: 0 }}>
            Le Mobile Money est partout. MTN, Moov, Orange, Wave — des millions de personnes paient déjà avec leur téléphone. Ce qu'il manquait, c'était un outil simple, honnête et abordable pour connecter vendeurs et acheteurs.
          </p>
        </div>

        {/* NOTRE MISSION */}
        <div style={{ marginBottom: '64px', paddingBottom: '64px', borderBottom: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px' }}>Notre mission</p>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 20px' }}>Démocratiser le commerce digital en Afrique</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[
              { title: 'Accessible', desc: 'Zéro abonnement pour commencer. Tu paies uniquement quand tu vends. 1% seulement.' },
              { title: 'Simple', desc: 'Crée ta page de vente en 2 minutes. Partage ton lien. Tes clients paient en Mobile Money.' },
              { title: 'Intelligent', desc: "Notre IA analyse tes pages de vente et te donne des recommandations concrètes pour vendre plus." },
              { title: 'Panafricain', desc: '9 pays couverts et en expansion. MTN, Moov, Orange, Wave — tous les opérateurs majeurs.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
                <p style={{ fontSize: '15px', fontWeight: '700', color: '#10B981', margin: '0 0 8px' }}>{item.title}</p>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LE FONDATEUR */}
        <div style={{ marginBottom: '64px', paddingBottom: '64px', borderBottom: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px' }}>Le fondateur</p>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{ width: '80px', height: '80px', background: '#10B98120', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #10B98140' }}>
              <span style={{ fontSize: '28px', fontWeight: '800', color: '#10B981' }}>W</span>
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Wahid Mohamed</h3>
              <p style={{ fontSize: '14px', color: '#10B981', margin: '0 0 16px', fontWeight: '500' }}>Fondateur & CEO — Cotonou, Bénin</p>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', margin: '0 0 12px' }}>
                Entrepreneur digital basé à Cotonou, j'ai créé PayLink Africa après avoir constaté les limites des outils existants pour les vendeurs africains. Trop chers, trop complexes, trop peu adaptés à nos réalités.
              </p>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', margin: 0 }}>
                PayLink Africa est conçu par un Africain, pour les Africains. L'objectif : permettre à n'importe quel entrepreneur du continent de vendre en ligne, encaisser en Mobile Money et garder presque tout ce qu'il gagne.
              </p>
            </div>
          </div>
        </div>

        {/* CHIFFRES */}
        <div style={{ marginBottom: '64px', paddingBottom: '64px', borderBottom: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 32px' }}>PayLink Africa en chiffres</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { value: '1%', label: 'Commission seulement', desc: 'Les concurrents prennent jusqu\'à 15%' },
              { value: '9+', label: 'Pays couverts', desc: 'Bénin, CI, Sénégal, Togo, Cameroun...' },
              { value: '4', label: 'Opérateurs Mobile Money', desc: 'MTN, Moov, Orange et Wave' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', background: '#111111', borderRadius: '12px', padding: '28px 20px', border: '0.5px solid #1F1F1F' }}>
                <p style={{ fontSize: '40px', fontWeight: '800', color: '#10B981', margin: '0 0 4px' }}>{stat.value}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: '0 0 6px' }}>{stat.label}</p>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: '#10B98110', borderRadius: '20px', padding: '48px 32px', border: '0.5px solid #10B98130' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 12px' }}>
            Prêt à rejoindre PayLink Africa ?
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: '0 0 32px', lineHeight: '1.6' }}>
            Crée ton compte gratuitement. Aucune carte bancaire requise.
          </p>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '16px', fontWeight: '700', padding: '16px 36px', borderRadius: '10px', cursor: 'pointer' }}>
              Commencer gratuitement →
            </button>
          </Link>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ padding: '32px 40px', borderTop: '0.5px solid #1F1F1F', marginTop: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size="sm" />
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/legal/cgu" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>CGU</Link>
            <Link href="/legal/confidentialite" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>Confidentialité</Link>
            <Link href="/pricing" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>Tarifs</Link>
          </div>
          <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>© 2026 PayLink Africa</p>
        </div>
      </footer>

    </div>
  )
}