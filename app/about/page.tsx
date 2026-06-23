import Link from 'next/link'
import Logo from '@/components/Logo'

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      <style>{`
        .about-nav { padding: 16px 40px; }
        .about-pad { padding: 80px 24px; }
        .about-h1 { font-size: 44px; line-height: 1.15; }
        .about-h2 { font-size: 28px; }
        .about-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .about-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .about-founder { display: grid; grid-template-columns: 200px 1fr; gap: 40px; align-items: start; }
        .about-founder-img { width: 200px; height: 260px; border-radius: 16px; object-fit: cover; object-position: center top; border: 0.5px solid #1F1F1F; }
        .about-footer { display: flex; justify-content: space-between; align-items: center; }

        @media (max-width: 767px) {
          .about-nav { padding: 16px; }
          .about-pad { padding: 40px 16px; }
          .about-h1 { font-size: 26px; }
          .about-h2 { font-size: 20px; }
          .about-grid-2 { grid-template-columns: 1fr; gap: 16px; }
          .about-grid-3 { grid-template-columns: 1fr 1fr; gap: 16px; }
          .about-founder { grid-template-columns: 1fr; gap: 20px; }
          .about-founder-img { width: 100%; height: 280px; }
          .about-footer { flex-direction: column; gap: 20px; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className="about-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid #1F1F1F' }}>
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

      <div className="about-pad" style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px' }}>À propos</p>
          <h1 className="about-h1" style={{ fontWeight: '800', color: '#fff', margin: '0 0 20px' }}>
            Nous croyons que chaque<br />entrepreneur africain mérite<br /><span style={{ color: '#10B981' }}>de garder ce qu'il gagne.</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.7', margin: 0, maxWidth: '600px' }}>
            PayLink Africa est né d'un constat simple : les plateformes existantes prennent trop. Entre 5% et 15% de commission, des abonnements mensuels, des interfaces complexes. L'entrepreneur africain mérite mieux.
          </p>
        </div>

        {/* LE PROBLÈME */}
        <div style={{ marginBottom: '56px', paddingBottom: '56px', borderBottom: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px' }}>Le problème</p>
          <h2 className="about-h2" style={{ fontWeight: '700', color: '#fff', margin: '0 0 20px' }}>Vendre en ligne en Afrique ne devrait pas coûter aussi cher</h2>
          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', margin: '0 0 16px' }}>
            En Afrique francophone, un entrepreneur qui vend un produit à 10 000 FCFA peut perdre jusqu'à 1 500 FCFA en frais de plateforme. Sur 100 ventes, c'est 150 000 FCFA qui disparaissent.
          </p>
          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', margin: 0 }}>
            Le Mobile Money est partout. Ce qu'il manquait, c'était un outil simple, honnête et abordable pour connecter vendeurs et acheteurs.
          </p>
        </div>

        {/* NOTRE MISSION */}
        <div style={{ marginBottom: '56px', paddingBottom: '56px', borderBottom: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px' }}>Notre mission</p>
          <h2 className="about-h2" style={{ fontWeight: '700', color: '#fff', margin: '0 0 24px' }}>Démocratiser le commerce digital en Afrique</h2>
          <div className="about-grid-2">
            {[
              { title: 'Accessible', desc: 'Zéro abonnement pour commencer. Tu paies uniquement quand tu vends. 1% seulement.' },
              { title: 'Simple', desc: 'Crée ta page de vente en 2 minutes. Partage ton lien. Tes clients paient en Mobile Money.' },
              { title: 'Intelligent', desc: "Notre IA analyse tes pages de vente et te donne des recommandations concrètes pour vendre plus." },
              { title: 'Panafricain', desc: '9 pays couverts et en expansion. MTN, Moov, Orange, Wave — tous les opérateurs majeurs.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F' }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#10B981', margin: '0 0 8px' }}>{item.title}</p>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LE FONDATEUR */}
        <div style={{ marginBottom: '56px', paddingBottom: '56px', borderBottom: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 28px' }}>Le fondateur</p>
          <div className="about-founder">
            <img
              src="https://trywfiqrykivmhmgisbg.supabase.co/storage/v1/object/public/product-images/My%20pic%20VSL.jpg"
              alt="Wahid Mohamed"
              className="about-founder-img"
            />
            <div style={{ paddingTop: '8px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Wahid Mohamed</h3>
              <p style={{ fontSize: '14px', color: '#10B981', margin: '0 0 20px', fontWeight: '500' }}>Fondateur & CEO — Cotonou, Bénin</p>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', margin: '0 0 16px' }}>
                Entrepreneur digital basé à Cotonou, j'ai créé PayLink Africa après avoir constaté les limites des outils existants pour les vendeurs africains. Trop chers, trop complexes, trop peu adaptés à nos réalités.
              </p>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', margin: 0 }}>
                PayLink Africa est conçu par un Africain, pour les Africains. L'objectif : permettre à n'importe quel entrepreneur du continent de vendre en ligne, encaisser en Mobile Money et garder presque tout ce qu'il gagne.
              </p>
            </div>
          </div>
        </div>

        {/* CHIFFRES */}
        <div style={{ marginBottom: '56px', paddingBottom: '56px', borderBottom: '0.5px solid #1F1F1F' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 28px' }}>PayLink Africa en chiffres</p>
          <div className="about-grid-3">
            {[
              { value: '1%', label: 'Commission seulement', desc: "Les concurrents prennent jusqu'à 15%" },
              { value: '9+', label: 'Pays couverts', desc: 'Bénin, CI, Sénégal, Togo, Cameroun...' },
              { value: '4', label: 'Opérateurs Mobile Money', desc: 'MTN, Moov, Orange et Wave' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', background: '#111111', borderRadius: '12px', padding: '24px 16px', border: '0.5px solid #1F1F1F' }}>
                <p style={{ fontSize: '36px', fontWeight: '800', color: '#10B981', margin: '0 0 4px' }}>{stat.value}</p>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#fff', margin: '0 0 6px' }}>{stat.label}</p>
                <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: '#10B98110', borderRadius: '20px', padding: '40px 24px', border: '0.5px solid #10B98130' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 12px' }}>
            Prêt à rejoindre PayLink Africa ?
          </h2>
          <p style={{ fontSize: '15px', color: '#6B7280', margin: '0 0 28px', lineHeight: '1.6' }}>
            Crée ton compte gratuitement. Aucune carte bancaire requise.
          </p>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '15px', fontWeight: '700', padding: '14px 32px', borderRadius: '10px', cursor: 'pointer' }}>
              Commencer gratuitement →
            </button>
          </Link>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ padding: '28px 16px', borderTop: '0.5px solid #1F1F1F', marginTop: '60px' }}>
        <div className="about-footer" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Logo size="sm" />
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/about" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>À propos</Link>
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