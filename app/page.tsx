'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Logo from '@/components/Logo'

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

const EditIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const LinkIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
const MoneyIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const ShopIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
const PhoneIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const PixelIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>
const AnalyticsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const ZapIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const AiIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const MenuIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const CloseIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const px = isMobile ? '16px' : '40px'
  const py = isMobile ? '48px' : '80px'

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `16px ${px}`, borderBottom: '0.5px solid #1F1F1F', position: 'relative' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
        </Link>

        {/* DESKTOP NAV */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/pricing" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: '14px' }}>Tarifs</Link>
            <Link href="/about" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: '14px' }}>À propos</Link>
            <Link href="/support" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: '14px' }}>Nous contacter</Link>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Connexion</button>
            </Link>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Commencer gratuitement</button>
            </Link>
          </div>
        )}

        {/* MOBILE MENU BUTTON */}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        )}

        {/* MOBILE MENU DROPDOWN */}
        {isMobile && menuOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#111111', borderBottom: '0.5px solid #1F1F1F', zIndex: 100, padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { href: '/pricing', label: 'Tarifs' },
                { href: '/about', label: 'À propos' },
                { href: '/support', label: 'Nous contacter' },
              ].map(item => (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: '15px', padding: '12px 8px', borderBottom: '0.5px solid #1F1F1F' }} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '12px' }}>
                <Link href="/auth" style={{ textDecoration: 'none', flex: 1 }}>
                  <button style={{ width: '100%', background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '14px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Connexion</button>
                </Link>
                <Link href="/auth" style={{ textDecoration: 'none', flex: 1 }}>
                  <button style={{ width: '100%', background: '#10B981', border: 'none', color: '#000', fontSize: '14px', fontWeight: '600', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Commencer</button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: isMobile ? '48px 16px 40px' : '80px 20px 60px' }}>
        <div style={{ display: 'inline-block', background: '#10B98118', border: '0.5px solid #10B98140', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>1% de commission seulement</span>
        </div>
        <h1 style={{ fontSize: isMobile ? '28px' : '48px', fontWeight: '800', lineHeight: '1.15', margin: '0 0 20px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          Les autres plateformes prennent <span style={{ color: '#10B981' }}>jusqu'à 15%</span> de tes ventes.<br />Nous, seulement <span style={{ color: '#10B981' }}>1%.</span>
        </h1>
        <p style={{ fontSize: isMobile ? '15px' : '18px', color: '#6B7280', margin: '0 0 32px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
          Crée ta page de vente. Partage le lien. Garde presque tout.
        </p>
        <Link href="/auth" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: isMobile ? '15px' : '16px', fontWeight: '700', padding: isMobile ? '14px 24px' : '16px 32px', borderRadius: '10px', cursor: 'pointer', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '340px' : 'none' }}>
            Créer mon premier lien gratuit →
          </button>
        </Link>
        <p style={{ fontSize: '12px', color: '#444', marginTop: '12px' }}>Aucune carte bancaire requise</p>
      </div>

      {/* STATS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '24px' : '60px', padding: '32px 16px', borderTop: '0.5px solid #1F1F1F', borderBottom: '0.5px solid #1F1F1F', flexWrap: 'wrap' }}>
        {[
          { value: '1%', label: 'Commission seulement' },
          { value: '9+', label: 'Pays africains' },
          { value: '0 FCFA', label: 'Pour commencer' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: '#10B981', margin: '0 0 4px' }}>{stat.value}</p>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* COMMENT CA MARCHE */}
      <div style={{ padding: `${py} ${px}`, borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '56px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Comment ça marche</p>
          <h2 style={{ fontSize: isMobile ? '22px' : '32px', fontWeight: '700', margin: '0 0 12px' }}>De zéro à ta première vente en 3 étapes</h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Pas de technique. Pas de frais cachés. Juste toi et tes clients.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '32px' : '0', maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
          {!isMobile && <div style={{ position: 'absolute', top: '36px', left: 'calc(16.67% + 16px)', right: 'calc(16.67% + 16px)', height: '1px', background: 'linear-gradient(to right, #10B981, #10B98150)', zIndex: 0 }} />}
          {[
            { step: '01', title: 'Crée ta page', desc: "Ajoute un titre, une description, une image et ton prix. Ta page de vente est prête en moins de 2 minutes.", icon: <EditIcon /> },
            { step: '02', title: 'Partage ton lien', desc: "Copie ton lien PayLink et partage-le sur WhatsApp, Instagram, TikTok ou par SMS. Tes clients arrivent directement sur ta page.", icon: <LinkIcon /> },
            { step: '03', title: 'Encaisse en Mobile Money', desc: "Ton client entre son numéro, confirme sur son téléphone. L'argent arrive directement. Tu gardes 99%.", icon: <MoneyIcon /> },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: isMobile ? 'left' : 'center', padding: isMobile ? '0' : '0 24px', position: 'relative', zIndex: 1, display: isMobile ? 'flex' : 'block', gap: isMobile ? '16px' : '0', alignItems: isMobile ? 'flex-start' : 'initial' }}>
              <div style={{ width: '56px', height: '56px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: isMobile ? '0' : '0 auto 24px', color: '#000', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', letterSpacing: '2px', margin: isMobile ? '0 0 4px' : '0 0 8px' }}>ÉTAPE {item.step}</p>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: `${py} ${px}`, borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Fonctionnalités</p>
          <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', margin: 0 }}>Tout ce dont tu as besoin pour vendre</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { title: 'Page de vente complète', desc: "Photo, description, prix. Tes clients paient directement sans quitter la page.", icon: <ShopIcon /> },
            { title: 'Mobile Money intégré', desc: "MTN, Moov, Orange, Wave. Détection automatique de l'opérateur par numéro.", icon: <PhoneIcon /> },
            { title: 'Pixel Facebook', desc: "Installe ton pixel en 1 clic. Track tes conversions et optimise tes pubs.", icon: <PixelIcon /> },
            { title: 'Analytics en temps réel', desc: "Vues, ventes, revenus. Tout en direct dans ton dashboard.", icon: <AnalyticsIcon /> },
            { title: 'Checkout sans friction', desc: "Un seul champ à remplir. Moins de friction = plus de ventes.", icon: <ZapIcon /> },
            { title: 'Audit IA des conversions', desc: "Notre IA analyse ta page et te dit exactement quoi améliorer pour vendre plus.", icon: <AiIcon /> },
          ].map((feature) => (
            <div key={feature.title} style={{ background: '#111111', borderRadius: '12px', padding: isMobile ? '16px' : '24px', border: '0.5px solid #1F1F1F' }}>
              <div style={{ width: '40px', height: '40px', background: '#10B98115', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: '#10B981' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '600', margin: '0 0 6px' }}>{feature.title}</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMPARAISON */}
      <div style={{ padding: `${py} ${px}`, borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Comparaison</p>
          <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', margin: 0 }}>Pourquoi choisir PayLink Africa ?</h2>
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#111', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid #1F1F1F' }}>
            <div style={{ padding: isMobile ? '12px' : '20px', background: '#0A0A0A', borderBottom: '0.5px solid #1F1F1F' }}>
              <p style={{ margin: 0, fontSize: isMobile ? '11px' : '13px', color: '#6B7280', fontWeight: '600' }}>Critère</p>
            </div>
            <div style={{ padding: isMobile ? '12px' : '20px', background: '#10B98115', borderBottom: '0.5px solid #1F1F1F', textAlign: 'center', borderLeft: '0.5px solid #1F1F1F', borderRight: '0.5px solid #1F1F1F' }}>
              <p style={{ margin: 0, fontSize: isMobile ? '11px' : '13px', color: '#10B981', fontWeight: '700' }}>PayLink Africa</p>
            </div>
            <div style={{ padding: isMobile ? '12px' : '20px', background: '#0A0A0A', borderBottom: '0.5px solid #1F1F1F', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: isMobile ? '11px' : '13px', color: '#6B7280', fontWeight: '600' }}>Concurrents</p>
            </div>
            {[
              { label: 'Commission', ours: '1%', theirs: '5% à 15%' },
              { label: 'Abonnement', ours: '0 FCFA', theirs: 'Payant' },
              { label: 'Mobile Money', ours: '4 opérateurs', theirs: '1 à 2' },
              { label: 'Audit IA', ours: '✓ Inclus', theirs: '✗ Absent' },
              { label: 'Multi-pays', ours: '9+ pays', theirs: '1 à 3' },
            ].map((row, i) => (
              <>
                <div key={`label-${i}`} style={{ padding: isMobile ? '10px 12px' : '16px 20px', borderBottom: i < 4 ? '0.5px solid #1F1F1F' : 'none' }}>
                  <p style={{ margin: 0, fontSize: isMobile ? '11px' : '13px', color: '#9CA3AF' }}>{row.label}</p>
                </div>
                <div key={`ours-${i}`} style={{ padding: isMobile ? '10px 12px' : '16px 20px', borderBottom: i < 4 ? '0.5px solid #1F1F1F' : 'none', textAlign: 'center', borderLeft: '0.5px solid #1F1F1F', borderRight: '0.5px solid #1F1F1F', background: '#10B98108' }}>
                  <p style={{ margin: 0, fontSize: isMobile ? '11px' : '13px', color: '#10B981', fontWeight: '600' }}>{row.ours}</p>
                </div>
                <div key={`theirs-${i}`} style={{ padding: isMobile ? '10px 12px' : '16px 20px', borderBottom: i < 4 ? '0.5px solid #1F1F1F' : 'none', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: isMobile ? '11px' : '13px', color: '#6B7280' }}>{row.theirs}</p>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: `${py} ${px}`, borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>FAQ</p>
          <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', margin: 0 }}>Questions fréquentes</h2>
        </div>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#111111', borderRadius: '12px', border: `0.5px solid ${openFaq === i ? '#10B98140' : '#1F1F1F'}`, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '16px' : '20px 24px' }}>
                <p style={{ margin: 0, fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#fff', paddingRight: '8px' }}>{faq.q}</p>
                <span style={{ color: '#10B981', fontSize: '18px', fontWeight: '300', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && (
                <div style={{ padding: isMobile ? '0 16px 16px' : '0 24px 20px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.7' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ textAlign: 'center', padding: isMobile ? '60px 16px' : '100px 20px', background: 'linear-gradient(135deg, #10B98115 0%, #0A0A0A 50%, #10B98115 100%)', borderBottom: '0.5px solid #1F1F1F' }}>
        <div style={{ display: 'inline-block', background: '#10B98118', border: '0.5px solid #10B98140', borderRadius: '20px', padding: '6px 16px', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>Rejoins PayLink Africa aujourd'hui</span>
        </div>
        <h2 style={{ fontSize: isMobile ? '24px' : '40px', fontWeight: '800', margin: '0 0 16px', lineHeight: '1.2' }}>
          Prêt à vendre intelligemment<br />et garder presque tout ?
        </h2>
        <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#6B7280', margin: '0 0 32px', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
          Crée ton compte gratuitement. Configure ton premier produit en 2 minutes. Partage ton lien.
        </p>
        <Link href="/auth" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: isMobile ? '15px' : '16px', fontWeight: '700', padding: isMobile ? '14px 24px' : '18px 40px', borderRadius: '10px', cursor: 'pointer', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '340px' : 'none' }}>
            Créer mon compte gratuitement →
          </button>
        </Link>
        <p style={{ fontSize: '12px', color: '#444', marginTop: '16px' }}>Aucune carte bancaire • Gratuit pour toujours sur le plan Free</p>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: isMobile ? '40px 16px 24px' : '48px 40px 32px', borderTop: '0.5px solid #1F1F1F' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr', gap: isMobile ? '32px' : '40px', maxWidth: '860px', margin: isMobile ? '0 0 32px' : '0 auto 40px' }}>
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <div style={{ marginBottom: '12px' }}>
              <Logo size="sm" />
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: '1.6', maxWidth: '260px' }}>La plateforme de paiement Mobile Money pensée pour les entrepreneurs africains.</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>Produit</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/pricing" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>Tarifs</Link>
              <Link href="/about" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>À propos</Link>
              <Link href="/support" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>Nous contacter</Link>
              <Link href="/auth" style={{ textDecoration: 'none', fontSize: '13px', color: '#6B7280' }}>Connexion</Link>
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