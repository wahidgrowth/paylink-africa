import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const getMarketPrompt = (market: string) => {
  switch (market) {
    case 'europe':
      return `MARCHÉ CIBLE : Europe francophone / internationale

PROFIL PSYCHOLOGIQUE DE L'ACHETEUR EUROPÉEN :
- Habitué au e-commerce, méfiant des promesses trop fortes
- Décide sur la base de preuves concrètes, chiffres, résultats mesurables
- Cherche la crédibilité, la légitimité, la transparence
- Sensible au gain de temps, à l'efficacité, au ROI
- Préfère un ton professionnel, direct, factuel

STYLE D'ÉCRITURE :
- Français standard, élégant, sans familiarité excessive
- Promesses mesurables et crédibles, jamais exagérées
- Arguments rationnels avant émotionnels
- Éviter absolument : le jargon africain, les superlatifs vides, les promesses irréalistes

ÉLÉMENTS DE PERSUASION PRIORITAIRES :
1. Résultats concrets et chiffrés
2. Processus clair et simple
3. Garantie solide
4. Crédibilité de l'auteur/vendeur
5. Témoignages avec résultats précis`

    case 'usa':
      return `TARGET MARKET: United States / English-speaking

PSYCHOLOGICAL PROFILE OF THE AMERICAN BUYER:
- Driven by transformation, ambition, and success
- Responds to bold promises backed by social proof
- Motivated by FOMO, urgency, and scarcity
- Values speed of results and ease of implementation
- Responds to energy, enthusiasm, and confidence

WRITING STYLE:
- American English, energetic, conversational but powerful
- Bold headlines that promise transformation
- Strong emotional hooks before logical arguments
- Use power words: proven, guaranteed, exclusive, limited, breakthrough
- Short punchy sentences that build momentum

PRIORITY PERSUASION ELEMENTS:
1. Powerful transformation promise
2. Massive social proof (numbers, names, results)
3. Urgency and scarcity
4. Risk reversal (strong guarantee)
5. Clear call to action with benefit-driven language

WRITE EVERYTHING IN AMERICAN ENGLISH ONLY.`

    default:
      return `MARCHÉ CIBLE : Afrique francophone (Bénin, Côte d'Ivoire, Sénégal, Togo, Cameroun...)

PROFIL PSYCHOLOGIQUE DE L'ACHETEUR AFRICAIN FRANCOPHONE :
- Méfiant envers les arnaques en ligne — la confiance doit être GAGNÉE, pas supposée
- Décide principalement sur la base de la confiance et des recommandations
- Très sensible aux témoignages de personnes de sa région/culture
- Cherche la réassurance sur la sécurité du paiement Mobile Money
- Préfère un ton chaleureux, proche, humain — pas corporatif
- Motivé par l'amélioration concrète de sa vie quotidienne et de ses revenus
- Attentif au rapport qualité/prix, justifie mentalement son achat

STYLE D'ÉCRITURE :
- Français africain naturel, chaleureux, direct et authentique
- Utiliser "tu" pour créer de la proximité
- Phrases courtes, claires, sans jargon occidental
- Storytelling émotionnel ancré dans la réalité africaine
- Éviter : anglicismes inutiles, jargon marketing américain, promesses irréalistes

ÉLÉMENTS DE PERSUASION PRIORITAIRES :
1. Réassurance sur la sécurité du paiement (Mobile Money, pas d'arnaque)
2. Témoignages de personnes locales avec prénom et ville africaine
3. Résultat concret et rapide visible dans la vie quotidienne
4. Proximité humaine (WhatsApp, support accessible)
5. Garantie claire et rassurante
6. Urgence douce et naturelle (pas agressive)`
}
}

