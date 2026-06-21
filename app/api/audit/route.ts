import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { product } = await request.json()

  const prompt = `Tu es un expert en conversion et marketing digital en Afrique francophone.

Analyse cette page de vente et donne des recommandations concretes pour augmenter les conversions :

Produit : ${product.title}
Description : ${product.description || 'Aucune description'}
Prix : ${product.price} FCFA
Slug : ${product.slug}

Donne exactement 5 recommandations concretes et actionnables sous ce format :

1. [TITRE DE LA RECOMMANDATION]
Probleme : [ce qui ne va pas]
Solution : [ce qu il faut faire exactement]

2. ...

Sois direct, precis et adapte au marche africain.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  const audit = data.content[0].text

  return NextResponse.json({ audit })
}