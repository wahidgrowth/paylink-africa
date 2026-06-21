'use client'
import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    q: "C'est vraiment gratuit pour commencer ?",
    a: "Oui. Tu crées ton compte, tu configures tes produits et tu partages tes liens sans payer quoi que ce soit. On prend uniquement 1% sur chaque vente réussie."
  },
  {
    q: "Quels opérateurs Mobile Money sont acceptés ?",
    a: "MTN MoMo, Moov Money, Orange Money et Wave. Le numéro de ton client détecte automatiquement l'opérateur — il n'a rien à choisir."
  },
  {
    q: "Dans quels pays PayLink Africa fonctionne-t-il ?",
    a: "Bénin, Côte d'Ivoire, Sénégal, Togo, Cameroun, Mali, Burkina Faso, Guinée et plus encore — 9 pays africains couverts et en expansion."
  },
  {
    q: "Comment je reçois mon argent ?",
    a: "Les paiements sont collectés via Mobile Money et reversés directement sur ton compte. Les délais dépendent de l'opérateur, généralement sous 24-48h."
  },
  {
    q: "Quelle est la différence entre Free et Pro ?",
    a: "Le plan Free te donne 3 produits, 1% de commission et le Pixel Facebook. Le plan Pro (3 500 FCFA/mois) donne des produits illimités, 0.5% de commission, l'audit IA et le diagnostic WhatsApp hebdomadaire."
  },
  {
    q: "Qu'est-ce que l'Audit IA ?",
    a: "Un système qui analyse ta page de vente et te donne des recommandations concrètes pour augmenter tes conversions — titre, description, prix, friction. Disponible sur le plan Pro."
  },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      {/* NAV */}
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

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <div style={{ display: 'inline-block', background: '#10B98118', border: '0.5px solid #10B98140', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>1% de commission seulement</span>
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.1', margin: '0 0 20px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          Les autres plateformes prennent <span style={{ color: '#10B981' }}>jusqu'à 15%</span> de tes ventes.<br />Nous, seulement <span style={{ color: '#10B981' }}>1%.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#6B7280', margin: '0 0 40px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
          Crée ta page de vente. Partage le lien. Garde presque tout.
        </p>
        <Link href="/auth" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '16px', fontWeight: '700', padding: '16px 32px', borderRadius: '10px', cursor: 'pointer' }}>
            Créer mon premier lien gratuit →
          </button>
        </Link>
        <p style={{ fontSize: '12px', color: '#444', marginTop: '12px' }}>Aucune carte bancaire requise</p>
      </div>

      {/* STATS */}
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

      {/* COMMENT CA MARCHE */}
      <div style={{ padding: '80px 40px', borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Comment ça marche</p>
          <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 16px' }}>De zéro à ta première vente en 3 étapes</h2>
          <p style={{ fontSize: '15px', color: '#6B7280', margin: 0 }}>Pas de technique. Pas de frais cachés. Juste toi et tes clients.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
          {/* Ligne de connexion entre les étapes */}
          <div style={{ position: 'absolute', top: '36px', left: 'calc(16.67% + 16px)', right: 'calc(16.67% + 16px)', height: '1px', background: 'linear-gradient(to right, #10B981, #10B98150)', zIndex: 0 }} />
          {[
            {
              step: '01',
              title: 'Crée ta page',
              desc: 'Ajoute un titre, une description, une image et ton prix. Ta page de vente est prête en moins de 2 minutes.',
              icon: '✏️'
            },
            {
              step: '02',
              title: 'Partage ton lien',
              desc: 'Copie ton lien PayLink et partage-le sur WhatsApp, Instagram, TikTok ou par SMS. Tes clients arrivent directement sur ta page.',
              icon: '🔗'
            },
            {
              step: '03',
              title: 'Encaisse en Mobile Money',
              desc: 'Ton client entre son numéro, confirme sur son téléphone. L\'argent arrive directement. Tu gardes 99%.',
              icon: '💸'
            },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0 24px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '72px', height: '72px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '24px' }}>
                {item.icon}
              </div>
              <p style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', letterSpacing: '2px', margin: '0 0 8px' }}>ÉTAPE {item.step}</p>
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 12px' }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '80px 40px', borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Fonctionnalités</p>
          <h2 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Tout ce dont tu as besoin pour vendre</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { title: 'Page de vente complète', desc: 'Photo, description, prix. Tes clients paient directement sans quitter la page.', icon: '🛍️' },
            { title: 'Mobile Money intégré', desc: 'MTN, Moov, Orange, Wave. Détection automatique de l\'opérateur par numéro.', icon: '📱' },
            { title: 'Pixel Facebook', desc: 'Installe ton pixel en 1 clic. Track tes conversions et optimise tes pubs.', icon: '🎯' },
            { title: 'Analytics en temps réel', desc: 'Vues, ventes, revenus. Tout en direct dans ton dashboard.', icon: '📊' },
            { title: 'Checkout sans friction', desc: 'Un seul champ à remplir. Moins de friction = plus de ventes.', icon: '⚡' },
            { title: 'Audit IA des conversions', desc: 'Claude analyse ta page et te dit exactement quoi améliorer pour vendre plus.', icon: '🤖' },
          ].map((feature) => (
            <div key={feature.title} style={{ background: '#111111', borderRadius: '12px', padding: '24px', border: '0.5px solid #1F1F1F', transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 8px' }}>{feature.title}</h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMPARAISON */}
      <div style={{ padding: '80px 40px', borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Comparaison</p>
          <h2 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Pourquoi choisir PayLink Africa ?</h2>
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', background: '#111', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid #1F1F1F' }}>
            {/* Header */}
            <div style={{ padding: '20px', background: '#0A0A0A', borderBottom: '0.5px solid #1F1F1F' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Critère</p>
            </div>
            <div style={{ padding: '20px', background: '#10B98115', borderBottom: '0.5px solid #1F1F1F', textAlign: 'center', borderLeft: '0.5px solid #1F1F1F', borderRight: '0.5px solid #1F1F1F' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#10B981', fontWeight: '700' }}>PayLink Africa</p>
            </div>
            <div style={{ padding: '20px', background: '#0A0A0A', borderBottom: '0.5px solid #1F1F1F', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Concurrents</p>
            </div>
            {/* Rows */}
            {[
              { label: 'Commission', ours: '1%', theirs: '5% à 15%' },
              { label: 'Abonnement', ours: '0 FCFA', theirs: 'Payant' },
              { label: 'Mobile Money', ours: '4 opérateurs', theirs: '1 à 2' },
              { label: 'Audit IA', ours: '✓ Inclus', theirs: '✗ Absent' },
              { label: 'Multi-pays', ours: '9+ pays', theirs: '1 à 3' },
            ].map((row, i) => (
              <>
                <div key={`label-${i}`} style={{ padding: '16px 20px', borderBottom: i < 4 ? '0.5px solid #1F1F1F' : 'none' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>{row.label}</p>
                </div>
                <div key={`ours-${i}`} style={{ padding: '16px 20px', borderBottom: i < 4 ? '0.5px solid #1F1F1F' : 'none', textAlign: 'center', borderLeft: '0.5px solid #1F1F1F', borderRight: '0.5px solid #1F1F1F', background: '#10B98108' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#10B981', fontWeight: '600' }}>{row.ours}</p>
                </div>
                <div key={`theirs-${i}`} style={{ padding: '16px 20px', borderBottom: i < 4 ? '0.5px solid #1F1F1F' : 'none', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>{row.theirs}</p>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '80px 40px', borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>FAQ</p>
          <h2 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Questions fréquentes</h2>
        </div>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ background: '#111111', borderRadius: '12px', border: `0.5px solid ${openFaq === i ? '#10B98140' : '#1F1F1F'}`, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>{faq.q}</p>
                <span style={{ color: '#10B981', fontSize: '18px', fontWeight: '300', marginLeft: '16px', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && (
                <div style={{ padding: '0 24px 20px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.7' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ textAlign: 'center', padding: '100px 20px', background: 'linear-gradient(135deg, #10B98115 0%, #0A0A0A 50%, #10B98115 100%)', borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ display: 'inline-block', background: '#10B98118', border: '0.5px solid #10B98140', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>Rejoins PayLink Africa aujourd'hui</span>
        </div>
        <h2 style={{ fontSize: '40px', fontWeight: '800', margin: '0 0 16px', lineHeight: '1.15' }}>
          Prêt à vendre intelligemment<br />et garder presque tout ?
        </h2>
        <p style={{ fontSize: '16px', color: '#6B7280', margin: '0 0 40px', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
          Crée ton compte gratuitement. Configure ton premier produit en 2 minutes. Partage ton lien.
        </p>
        <Link href="/auth" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '16px', fontWeight: '700', padding: '18px 40px', borderRadius: '10px', cursor: 'pointer' }}>
            Créer mon compte gratuitement →
          </button>
        </Link>
        <p style={{ fontSize: '12px', color: '#444', marginTop: '16px' }}>Aucune carte bancaire • Gratuit pour toujours sur le plan Free</p>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: '48px 40px 32px', borderTop: '0.5px solid #1F1F1F' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', maxWidth: '860px', margin: '0 auto 40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '28px', height: '28px', background: '#10B981', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', color: '#000' }}>P</div>
              <span style={{ fontSize: '15px', fontWeight: '700' }}>PayLink <span style={{ color: '#10B981' }}>Africa</span></span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: '1.6', maxWidth: '260px' }}>La plateforme de paiement Mobile Money pensée pour les entrepreneurs africains.</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>Produit</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/pricing" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>Tarifs</Link>
              <Link href="/auth" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>Connexion</Link>
              <Link href="/auth" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>S'inscrire</Link>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>Légal</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/legal/cgu" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>CGU</Link>
              <Link href="/legal/confidentialite" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>Confidentialité</Link>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '0.5px solid #1F1F1F', paddingTop: '24px', textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>© 2026 PayLink Africa. Tous droits réservés.</p>
        </div>
      </footer>

    </div>
  )
}