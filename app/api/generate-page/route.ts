import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const getMarketContext = (market: string) => {
  switch (market) {
    case 'europe':
      return {
        profile: `MARCHÉ : Europe francophone

PSYCHOLOGIE DE L'ACHETEUR :
- Sceptique et rationnel — il a déjà été déçu par des promesses marketing
- Décide sur des preuves concrètes : chiffres, résultats mesurables, études de cas
- Cherche la crédibilité, la transparence, la légitimité
- Sensible au gain de temps, ROI, efficacité prouvée
- Méfiant des superlatifs vides et des promesses trop belles

DOULEURS UNIVERSELLES SUR CE MARCHÉ :
- Manque de temps et surinvestissement sans résultats proportionnels
- Peur de se tromper et de perdre de l'argent
- Sentiment d'être dépassé par la concurrence
- Besoin de clarté et de méthode dans un monde complexe

DÉSIRS PROFONDS :
- Gagner du temps et de l'efficacité
- Avoir des résultats mesurables et prévisibles
- Être reconnu comme compétent et professionnel
- Construire quelque chose de solide et durable

STYLE D'ÉCRITURE :
- Français standard, professionnel, sans familiarité excessive
- Arguments rationnels avant émotionnels
- Promesses mesurables et crédibles
- Ton expert mais accessible
- Jamais : superlatifs vides, promesses irréalistes, jargon africain`,
        currency: 'EUR',
        language: 'fr',
        testimonialLocation: 'Paris, France',
        urgencyStyle: 'places limitées cette semaine',
        guaranteeStyle: 'satisfait ou remboursé sous 30 jours',
      }

    case 'usa':
      return {
        profile: `MARKET: United States / English-speaking

BUYER PSYCHOLOGY:
- Ambitious and action-oriented — wants transformation NOW
- Responds to bold promises backed by massive social proof
- Motivated by FOMO, urgency, scarcity, and exclusivity
- Values speed of results and simplicity of implementation
- Responds to energy, confidence, and "dream life" positioning

UNIVERSAL PAINS ON THIS MARKET:
- Stuck in mediocrity while seeing others succeed
- Overwhelmed with information but lacking clear direction
- Fear of missing out on the "big opportunity"
- Trading time for money with no leverage

DEEP DESIRES:
- Financial freedom and time freedom simultaneously
- Being seen as successful by peers
- Finding the shortcut that actually works
- Building something that runs without them

WRITING STYLE:
- American English, energetic, punchy, conversational
- Bold transformation promises
- Power words: proven, breakthrough, exclusive, guaranteed, limited
- Short sentences that build momentum
- Always: write in ENGLISH ONLY`,
        currency: 'USD',
        language: 'en',
        testimonialLocation: 'New York, USA',
        urgencyStyle: 'limited spots this week',
        guaranteeStyle: '30-day money-back guarantee',
      }

    default:
      return {
        profile: `MARCHÉ : Afrique francophone (Bénin, Côte d'Ivoire, Sénégal, Togo, Cameroun...)

PSYCHOLOGIE DE L'ACHETEUR :
- Méfiant envers les arnaques en ligne — la confiance se GAGNE, elle ne se suppose pas
- Décide sur la base de la confiance, des recommandations et des témoignages locaux
- Très sensible aux histoires de transformation réelles de personnes de sa région
- Cherche une réassurance constante sur la sécurité du paiement Mobile Money
- Préfère un ton chaleureux, proche, humain, comme un ami qui conseille
- Motivé par l'amélioration concrète de ses revenus et de sa vie quotidienne
- Attentif au rapport qualité/prix, il justifie mentalement chaque dépense

DOULEURS UNIVERSELLES SUR CE MARCHÉ :
- Travailler dur sans voir les résultats espérés
- Manque de clients et d'argent malgré les efforts
- Peur d'être arnaqué ou de faire le mauvais choix
- Sentiment d'être seul face aux défis du business
- Voir d'autres réussir sans comprendre pourquoi

DÉSIRS PROFONDS :
- Liberté financière et indépendance
- Être respecté et reconnu dans sa communauté
- Offrir une meilleure vie à sa famille
- Trouver une méthode qui marche vraiment pour son contexte africain

STYLE D'ÉCRITURE :
- Français africain naturel, chaleureux, direct et authentique
- "Tu" pour créer de la proximité immédiate
- Phrases courtes, concrètes, sans jargon occidental
- Storytelling émotionnel ancré dans la réalité africaine
- Jamais : anglicismes inutiles, promesses irréalistes, ton corporatif froid`,
        currency: 'FCFA',
        language: 'fr',
        testimonialLocation: 'Abidjan, Côte d\'Ivoire',
        urgencyStyle: 'places limitées cette semaine',
        guaranteeStyle: 'satisfait ou remboursé sous 7 jours',
      }
  }
}

