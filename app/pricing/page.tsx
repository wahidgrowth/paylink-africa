'use client'
import Link from 'next/link'
import Logo from '@/components/Logo'

const freeFeatures = [
  { text: '1% de commission par vente', included: true },
  { text: '3 produits maximum', included: true },
  { text: 'Page de vente complète + éditeur riche', included: true },
  { text: 'Upload image + fichier digital', included: true },
  { text: 'Pixel Facebook intégré', included: true },
  { text: 'Stats de base (vues, ventes)', included: true },
  { text: 'Audit IA de la page', included: false },
  { text: 'Produits illimités', included: false },
  { text: 'Commission réduite à 0.5%', included: false },
  { text: 'Diagnostic WhatsApp hebdo', included: false },
]

const proFeatures = [
  { text: '0.5% de commission par vente', included: true },
  { text: 'Produits illimités', included: true },
  { text: 'Page de vente complète + éditeur riche', included: true },
  { text: 'Upload image + fichier digital', included: true },
  { text: 'Pixel Facebook intégré', included: true },
  { text: 'Stats avancées', included: true },
  { text: 'Audit IA de la page de vente', included: true },
  { text: 'Diagnostic WhatsApp hebdomadaire', included: true },
  { text: 'Retrait prioritaire', included: true },
  { text: 'Support prioritaire', included: true },
]

const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}>

      <style>{`
        .pricing-nav { padding: 16px 40px; }
        .pricing-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 40px; }
        .pricing-calc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .pricing-h1 { font-size: 36px; }
        .pricing-pad { padding: 60px 24px; }

        @media (max-width: 767px) {
          .pricing-nav { padding: 16px; }
          .pricing-cards { grid-template-columns: 1fr; gap: 20px; margin-bottom: 28px; }
          .pricing-calc-grid { gap: 8px; }
          .pricing-h1 { font-size: 24px; }
          .pricing-pad { padding: 40px 16px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="pricing-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid #1F1F1F' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '13px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>Connexion</button>
          </Link>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}>Commencer</button>
          </Link>
        </div>
      </nav>

      <div className="pricing-pad" style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Tarification</p>
          <h1 className="pricing-h1" style={{ fontWeight: '800', color: '#fff', margin: '0 0 12px', lineHeight: '1.2' }}>
            Simple. Transparent. Sans surprise.
          </h1>
          <p style={{ fontSize: '15px', color: '#6B7280', margin: 0 }}>
            Commence gratuitement. Upgrade quand tu es prêt.
          </p>
        </div>

        {/* CARTES */}
        <div className="pricing-cards">

          {/* FREE */}
          <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '0.5px solid #1F1F1F', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>FREE</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '10px 0 4px' }}>
                <span style={{ fontSize: '44px', fontWeight: '800', color: '#fff', lineHeight: 1 }}>0</span>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>FCFA/mois</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Pour commencer à vendre dès aujourd'hui</p>
            </div>
            <div style={{ flex: 1, marginBottom: '24px' }}>
              {freeFeatures.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', color: feature.included ? '#10B981' : '#2a2a2a', flexShrink: 0 }}>{feature.included ? '✓' : '✕'}</span>
                  <span style={{ fontSize: '13px', color: feature.included ? '#9CA3AF' : '#444' }}>{feature.text}</span>
                </div>
              ))}
            </div>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '14px', borderRadius: '10px', cursor: 'pointer' }}>
                Commencer gratuitement →
              </button>
            </Link>
          </div>

          {/* PRO */}
          <div style={{ background: '#111111', borderRadius: '16px', padding: '28px', border: '1.5px solid #10B981', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#10B981', color: '#000', fontSize: '11px', fontWeight: '800', padding: '5px 16px', borderRadius: '20px', whiteSpace: 'nowrap', letterSpacing: '1px' }}>
              RECOMMANDÉ
            </div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>PRO</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '10px 0 4px' }}>
                <span style={{ fontSize: '44px', fontWeight: '800', color: '#fff', lineHeight: 1 }}>3 500</span>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>FCFA/mois</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Pour les vendeurs sérieux qui veulent scaler</p>
            </div>
            <div style={{ flex: 1, marginBottom: '24px' }}>
              {proFeatures.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#10B981', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{feature.text}</span>
                </div>
              ))}
            </div>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '10px', cursor: 'pointer' }}>
                Passer au Pro →
              </button>
            </Link>
          </div>

        </div>

        {/* CALCULATEUR */}
        <div style={{ background: '#111111', borderRadius: '16px', padding: '24px', border: '0.5px solid #1F1F1F', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>Calculateur de commission</h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>Sur 100 000 FCFA de ventes, voici ce que tu gardes :</p>
          <div className="pricing-calc-grid">
            {[
              { label: 'Concurrents', value: '85 000', sub: '15% de frais', color: '#EF4444', bg: '#EF444415' },
              { label: 'PayLink Free', value: '99 000', sub: '1% commission', color: '#10B981', bg: '#10B98115' },
              { label: 'PayLink Pro', value: '99 500', sub: '0.5% commission', color: '#10B981', bg: '#10B98120' },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, borderRadius: '10px', padding: '14px 8px', textAlign: 'center', border: `0.5px solid ${item.color}30` }}>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#6B7280', fontWeight: '600' }}>{item.label}</p>
                <p style={{ margin: '0 0 2px', fontSize: '20px', fontWeight: '800', color: item.color }}>{item.value}</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#6B7280' }}>FCFA</p>
                <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#444' }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GARANTIE */}
        <div style={{ textAlign: 'center', padding: '24px 16px', background: '#10B98110', borderRadius: '16px', border: '0.5px solid #10B98130', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: '#10B981' }}>
            <ShieldIcon />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>Aucun engagement. Annule quand tu veux.</h3>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Pas de frais cachés. Pas de contrat. Tu peux revenir au plan Free à tout moment.</p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#444', margin: 0 }}>
          Des questions ? Écris-nous à <span style={{ color: '#10B981' }}>info.wahid013@gmail.com</span>
        </p>

      </div>
    </div>
  )
}