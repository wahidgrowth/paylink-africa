'use client'
import Link from 'next/link'
import Logo from '@/components/Logo'

const freeFeatures = [
  { text: 'Liens de paiement illimités', included: true },
  { text: 'Transactions illimitées', included: true },
  { text: 'Commission 2% par vente', included: true },
  { text: 'Page de paiement simple', included: true },
  { text: 'Pixel Facebook intégré', included: true },
  { text: 'Stats de base (vues, ventes)', included: true },
  { text: 'Page de vente IA', included: false },
  { text: 'Audit IA', included: false },
  { text: 'Support WhatsApp', included: false },
]

const starterFeatures = [
  { text: 'Liens de paiement illimités', included: true },
  { text: 'Transactions illimitées', included: true },
  { text: 'Commission 1% par vente', included: true },
  { text: '1 page de vente IA', included: true },
  { text: 'Pixel Facebook intégré', included: true },
  { text: 'Stats de base', included: true },
  { text: 'Adaptation marché de base', included: true },
  { text: 'Audit IA illimité', included: false },
  { text: 'Support WhatsApp', included: false },
]

const proFeatures = [
  { text: 'Liens de paiement illimités', included: true },
  { text: 'Transactions illimitées', included: true },
  { text: 'Commission 0.8% par vente', included: true },
  { text: 'Pages de vente IA illimitées', included: true },
  { text: 'Régénération illimitée', included: true },
  { text: '3 marchés — Afrique, Europe, USA', included: true },
  { text: 'Audit IA illimité', included: true },
  { text: 'Analytics conversion', included: true },
  { text: 'Support WhatsApp prioritaire', included: true },
]

const scaleFeatures = [
  { text: 'Tout le plan Pro', included: true },
  { text: 'Commission 0.5% par vente', included: true },
  { text: 'Pages de vente multilingues', included: true },
  { text: 'Statistiques avancées', included: true },
  { text: 'Accès API', included: true },
  { text: 'Onboarding personnalisé', included: true },
  { text: 'Account manager dédié', included: true },
]