const ANTI_AI_RULES = `
RÈGLES D'ÉCRITURE ANTI-IA, TRÈS IMPORTANT :
- N'utilise JAMAIS le tiret cadratin "—" ou le tiret demi-cadratin "–" nulle part dans le texte, sous aucun prétexte. Si tu veux marquer une pause ou une transition, utilise un point, une virgule, ou simplement deux phrases séparées.
- Avant de finaliser chaque champ texte, relis-le mentalement et vérifie qu'aucun tiret long n'y figure. Si tu en trouves un, reformule la phrase entièrement.
- N'utilise JAMAIS de listes avec des deux-points suivis d'énumérations robotiques.
- Évite les formulations trop parfaites et symétriques qui sonnent artificielles.
- Écris comme un humain qui tape vite, avec des phrases parfois un peu inégales en longueur.
- Évite les mots comme "révolutionnaire", "incroyable", "exceptionnel" utilisés à outrance.
- Les témoignages doivent avoir de légères imperfections naturelles (une hésitation, une tournure familière) pour paraître authentiques et humains, jamais parfaitement formatés.`

const CTA_RULES = `
RÈGLES POUR LE CTA_TEXT, TRÈS IMPORTANT :
- Le CTA_TEXT doit faire MAXIMUM 4 mots. Jamais plus.
- Il doit être orienté action et résultat immédiat, pas une description longue.
- Mauvais exemples (trop longs) : "Je veux mes premiers clients en ligne", "Je veux transformer mon business maintenant"
- Bons exemples (courts et percutants) : "Je me lance", "Commencer maintenant", "Je veux ça", "Obtenir mes clients", "Démarrer aujourd'hui", "Réserver ma place"
- Le CTA doit créer une envie d'agir immédiatement sans être une phrase complète.`

