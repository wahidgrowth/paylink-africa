'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', color: '#000' }}>P</div>
          <span style={{ fontSize: '16px', fontWeight: '700' }}>PayLink <span style={{ color: '#10B981' }}>Africa</span></span>
        </div>
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

      <div style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <div style={{ display: 'inline-block', background: '#10B98118', border: '0.5px solid #10B98140', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>1% de commission seulement</span>
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.1', margin: '0 0 20px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          Les autres plateformes prennent <span style={{ color: '#10B981' }}>jusqu'a 15%</span> de tes ventes.<br />Nous, seulement <span style={{ color: '#10B981' }}>1%.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#6B7280', margin: '0 0 40px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
          Cree ta page de vente. Partage le lien. Garde presque tout.
        </p>
        <Link href="/auth" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '16px', fontWeight: '700', padding: '16px 32px', borderRadius: '10px', cursor: 'pointer' }}>
            Creer mon premier lien gratuit →
          </button>
        </Link>
        <p style={{ fontSize: '12px', color: '#444', marginTop: '12px' }}>Aucune carte bancaire requise</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', padding: '40px 20px', borderTop: '0.5px solid #1F1F1F', borderBottom: '0.5px solid #1F1F1F' }}>
        {[
          { value: '1%', label: 'Commission seulement' },
          { value: '9+', label: 'Pays africains' },
          { value: '0 FCFA', label: 'Pour commencer' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#10B981', margin: '0 0 4px' }}>{stat.value}</p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '80px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', margin: '0 0 48px' }}>Tout ce dont tu as besoin pour vendre</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { title: 'Page de vente complete', desc: 'Photo, description, prix. Tes clients paient directement sans quitter la page.' },
            { title: 'Mobile Money integre', desc: 'MTN, Moov, Orange, Wave. Detection automatique de l operateur.' },
            { title: 'Pixel Facebook', desc: 'Installe ton pixel en 1 clic. Track tes conversions et optimise tes pubs.' },
            { title: 'Analytics en temps reel', desc: 'Vues, ventes, revenus. Tout en direct dans ton dashboard.' },
            { title: 'Checkout sans friction', desc: 'Un seul champ a remplir. Moins de friction = plus de ventes.' },
            { title: 'Disponible partout', desc: 'Benin, Cote d Ivoire, Senegal, Togo, Cameroun et plus encore.' },
          ].map((feature) => (
            <div key={feature.title} style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F' }}>
              <div style={{ width: '36px', height: '36px', background: '#10B98118', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#10B981', fontSize: '16px' }}>✓</span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 8px' }}>{feature.title}</h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '80px 20px', background: '#111111', borderTop: '0.5px solid #1F1F1F' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 16px' }}>Pret a vendre intelligemment ?</h2>
        <p style={{ fontSize: '16px', color: '#6B7280', margin: '0 0 32px' }}>Rejoins les vendeurs africains qui gardent presque tout ce qu ils gagnent.</p>
        <Link href="/auth" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '16px', fontWeight: '700', padding: '16px 32px', borderRadius: '10px', cursor: 'pointer' }}>
            Creer mon compte gratuitement →
          </button>
        </Link>
      </div>

      <div style={{ textAlign: 'center', padding: '24px', borderTop: '0.5px solid #1F1F1F' }}>
        <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>2026 PayLink Africa. Tous droits reserves.</p>
      </div>

    </div>
  )
}