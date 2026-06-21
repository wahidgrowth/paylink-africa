import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const { product } = await request.json()

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('audit_used').eq('id', user.id).single()

  if (profile?.audit_used) {
    return NextResponse.json({ error: 'AUDIT_USED' }, { status: 403 })
  }

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

  await supabase.from('profiles').update({ audit_used: true }).eq('id', user.id)

  return NextResponse.json({ audit })
}