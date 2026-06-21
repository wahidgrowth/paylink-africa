import Link from 'next/link'

export default function Confidentialite() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '0.5px solid #1F1F1F' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', color: '#000' }}>P</div>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>PayLink <span style={{ color: '#10B981' }}>Africa</span></span>
        </Link>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px' }}>
        <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Légal</p>
        <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 8px' }}>Politique de Confidentialité</h1>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 48px' }}>Dernière mise à jour : juin 2026</p>

        {[
          {
            title: '1. Introduction',
            content: "PayLink Africa accorde une importance primordiale à la protection de vos données personnelles. La présente politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre plateforme."
          },
          {
            title: '2. Données collectées',
            content: "Nous collectons les données suivantes : informations d'identification (prénom, nom, adresse email) lors de la création de votre compte ; données de vente (titres, descriptions, prix de vos produits) ; données de transaction (montants, statuts, horodatages) ; données d'utilisation (vues de pages, taux de conversion) ; et numéros de téléphone Mobile Money des acheteurs pour le traitement des paiements."
          },
          {
            title: '3. Utilisation des données',
            content: "Vos données sont utilisées pour : fournir et améliorer nos services ; traiter vos paiements et reversements ; vous envoyer des notifications relatives à votre compte et vos transactions ; générer des analyses et recommandations via notre système d'Intelligence IA ; et respecter nos obligations légales et réglementaires."
          },
          {
            title: '4. Partage des données',
            content: "Nous ne vendons jamais vos données personnelles à des tiers. Nous partageons uniquement les données nécessaires avec : CinetPay (passerelle de paiement) pour le traitement des transactions Mobile Money ; Supabase (infrastructure cloud) pour le stockage sécurisé des données ; et Anthropic (via API Claude) pour la génération des audits IA — aucune donnée personnelle identifiable n'est transmise à Anthropic."
          },
          {
            title: '5. Sécurité des données',
            content: "Vos données sont stockées sur des serveurs sécurisés via Supabase avec chiffrement au repos et en transit. Nous appliquons des politiques de sécurité au niveau des lignes (Row Level Security) pour garantir que chaque utilisateur n'accède qu'à ses propres données. L'accès à nos systèmes est restreint et audité."
          },
          {
            title: '6. Cookies et tracking',
            content: "PayLink Africa utilise des cookies techniques nécessaires au fonctionnement du service (sessions d'authentification). Si vous activez le Pixel Facebook sur votre page de vente, ce pixel est sous votre responsabilité en tant que vendeur et soumis aux conditions de Meta Platforms."
          },
          {
            title: '7. Vos droits',
            content: "Conformément aux réglementations applicables, vous disposez des droits suivants : droit d'accès à vos données personnelles ; droit de rectification des informations inexactes ; droit à l'effacement (suppression de votre compte) ; droit à la portabilité de vos données. Pour exercer ces droits, contactez-nous à info.wahid013@gmail.com."
          },
          {
            title: '8. Conservation des données',
            content: "Vos données sont conservées pendant toute la durée de votre utilisation du service et jusqu'à 12 mois après la clôture de votre compte, sauf obligation légale de conservation plus longue (données de transaction : 5 ans)."
          },
          {
            title: '9. Modifications de la politique',
            content: "Nous pouvons mettre à jour cette politique de confidentialité à tout moment. Toute modification significative sera notifiée par email. La date de dernière mise à jour est indiquée en haut de ce document."
          },
          {
            title: '10. Contact',
            content: "Pour toute question relative à la protection de vos données personnelles, contactez notre responsable : info.wahid013@gmail.com — PayLink Africa, Cotonou, Bénin."
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', margin: '0 0 12px' }}>{section.title}</h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.8', margin: 0 }}>{section.content}</p>
          </div>
        ))}

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '0.5px solid #1F1F1F' }}>
          <Link href="/" style={{ textDecoration: 'none', fontSize: '13px', color: '#10B981' }}>← Retour à l'accueil</Link>
        </div>
      </div>

    </div>
  )
}