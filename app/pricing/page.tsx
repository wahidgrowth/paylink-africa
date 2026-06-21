'use client'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', margin: '0 0 12px' }}>
            Choisissez votre plan
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
            Commencez gratuitement. Upgradez quand vous etes pret.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          
          {/* Plan Free */}
          <div style={{ background: '#111111', borderRadius: '16px', padding: '32px', border: '0.5px solid #1F1F1F' }}>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px', fontWeight: '500' }}>FREE</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '36px', fontWeight: '700', color: '#fff' }}>0</span>
              <span style={{ fontSize: '14px', color: '#6B7280' }}>FCFA/mois</span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 28px' }}>Pour commencer a vendre</p>
            
            <div style={{ marginBottom: '28px' }}>
              {[
                '1% de commission par vente',
                '3 produits maximum',
                'Page de vente complete',
                'Pixel Facebook integre',
                'Stats de base',
              ].map((feature) => (
                <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ color: '#10B981', fontSize: '14px' }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#9CA3AF' }}>{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
                Commencer gratuitement
              </button>
            </Link>
          </div>

          {/* Plan Pro */}
          <div style={{ background: '#111111', borderRadius: '16px', padding: '32px', border: '2px solid #10B981', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#10B981', color: '#000', fontSize: '11px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px' }}>
              RECOMMANDE
            </div>
            <p style={{ fontSize: '13px', color: '#10B981', margin: '0 0 8px', fontWeight: '500' }}>PRO</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '36px', fontWeight: '700', color: '#fff' }}>3 500</span>
              <span style={{ fontSize: '14px', color: '#6B7280' }}>FCFA/mois</span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 28px' }}>Pour les vendeurs serieux</p>

            <div style={{ marginBottom: '28px' }}>
              {[
                '0.5% de commission par vente',
                'Produits illimites',
                'Page de vente complete',
                'Pixel Facebook integre',
                'Stats avancees',
                'Audit IA de la page',
                'Diagnostic WhatsApp hebdo',
                'Retrait prioritaire',
              ].map((feature) => (
                <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ color: '#10B981', fontSize: '14px' }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#9CA3AF' }}>{feature}</span>
                </div>
              ))}
            </div>

            <button style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
              Passer au Pro
            </button>
          </div>

        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#444', marginTop: '32px' }}>
          Pas de frais caches. Pas d engagement. Annulez a tout moment.
        </p>

      </div>
    </div>
  )
}