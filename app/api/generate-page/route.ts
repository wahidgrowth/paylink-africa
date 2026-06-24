import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const getMarketPrompt = (market: string) => {
  switch (market) {
    case 'europe':
      return `Tu rédiges pour un marché EUROPÉEN. Ton style est professionnel, factuel et orienté résultats. 
      Mets en avant : ROI, gain de temps, crédibilité, processus simple. 
      Évite le jargon africain. Utilise un français standard et élégant.`
    case 'usa':
      return `Tu rédiges pour un marché AMÉRICAIN ANGLOPHONE. Ton style est ambitieux, orienté transformation et résultats chiffrés.
      Mets en avant : transformation, urgence, social proof massif, promesses fortes.
      Rédige UNIQUEMENT en anglais américain.`
    default:
      return `Tu rédiges pour un marché AFRICAIN FRANCOPHONE. Ton style est chaleureux, direct et rassurant.
      Mets en avant : témoignages locaux, réassurance sur la sécurité du paiement Mobile Money, contact WhatsApp, garantie.
      Utilise un français africain naturel et proche. Évite le jargon marketing occidental.`
  }
}

export async function POST(req: NextRequest) {
  try {
    const { rawContent, productTitle, price, market, linkId } = await req.json()

    if (!rawContent || !productTitle || !price) {
      return NextResponse.json({ error: 'Contenu insuffisant' }, { status: 400 })
    }

    const marketPrompt = getMarketPrompt(market || 'afrique')

    const prompt = `Tu es un expert copywriter spécialisé dans la création de pages de vente qui convertissent.

${marketPrompt}

Voici les informations brutes du vendeur :
- Nom du produit : ${productTitle}
- Prix : ${price} FCFA
- Contenu brut : ${rawContent}

Génère une page de vente structurée en JSON avec EXACTEMENT ce format :
{
  "headline": "Titre principal accrocheur (max 10 mots)",
  "subheadline": "Sous-titre qui complète le titre (max 20 mots)",
  "problem": "Description du problème que le produit résout (2-3 phrases)",
  "solution": "Comment le produit résout ce problème (2-3 phrases)",
  "benefits": ["Bénéfice 1", "Bénéfice 2", "Bénéfice 3", "Bénéfice 4"],
  "testimonial": {"name": "Prénom Nom local", "text": "Témoignage réaliste et convaincant (2-3 phrases)", "location": "Ville, Pays"},
  "guarantee": "Texte de garantie rassurant (1-2 phrases)",
  "cta_urgency": "Texte d'urgence sous le bouton CTA (1 phrase)",
  "whatsapp_text": "Texte encourageant à contacter via WhatsApp pour questions"
}

RÈGLES IMPORTANTES :
- Réponds UNIQUEMENT avec le JSON, aucun texte avant ou après
- Pas de backticks, pas de markdown
- Si le contenu brut est insuffisant, crée du contenu plausible basé sur le titre et le prix
- Les bénéfices doivent être concrets et spécifiques, pas génériques
- Le témoignage doit utiliser des prénoms et villes locaux selon le marché`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    let pageContent
    try {
      pageContent = JSON.parse(responseText.trim())
    } catch {
      return NextResponse.json({ error: 'Erreur de génération' }, { status: 500 })
    }

    // Sauvegarder dans Supabase si linkId fourni
    if (linkId) {
      const supabase = createClient()
      await supabase
        .from('payment_links')
        .update({
          page_type: 'sales_page',
          page_content: pageContent,
          page_market: market || 'afrique',
          page_raw_content: rawContent,
        })
        .eq('id', linkId)
    }

    return NextResponse.json({ pageContent })

  } catch (error) {
    console.error('Generate page error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}