export async function POST(req: NextRequest) {
  try {
    const { rawContent, productTitle, price, market, modificationRequest, existingPageContent } = await req.json()

    if (!productTitle || !price) {
      return NextResponse.json({ error: 'Informations insuffisantes' }, { status: 400 })
    }

    const marketContext = getMarketContext(market || 'afrique')

    let prompt = ''

    if (modificationRequest && existingPageContent) {
      prompt = `Tu es un expert copywriter de niveau mondial spécialisé dans les pages de vente à haute conversion.

${marketContext.profile}

${ANTI_AI_RULES}

${CTA_RULES}

CONTEXTE : Une page de vente existe déjà. L'utilisateur veut une modification précise.

PAGE ACTUELLE :
${JSON.stringify(existingPageContent, null, 2)}

PRODUIT :
- Nom : ${productTitle}
- Prix : ${price} ${marketContext.currency}
${rawContent ? `- Contenu original : ${rawContent}` : ''}

DEMANDE : "${modificationRequest}"

INSTRUCTION : Applique PRÉCISÉMENT la modification demandée. Ne change que ce qui est demandé. Améliore légèrement le reste si possible. Garde la même structure JSON.

Réponds UNIQUEMENT avec le JSON pur, sans backticks, sans texte avant ou après :
{
  "hero_headline": "...",
  "hero_subheadline": "...",
  "hero_stats": [{"number": "...", "label": "..."}],
  "problem_title": "...",
  "problem_intro": "...",
  "problem_points": ["...", "...", "...", "..."],
  "problem_quote": "...",
  "solution_title": "...",
  "solution_text": "...",
  "benefits_title": "...",
  "benefits": [{"icon": "...", "title": "...", "text": "..."}],
  "steps_title": "...",
  "steps": [{"number": "01", "title": "...", "text": "..."}],
  "testimonials": [{"name": "...", "location": "...", "text": "...", "result": "..."}],
  "faq_title": "...",
  "faq": [{"question": "...", "answer": "..."}],
  "guarantee_title": "...",
  "guarantee_text": "...",
  "urgency_text": "...",
  "cta_text": "...",
  "value_items": [{"label": "...", "value": "..."}],
  "price_card_title": "...",
  "final_headline": "..."
}`
    } else {

    if (!rawContent || rawContent.length < 10) {
      return NextResponse.json({ error: 'Contenu insuffisant' }, { status: 400 })
    }

    prompt = `Tu es le meilleur copywriter du monde francophone. Tu as généré des pages de vente qui ont généré des millions en revenus pour des entrepreneurs africains, européens et américains.

Tu ne te contentes pas de "mettre en forme" du contenu. Tu PENSES comme un stratège marketing :
1. Tu analyses le produit et identifies son marché cible précis
2. Tu creuses les douleurs PROFONDES de ce marché, pas les douleurs de surface
3. Tu identifies les désirs CACHÉS, ce que le client veut vraiment derrière l'achat
4. Tu construis une page qui crée une tension émotionnelle et présente le produit comme LA seule sortie

${marketContext.profile}

${ANTI_AI_RULES}

${CTA_RULES}

PRODUIT À ANALYSER :
- Nom : ${productTitle}
- Prix : ${price} ${marketContext.currency}
- Informations brutes du vendeur : ${rawContent}

ÉTAPE 1, ANALYSE STRATÉGIQUE (fais-le mentalement avant d'écrire) :
- Qui achète ce type de produit ? Quel est son profil exact ?
- Quelle est sa douleur numéro 1 ? Qu'est-ce qui l'empêche de dormir ?
- Qu'est-ce qu'il désire profondément ? La vraie raison derrière l'achat ?
- Quelles sont ses 3 objections principales avant d'acheter ?
- Quelle preuve sociale le convaincrait le plus ?
- Quelle transformation promet ce produit ?

ÉTAPE 2, GÉNÈRE LA PAGE (en utilisant ton analyse) :

RÈGLES DE COPYWRITING ABSOLUES :
Le headline doit ARRÊTER le scroll avec une promesse forte, spécifique, inattendue.
Le problème doit faire dire "c'est exactement moi" à l'acheteur.
Les bénéfices sont des transformations concrètes, jamais des features.
Les témoignages doivent sembler vrais, pas parfaits, humains.
La garantie doit éliminer le risque perçu totalement.
L'urgence doit être crédible et naturelle, jamais artificielle.
Chaque mot doit servir la conversion, zéro remplissage.

STRUCTURE À GÉNÉRER :

1. HERO_HEADLINE : Titre principal. Maximum 12 mots. Crée une tension immédiate entre la douleur actuelle et le résultat désiré.

2. HERO_SUBHEADLINE : Amplifie le headline. Précise pour qui c'est et le résultat principal. 1 à 2 phrases max, COURTES.

3. HERO_STATS : 3 à 4 chiffres impactants liés au produit. Invente des chiffres crédibles et réalistes basés sur le produit.

4. PROBLEM_TITLE : Titre de section sur le vrai problème. Court, 4 à 6 mots maximum.

5. PROBLEM_INTRO : 1 phrase COURTE (maximum 15 mots) qui pose le problème en une accroche brève. Ce n'est PAS un second titre, c'est un texte de transition court.

6. PROBLEM_POINTS : 4 douleurs spécifiques que ressent l'acheteur cible. Format "Tu (situation douloureuse)". Très précis, très humain, chaque point 1 à 2 phrases maximum.

7. PROBLEM_QUOTE : Une citation courte et percutante sur le problème, comme une prise de conscience. Maximum 15 mots. Entre guillemets.

8. SOLUTION_TITLE : Titre qui présente le produit comme la solution. Court, 4 à 6 mots.

9. SOLUTION_TEXT : 2 phrases courtes qui présentent le produit comme la réponse évidente et logique au problème décrit.

10. BENEFITS_TITLE : Titre de la section bénéfices. Court, 3 à 5 mots.

11. BENEFITS : 4 à 6 bénéfices. Chaque bénéfice a un icon (emoji pertinent), un title (3 à 5 mots), et un text (description concrète du résultat en 1 phrase courte).

12. STEPS_TITLE : Titre de la section comment ça marche. Court.

13. STEPS : 3 étapes simples du processus. Chaque étape a un number ("01", "02", "03"), un title court, et un text (1 phrase courte).

14. TESTIMONIALS : 5 témoignages ultra réalistes et VARIÉS entre eux (résultats différents, tons légèrement différents, profils différents). Chaque témoignage a un name (prénom et nom locaux selon le marché), une location (ville locale différente pour chaque témoignage), un text (témoignage naturel et humain de 2 phrases courtes, avec une légère imperfection pour paraître vrai), et un result (résultat concret obtenu, court).

15. FAQ_TITLE : Titre de la section FAQ. Court.

16. FAQ : 4 à 5 questions et réponses. Les questions doivent être les vraies objections de l'acheteur, courtes. Les réponses doivent lever ces objections avec élégance, en 2 phrases maximum.

17. GUARANTEE_TITLE : Titre de la garantie. Court, 2 à 4 mots.

18. GUARANTEE_TEXT : Texte de garantie qui élimine totalement le risque. Mentionner "${marketContext.guaranteeStyle}". 2 phrases courtes maximum.

19. URGENCY_TEXT : Une phrase d'urgence courte et crédible, maximum 12 mots.

20. CTA_TEXT : Suis STRICTEMENT les CTA_RULES ci-dessus. Maximum 4 mots.

21. VALUE_ITEMS : 4 à 5 éléments du tableau de valeur. Chaque élément a un label (ce que l'acheteur reçoit, court) et une value (valeur perçue en ${marketContext.currency}).

22. PRICE_CARD_TITLE : Le titre affiché en haut du tableau de prix. Ce n'est PAS le nom brut du produit, c'est une PROMESSE orientée résultat. Transforme le nom du produit en bénéfice final. Exemple : si le produit s'appelle "Formation Marketing Digital", le price_card_title pourrait être "Tes premiers clients en 30 jours". Maximum 6 mots, percutant.

23. FINAL_HEADLINE : Dernière phrase avant le CTA final. Émotionnelle et inspirante, mais COURTE, maximum 12 mots, pas un paragraphe.

RÉPONDS UNIQUEMENT AVEC LE JSON PUR, pas de backticks, pas de texte avant ou après, pas de markdown :
{
  "hero_headline": "...",
  "hero_subheadline": "...",
  "hero_stats": [{"number": "...", "label": "..."}, {"number": "...", "label": "..."}, {"number": "...", "label": "..."}],
  "problem_title": "...",
  "problem_intro": "...",
  "problem_points": ["...", "...", "...", "..."],
  "problem_quote": "...",
  "solution_title": "...",
  "solution_text": "...",
  "benefits_title": "...",
  "benefits": [{"icon": "...", "title": "...", "text": "..."}, {"icon": "...", "title": "...", "text": "..."}, {"icon": "...", "title": "...", "text": "..."}, {"icon": "...", "title": "...", "text": "..."}],
  "steps_title": "...",
  "steps": [{"number": "01", "title": "...", "text": "..."}, {"number": "02", "title": "...", "text": "..."}, {"number": "03", "title": "...", "text": "..."}],
  "testimonials": [{"name": "...", "location": "...", "text": "...", "result": "..."}, {"name": "...", "location": "...", "text": "...", "result": "..."}, {"name": "...", "location": "...", "text": "...", "result": "..."}, {"name": "...", "location": "...", "text": "...", "result": "..."}, {"name": "...", "location": "...", "text": "...", "result": "..."}],
  "faq_title": "...",
  "faq": [{"question": "...", "answer": "..."}, {"question": "...", "answer": "..."}, {"question": "...", "answer": "..."}, {"question": "...", "answer": "..."}],
  "guarantee_title": "...",
  "guarantee_text": "...",
  "urgency_text": "...",
  "cta_text": "...",
  "value_items": [{"label": "...", "value": "..."}, {"label": "...", "value": "..."}, {"label": "...", "value": "..."}, {"label": "...", "value": "..."}],
  "price_card_title": "...",
  "final_headline": "..."
}`
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
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