const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}>

      <style>{`
        .pricing-nav { padding: 16px 40px; }
        .pricing-cards-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
        .pricing-calc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .pricing-h1 { font-size: 36px; }
        .pricing-pad { padding: 60px 24px; }

        @media (max-width: 1024px) {
          .pricing-cards-4 { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }

        @media (max-width: 767px) {
          .pricing-nav { padding: 16px; }
          .pricing-cards-4 { grid-template-columns: 1fr; gap: 20px; margin-bottom: 28px; }
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

      <div className="pricing-pad" style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Tarification</p>
          <h1 className="pricing-h1" style={{ fontWeight: '800', color: '#fff', margin: '0 0 12px', lineHeight: '1.2' }}>
            Simple. Transparent. Sans surprise.
          </h1>
          <p style={{ fontSize: '15px', color: '#6B7280', margin: 0 }}>
            Commence gratuitement. Upgrade quand tu es prêt.
          </p>
        </div>

        {/* LOGIQUE FREE */}
        <div style={{ background: '#10B98110', borderRadius: '12px', padding: '16px 20px', border: '0.5px solid #10B98130', marginBottom: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#10B981', margin: 0, fontWeight: '500' }}>
            Sur le plan Free, tu gardes <strong>98%</strong> de chaque vente. Plus tu vends, plus tu veux passer au Pro pour réduire ta commission.
          </p>
        </div>

        {/* 4 CARTES */}
        <div className="pricing-cards-4">

          {/* FREE */}
          <div style={{ background: '#111111', borderRadius: '16px', padding: '24px', border: '0.5px solid #1F1F1F', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>FREE</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '10px 0 4px' }}>
                <span style={{ fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: 1 }}>0</span>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>FCFA/mois</span>
              </div>
              <div style={{ display: 'inline-block', background: '#1A1A1A', borderRadius: '6px', padding: '4px 10px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: '700' }}>2% commission</span>
              </div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '10px 0 0', lineHeight: '1.5' }}>Pour commencer à vendre dès aujourd'hui</p>
            </div>
            <div style={{ flex: 1, marginBottom: '20px' }}>
              {freeFeatures.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: feature.included ? '#10B981' : '#2a2a2a', flexShrink: 0, marginTop: '1px' }}>{feature.included ? '✓' : '✕'}</span>
                  <span style={{ fontSize: '12px', color: feature.included ? '#9CA3AF' : '#444', lineHeight: '1.4' }}>{feature.text}</span>
                </div>
              ))}
            </div>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>
                Commencer gratuitement →
              </button>
            </Link>
          </div>

          {/* STARTER */}
          <div style={{ background: '#111111', borderRadius: '16px', padding: '24px', border: '0.5px solid #1F1F1F', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>STARTER</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '10px 0 4px' }}>
                <span style={{ fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: 1 }}>4 900</span>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>FCFA/mois</span>
              </div>
              <div style={{ display: 'inline-block', background: '#1A1A1A', borderRadius: '6px', padding: '4px 10px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '700' }}>1% commission</span>
              </div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '10px 0 0', lineHeight: '1.5' }}>Pour les débutants qui veulent une vraie page de vente</p>
            </div>
            <div style={{ flex: 1, marginBottom: '20px' }}>
              {starterFeatures.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: feature.included ? '#10B981' : '#2a2a2a', flexShrink: 0, marginTop: '1px' }}>{feature.included ? '✓' : '✕'}</span>
                  <span style={{ fontSize: '12px', color: feature.included ? '#9CA3AF' : '#444', lineHeight: '1.4' }}>{feature.text}</span>
                </div>
              ))}
            </div>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>
                Choisir Starter →
              </button>
            </Link>
          </div>

          {/* PRO */}
          <div style={{ background: '#111111', borderRadius: '16px', padding: '24px', border: '1.5px solid #10B981', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#10B981', color: '#000', fontSize: '10px', fontWeight: '800', padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap', letterSpacing: '1px' }}>
              RECOMMANDÉ
            </div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>PRO</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '10px 0 4px' }}>
                <span style={{ fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: 1 }}>14 900</span>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>FCFA/mois</span>
              </div>
              <div style={{ display: 'inline-block', background: '#10B98120', borderRadius: '6px', padding: '4px 10px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '700' }}>0.8% commission</span>
              </div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '10px 0 0', lineHeight: '1.5' }}>Pour les vendeurs sérieux qui veulent scaler</p>
            </div>
            <div style={{ flex: 1, marginBottom: '20px' }}>
              {proFeatures.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#10B981', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.4' }}>{feature.text}</span>
                </div>
              ))}
            </div>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>
                Passer au Pro →
              </button>
            </Link>
          </div>

          {/* SCALE */}
          <div style={{ background: '#111111', borderRadius: '16px', padding: '24px', border: '0.5px solid #1F1F1F', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>SCALE</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '10px 0 4px' }}>
                <span style={{ fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: 1 }}>29 900</span>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>FCFA/mois</span>
              </div>
              <div style={{ display: 'inline-block', background: '#1A1A1A', borderRadius: '6px', padding: '4px 10px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '700' }}>0.5% commission</span>
              </div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '10px 0 0', lineHeight: '1.5' }}>Pour les gros vendeurs qui font du volume</p>
            </div>
            <div style={{ flex: 1, marginBottom: '20px' }}>
              {scaleFeatures.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#10B981', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.4' }}>{feature.text}</span>
                </div>
              ))}
            </div>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>
                Choisir Scale →
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
              { label: 'PayLink Free', value: '98 000', sub: '2% commission', color: '#F59E0B', bg: '#F59E0B15' },
              { label: 'PayLink Pro', value: '99 200', sub: '0.8% commission', color: '#10B981', bg: '#10B98115' },
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