export async function POST(req: NextRequest) {
  try {
    const { rawContent, productTitle, price, market, modificationRequest, existingPageContent } = await req.json()

    if (!productTitle || !price) {
      return NextResponse.json({ error: 'Informations insuffisantes' }, { status: 400 })
    }

    const marketPrompt = getMarketPrompt(market || 'afrique')

    let prompt = ''

    // MODE MODIFICATION — page déjà générée, l'utilisateur veut modifier
    if (modificationRequest && existingPageContent) {
      prompt = `Tu es un expert copywriter de niveau mondial spécialisé dans les pages de vente à haute conversion.

${marketPrompt}

CONTEXTE : Une page de vente a déjà été générée pour ce produit. L'utilisateur veut apporter des modifications précises.

PAGE ACTUELLE :
${JSON.stringify(existingPageContent, null, 2)}

INFORMATIONS PRODUIT :
- Nom : ${productTitle}
- Prix : ${price} FCFA
${rawContent ? `- Contenu original : ${rawContent}` : ''}

DEMANDE DE MODIFICATION DE L'UTILISATEUR :
"${modificationRequest}"

INSTRUCTION : Applique PRÉCISÉMENT la demande de modification. Ne change que ce qui est demandé. Garde tout le reste identique ou améliore-le légèrement.

Retourne la page complète modifiée en JSON avec EXACTEMENT ce format (sans backticks, sans markdown, JSON pur) :
{
  "headline": "...",
  "subheadline": "...",
  "problem": "...",
  "solution": "...",
  "benefits": ["...", "...", "...", "..."],
  "testimonial": {"name": "...", "text": "...", "location": "..."},
  "guarantee": "...",
  "cta_urgency": "...",
  "whatsapp_text": "..."
}`

    } else {
      // MODE GÉNÉRATION — première création
      if (!rawContent || rawContent.length < 10) {
        return NextResponse.json({ error: 'Contenu insuffisant' }, { status: 400 })
      }

      prompt = `Tu es un expert copywriter de niveau mondial. Tu as généré des pages de vente pour des milliers d'entrepreneurs africains et internationaux. Tu connais parfaitement la psychologie d'achat, les déclencheurs émotionnels et les structures de pages qui convertissent.

${marketPrompt}

INFORMATIONS DU PRODUIT :
- Nom du produit : ${productTitle}
- Prix : ${price} FCFA
- Contenu brut du vendeur : ${rawContent}

MISSION : Crée une page de vente EXCEPTIONNELLE qui convertit. Tu dois :

1. HEADLINE : Créer un titre qui arrête le scroll. Utilise une promesse claire, un chiffre si possible, ou une question qui touche une douleur réelle. Maximum 10 mots. Exemples de structures qui marchent :
   - "Comment [résultat désiré] en [délai] sans [obstacle majeur]"
   - "[Chiffre] [cible] ont déjà [résultat] grâce à [produit]"
   - "Arrête de [problème] — voici comment [solution] en [délai]"

2. SUBHEADLINE : Compléter et amplifier le headline. Préciser qui c'est pour et le résultat principal. Max 20 mots.

3. PROBLEM : Décrire la douleur avec EMPATHIE. L'acheteur doit se reconnaître et penser "c'est exactement moi". 2-3 phrases percutantes. Utiliser des détails spécifiques, pas du vague.

4. SOLUTION : Présenter le produit comme LA réponse évidente. Montrer comment il résout EXACTEMENT le problème décrit. 2-3 phrases convaincantes.

5. BENEFITS : 4 bénéfices CONCRETS et SPÉCIFIQUES (jamais vagues). Format : résultat précis + contexte. Pas "tu vas apprendre X" mais "tu vas [résultat mesurable] en [délai] même si [objection]".

6. TESTIMONIAL : Créer UN témoignage ultra-réaliste et crédible. Utiliser un prénom et une ville locale du marché cible. Le témoignage doit mentionner un résultat précis et une transformation réelle. 2-3 phrases naturelles, pas marketées.

7. GUARANTEE : Une garantie qui élimine le risque perçu. Claire, simple, rassurante. 1-2 phrases.

8. CTA_URGENCY : Créer une urgence naturelle et crédible (pas "offre limitée à 24h" si c'est faux). 1 phrase qui pousse à l'action maintenant.

9. WHATSAPP_TEXT : Message d'invitation WhatsApp chaleureux pour les questions avant achat. 1 phrase.

RÈGLES ABSOLUES :
- Réponds UNIQUEMENT avec le JSON pur, aucun texte avant ou après, aucun backtick
- Adapte TOUT le contenu au marché cible défini ci-dessus
- Si le contenu brut est pauvre, enrichis-le intelligemment en restant fidèle au produit
- Chaque mot doit servir la conversion — pas de remplissage
- Les bénéfices doivent être différents et complémentaires, pas répétitifs
- Le testimonial doit sembler VRAI et humain

FORMAT JSON EXACT (respecte PARFAITEMENT cette structure) :
{
  "headline": "...",
  "subheadline": "...",
  "problem": "...",
  "solution": "...",
  "benefits": ["...", "...", "...", "..."],
  "testimonial": {"name": "Prénom Nom", "text": "...", "location": "Ville, Pays"},
  "guarantee": "...",
  "cta_urgency": "...",
  "whatsapp_text": "..."
}`
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    let pageContent
    try {
      const cleaned = responseText.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
      pageContent = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Erreur de génération — réessaie' }, { status: 500 })
    }

    return NextResponse.json({ pageContent })

  } catch (error) {
    console.error('Generate page error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}