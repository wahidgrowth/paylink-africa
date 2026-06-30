'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Logo from '@/components/Logo'

const faqs = [
  {
    q: "C'est vraiment gratuit pour commencer ?",
    a: "Oui. Tu crées ton compte, tu configures tes produits et tu partages tes liens sans payer quoi que ce soit. On prend uniquement 2% sur chaque vente réussie sur le plan Free."
  },
  {
    q: "Quels opérateurs Mobile Money sont acceptés ?",
    a: "MTN MoMo, Moov Money, Orange Money et Wave. Le numéro de ton client détecte automatiquement l'opérateur, il n'a rien à choisir."
  },
  {
    q: "Dans quels pays PayLink Africa fonctionne-t-il ?",
    a: "Bénin, Côte d'Ivoire, Sénégal, Togo, Cameroun, Mali, Burkina Faso, Guinée et plus, 15 pays africains couverts et en expansion."
  },
  {
    q: "Comment je reçois mon argent ?",
    a: "Les paiements sont collectés via Mobile Money et reversés directement sur ton compte. Les délais dépendent de l'opérateur, généralement sous 24 à 48h."
  },
  {
    q: "Quelle est la différence entre les plans ?",
    a: "Le plan Free te donne des liens illimités avec 2% de commission. Le plan Starter ajoute une page de vente IA pour 4 900 FCFA par mois avec 1% de commission. Le plan Pro débloque les pages illimitées et l'audit IA pour 14 900 FCFA par mois avec 0.8% de commission."
  },
  {
    q: "Qu'est-ce que l'Audit IA ?",
    a: "Un système qui analyse ta page de vente et te donne des recommandations concrètes pour augmenter tes conversions, titre, description, prix, friction. Disponible sur le plan Pro."
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

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.unobserve(el) }
    }, { threshold: 0.15 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  )
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      <style>{`
        .nav-links { display: flex; gap: 12px; align-items: center; }
        .nav-menu-btn { display: none; background: transparent; border: none; color: #fff; cursor: pointer; padding: 4px; }
        .nav-mobile-menu { display: none; }
        .hero-title { font-size: 44px; font-weight: 800; line-height: 1.15; margin: 0 0 20px; letter-spacing: -0.5px; }
        .hero-subtitle { font-size: 17px; }
        .hero-btn { font-size: 16px; padding: 16px 32px; width: auto; }
        .stats-gap { gap: 60px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); position: relative; }
        .steps-line { display: block; position: absolute; top: 36px; left: calc(16.67% + 16px); right: calc(16.67% + 16px); height: 1px; background: linear-gradient(90deg, transparent 0%, #10B98160 50%, transparent 100%); z-index: 0; }
        .step-item { text-align: center; padding: 0 24px; position: relative; z-index: 1; }
        .step-icon-wrap { margin: 0 auto 24px; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .feature-card { transition: transform 0.25s ease, border-color 0.25s ease; }
        .feature-card:hover { transform: translateY(-3px); border-color: #10B98150; }
        .compare-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; }
        .compare-cell { padding: 16px 20px; }
        .compare-cell-sm { padding: 20px; }
        .cta-title { font-size: 36px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
        .section-pad { padding: 72px 40px; }
        .fade-line { height: 1px; background: linear-gradient(90deg, transparent 0%, #2a2a2a 50%, transparent 100%); width: 100%; }
        .premium-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px #10B98140; }
        .dashboard-preview-wrap { max-width: 1000px; margin: 56px auto 0; padding: 0 16px; }
        .dashboard-preview-img { width: 100%; border-radius: 14px; border: 0.5px solid #1F1F1F; box-shadow: 0 30px 80px -20px rgba(16,185,129,0.25), 0 20px 50px -10px rgba(0,0,0,0.6); display: block; }

        @media (max-width: 767px) {
          .nav-links { display: none !important; }
          .nav-menu-btn { display: flex !important; align-items: center; }
          .nav-mobile-menu { display: flex; flex-direction: column; gap: 4px; }
          .hero-title { font-size: 25px; line-height: 1.25; }
          .hero-subtitle { font-size: 14px; }
          .hero-btn { font-size: 15px; padding: 14px 20px; width: 100%; max-width: 340px; }
          .stats-gap { gap: 24px; flex-wrap: wrap; }
          .steps-grid { display: flex; flex-direction: column; gap: 28px; }
          .steps-line { display: none !important; }
          .step-item { text-align: left; padding: 0; display: flex; gap: 16px; align-items: flex-start; }
          .step-icon-wrap { margin: 0; flex-shrink: 0; width: 52px !important; height: 52px !important; }
          .features-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .compare-grid { grid-template-columns: 1fr 1fr 1fr; }
          .compare-cell { padding: 10px 8px; }
          .compare-cell-sm { padding: 12px 8px; }
          .cta-title { font-size: 22px; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .footer-logo-col { grid-column: 1 / -1; }
          .section-pad { padding: 44px 16px; }
          .dashboard-preview-wrap { margin-top: 36px; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '0.5px solid #1F1F1F', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
        </Link>

        <div className="nav-links">
          <Link href="/pricing" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: '14px' }}>Tarifs</Link>
          <Link href="/about" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: '14px' }}>À propos</Link>
          <Link href="/support" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: '14px' }}>Nous contacter</Link>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'transparent', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Connexion</button>
          </Link>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button className="premium-btn" style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Commencer gratuitement</button>
          </Link>
        </div>

        <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {menuOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#111111', borderBottom: '0.5px solid #1F1F1F', zIndex: 100, padding: '16px' }}>
            <div className="nav-mobile-menu">
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
      <div style={{ textAlign: 'center', padding: '64px 16px 0' }}>
        <Reveal>
          <div style={{ display: 'inline-block', background: '#10B98118', border: '0.5px solid #10B98140', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>À partir de 0.5% de commission</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="hero-title" style={{ maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
            Les autres plateformes prennent <span style={{ color: '#10B981' }}>jusqu'à 15%</span> de tes ventes.<br />Nous, à partir de <span style={{ color: '#10B981' }}>0.5%.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="hero-subtitle" style={{ color: '#9CA3AF', margin: '0 0 32px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.7' }}>
            Crée ta page de vente avec l'IA. Partage le lien. Garde presque tout.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button className="hero-btn premium-btn" style={{ background: '#10B981', border: 'none', color: '#000', fontWeight: '700', borderRadius: '10px', cursor: 'pointer' }}>
                Créer mon premier lien gratuit →
              </button>
            </Link>
          </div>
          <p style={{ fontSize: '12px', color: '#444', marginTop: '12px' }}>Aucune carte bancaire requise</p>
        </Reveal>

        {/* CAPTURE DASHBOARD */}
        <Reveal delay={0.4}>
          <div className="dashboard-preview-wrap">
            <img src="/dashboard-preview.png" alt="Dashboard PayLink Africa" className="dashboard-preview-img" />
          </div>
        </Reveal>
      </div>

      {/* STATS */}
      <div className="stats-gap" style={{ display: 'flex', justifyContent: 'center', padding: '56px 16px 32px' }}>
        {[
          { value: '0.5%', label: 'Commission minimum' },
          { value: '15', label: 'Pays africains' },
          { value: '0 FCFA', label: 'Pour commencer' },
        ].map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#10B981', margin: '0 0 4px' }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="fade-line" />

      {/* COMMENT CA MARCHE */}
      <div className="section-pad">
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Comment ça marche</p>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 12px' }}>De zéro à ta première vente en 3 étapes</h2>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Pas de technique. Pas de frais cachés. Juste toi et tes clients.</p>
          </div>
        </Reveal>
        <div className="steps-grid" style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="steps-line" />
          {[
            { step: '01', title: 'Crée ta page', desc: "Colle ton contenu, l'IA génère ta page de vente complète en quelques secondes.", icon: <EditIcon /> },
            { step: '02', title: 'Partage ton lien', desc: "Copie ton lien PayLink et partage-le sur WhatsApp, Instagram, TikTok ou par SMS.", icon: <LinkIcon /> },
            { step: '03', title: 'Encaisse en Mobile Money', desc: "Ton client entre son numéro, confirme sur son téléphone. Tu gardes jusqu'à 99.5%.", icon: <MoneyIcon /> },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="step-item">
                <div className="step-icon-wrap" style={{ width: '64px', height: '64px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', letterSpacing: '2px', margin: '0 0 6px' }}>ÉTAPE {item.step}</p>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="fade-line" />

      {/* FEATURES */}
      <div className="section-pad">
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Fonctionnalités</p>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Tout ce dont tu as besoin pour vendre</h2>
          </div>
        </Reveal>
        <div className="features-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {[
            { title: 'Page de vente IA', desc: "Colle ton contenu, l'IA crée une page qui convertit, sans compétence requise.", icon: <ShopIcon /> },
            { title: 'Mobile Money intégré', desc: "MTN, Moov, Orange, Wave. Détection automatique de l'opérateur par numéro.", icon: <PhoneIcon /> },
            { title: 'Pixel Facebook', desc: "Installe ton pixel en 1 clic. Track tes conversions et optimise tes pubs.", icon: <PixelIcon /> },
            { title: 'Analytics en temps réel', desc: "Vues, ventes, revenus. Tout en direct dans ton dashboard.", icon: <AnalyticsIcon /> },
            { title: 'Checkout sans friction', desc: "Un seul champ à remplir. Moins de friction, plus de ventes.", icon: <ZapIcon /> },
            { title: 'Audit IA des conversions', desc: "Notre IA analyse ta page et te dit exactement quoi améliorer pour vendre plus.", icon: <AiIcon /> },
          ].map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 0.08}>
              <div className="feature-card" style={{ background: '#111111', borderRadius: '12px', padding: '20px', border: '0.5px solid #1F1F1F', height: '100%', boxSizing: 'border-box' }}>
                <div style={{ width: '40px', height: '40px', background: '#10B98115', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: '#10B981' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 6px' }}>{feature.title}</h3>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>{feature.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="fade-line" />

      {/* COMPARAISON */}
      <div className="section-pad">
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Comparaison</p>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Pourquoi choisir PayLink Africa ?</h2>
          </div>
        </Reveal>
        <Reveal>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="compare-grid" style={{ background: '#111', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid #1F1F1F' }}>
              <div className="compare-cell-sm" style={{ background: '#0A0A0A', borderBottom: '0.5px solid #1F1F1F' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>Critère</p>
              </div>
              <div className="compare-cell-sm" style={{ background: '#10B98115', borderBottom: '0.5px solid #1F1F1F', textAlign: 'center', borderLeft: '0.5px solid #1F1F1F', borderRight: '0.5px solid #1F1F1F' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#10B981', fontWeight: '700' }}>PayLink Africa</p>
              </div>
              <div className="compare-cell-sm" style={{ background: '#0A0A0A', borderBottom: '0.5px solid #1F1F1F', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>Concurrents</p>
              </div>
              {[
                { label: 'Commission', ours: '0.5% à 2%', theirs: '5–15%' },
                { label: 'Page de vente', ours: 'Générée par IA', theirs: 'Manuelle' },
                { label: 'Mobile Money', ours: '4 opérateurs', theirs: '1 à 2' },
                { label: 'Audit IA', ours: '✓ Inclus', theirs: '✗ Absent' },
                { label: 'Multi-pays', ours: '15 pays', theirs: '1 à 3' },
              ].map((row, i) => (
                <>
                  <div key={`l${i}`} className="compare-cell" style={{ borderBottom: i < 4 ? '0.5px solid #1F1F1F' : 'none' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>{row.label}</p>
                  </div>
                  <div key={`o${i}`} className="compare-cell" style={{ borderBottom: i < 4 ? '0.5px solid #1F1F1F' : 'none', textAlign: 'center', borderLeft: '0.5px solid #1F1F1F', borderRight: '0.5px solid #1F1F1F', background: '#10B98108' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#10B981', fontWeight: '600' }}>{row.ours}</p>
                  </div>
                  <div key={`t${i}`} className="compare-cell" style={{ borderBottom: i < 4 ? '0.5px solid #1F1F1F' : 'none', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{row.theirs}</p>
                  </div>
                </>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="fade-line" />

      {/* FAQ */}
      <div className="section-pad">
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>FAQ</p>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Questions fréquentes</h2>
          </div>
        </Reveal>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div style={{ background: '#111111', borderRadius: '12px', border: `0.5px solid ${openFaq === i ? '#10B98140' : '#1F1F1F'}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s ease' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#fff', paddingRight: '8px' }}>{faq.q}</p>
                  <span style={{ color: '#10B981', fontSize: '18px', fontWeight: '300', flexShrink: 0, transition: 'transform 0.2s ease', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
                </div>
                <div style={{ maxHeight: openFaq === i ? '300px' : '0px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.7', padding: '0 20px 16px' }}>{faq.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="fade-line" />

      {/* CTA FINAL */}
      <div style={{ textAlign: 'center', padding: '64px 16px', background: 'linear-gradient(135deg, #10B98112 0%, #0A0A0A 50%, #10B98112 100%)' }}>
        <Reveal>
          <div style={{ display: 'inline-block', background: '#10B98118', border: '0.5px solid #10B98140', borderRadius: '20px', padding: '6px 16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>Rejoins PayLink Africa aujourd'hui</span>
          </div>
          <h2 className="cta-title" style={{ fontWeight: '800', margin: '0 0 16px', lineHeight: '1.25' }}>
            Prêt à vendre intelligemment<br />et garder presque tout ?
          </h2>
          <p style={{ fontSize: '15px', color: '#9CA3AF', margin: '0 0 32px', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.7' }}>
            Crée ton compte gratuitement. Génère ta première page de vente avec l'IA. Partage ton lien.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <button className="hero-btn premium-btn" style={{ background: '#10B981', border: 'none', color: '#000', fontWeight: '700', borderRadius: '10px', cursor: 'pointer' }}>
                Créer mon compte gratuitement →
              </button>
            </Link>
          </div>
          <p style={{ fontSize: '12px', color: '#444', marginTop: '16px' }}>Aucune carte bancaire requise · Gratuit pour toujours sur le plan Free</p>
        </Reveal>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: '40px 16px 24px', borderTop: '0.5px solid #1F1F1F' }}>
        <div className="footer-grid" style={{ maxWidth: '860px', margin: '0 auto 32px' }}>
          <div className="footer-logo-col">
            <div style={{ marginBottom: '12px' }}><Logo size="sm" /></div>
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