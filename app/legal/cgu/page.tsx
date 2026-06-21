import Link from 'next/link'

export default function CGU() {
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
        <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 8px' }}>Conditions Générales d'Utilisation</h1>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 48px' }}>Dernière mise à jour : juin 2026</p>

        {[
          {
            title: '1. Objet',
            content: "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme PayLink Africa, accessible à l'adresse paylinkafrica.com. En créant un compte, vous acceptez sans réserve les présentes conditions."
          },
          {
            title: '2. Description du service',
            content: "PayLink Africa est une plateforme SaaS permettant aux entrepreneurs africains de créer des liens de paiement Mobile Money, d'accepter des paiements via MTN MoMo, Moov Money, Orange Money et Wave, et d'accéder à des outils d'analyse et d'optimisation de leurs ventes."
          },
          {
            title: '3. Inscription et compte',
            content: "L'accès au service nécessite la création d'un compte avec une adresse email valide. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées depuis votre compte. PayLink Africa se réserve le droit de suspendre tout compte en cas d'utilisation frauduleuse ou contraire aux présentes CGU."
          },
          {
            title: '4. Tarification et commissions',
            content: "Le plan Free est gratuit et inclut une commission de 1% sur chaque transaction réussie. Le plan Pro est facturé 3 500 FCFA par mois et inclut une commission de 0,5% par transaction. Les frais de la passerelle de paiement (3,5% via CinetPay) sont répercutés sur l'acheteur final selon la formule de pass-through définie par PayLink Africa."
          },
          {
            title: '5. Obligations de l\'utilisateur',
            content: "Vous vous engagez à utiliser PayLink Africa uniquement pour des activités légales, à ne pas vendre de produits ou services interdits par la loi, à fournir des informations exactes lors de la création de vos pages de vente, et à ne pas tenter de contourner les systèmes de paiement ou de commission de la plateforme."
          },
          {
            title: '6. Propriété intellectuelle',
            content: "La marque PayLink Africa, le logo, le design et le code source de la plateforme sont la propriété exclusive de PayLink Africa. Tout le contenu créé par les utilisateurs (pages de vente, descriptions, images) reste leur propriété. En publiant ce contenu sur la plateforme, vous accordez à PayLink Africa une licence d'affichage non exclusive."
          },
          {
            title: '7. Limitation de responsabilité',
            content: "PayLink Africa agit en tant qu'intermédiaire technique entre vendeurs et acheteurs. La plateforme ne peut être tenue responsable des litiges commerciaux entre utilisateurs, des retards de paiement imputables aux opérateurs Mobile Money, ou de l'indisponibilité temporaire du service liée à des facteurs extérieurs."
          },
          {
            title: '8. Modification des CGU',
            content: "PayLink Africa se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification majeure par email. La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles conditions."
          },
          {
            title: '9. Droit applicable',
            content: "Les présentes CGU sont soumises au droit béninois. Tout litige relatif à leur interprétation ou leur exécution sera soumis aux tribunaux compétents de Cotonou, Bénin."
          },
          {
            title: '10. Contact',
            content: "Pour toute question relative aux présentes CGU, contactez-nous à : info.wahid013@gmail.com"
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