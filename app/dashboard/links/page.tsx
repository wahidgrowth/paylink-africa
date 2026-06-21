'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  title: string
  description: string
  price: number
  slug: string
  created_at: string
}

export default function LinksPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getProducts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      const { data } = await supabase
        .from('payment_links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setProducts(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    getProducts()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(products.filter(p => p.title.toLowerCase().includes(q)))
  }, [search, products])

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ? Cette action est irréversible.')) return
    setDeletingId(id)
    await supabase.from('payment_links').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeletingId(null)
  }

  return (
    <div>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Mes produits</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
            {products.length} produit{products.length !== 1 ? 's' : ''} créé{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
            + Nouveau produit
          </button>
        </Link>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '360px', background: '#111111', color: '#fff', borderRadius: '8px', padding: '10px 16px', border: '0.5px solid #2a2a2a', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
        />
      </div>

      {/* ÉTAT CHARGEMENT */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Chargement...</p>
        </div>
      )}

      {/* ÉTAT VIDE */}
      {!loading && products.length === 0 && (
        <div style={{ background: '#111111', borderRadius: '16px', padding: '60px 40px', border: '0.5px dashed #2a2a2a', textAlign: 'center' }}>
          <p style={{ fontSize: '40px', margin: '0 0 16px' }}>🛍️</p>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: '0 0 8px' }}>Aucun produit créé</h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px' }}>Crée ton premier produit et commence à vendre en Mobile Money.</p>
          <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '700', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>
              Créer mon premier produit
            </button>
          </Link>
        </div>
      )}

      {/* AUCUN RÉSULTAT RECHERCHE */}
      {!loading && products.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Aucun produit trouvé pour "{search}"</p>
        </div>
      )}

      {/* GRILLE PRODUITS */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filtered.map((product) => (
            <div key={product.id} style={{ background: '#111111', borderRadius: '14px', border: '0.5px solid #1F1F1F', overflow: 'hidden' }}>

              {/* CARD HEADER */}
              <div style={{ padding: '20px 20px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#10B98115', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🔗</div>
                  <span style={{ background: '#10B98120', color: '#10B981', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>Actif</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 6px', lineHeight: '1.4' }}>{product.title}</h3>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description}
                </p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#10B981', margin: 0 }}>
                  {product.price.toLocaleString('fr-FR')} FCFA
                </p>
              </div>

              {/* SLUG */}
              <div style={{ padding: '10px 20px', background: '#0D0D0D', borderTop: '0.5px solid #1F1F1F', borderBottom: '0.5px solid #1F1F1F' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#444', fontFamily: 'monospace' }}>
                  /p/<span style={{ color: '#6B7280' }}>{product.slug}</span>
                </p>
              </div>

              {/* ACTIONS */}
              <div style={{ padding: '14px 20px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => copyLink(product.slug)}
                  style={{ flex: 1, background: copiedSlug === product.slug ? '#10B98120' : '#1A1A1A', border: `0.5px solid ${copiedSlug === product.slug ? '#10B98140' : '#2a2a2a'}`, color: copiedSlug === product.slug ? '#10B981' : '#fff', fontSize: '12px', fontWeight: '600', padding: '8px 0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {copiedSlug === product.slug ? '✓ Copié !' : '🔗 Copier le lien'}
                </button>
                <Link href={`/p/${product.slug}`} target="_blank" style={{ textDecoration: 'none' }}>
                  <button style={{ background: '#1A1A1A', border: '0.5px solid #2a2a2a', color: '#fff', fontSize: '12px', fontWeight: '600', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}>
                    👁️
                  </button>
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  disabled={deletingId === product.id}
                  style={{ background: '#1A1A1A', border: '0.5px solid #2a2a2a', color: '#EF4444', fontSize: '12px', fontWeight: '600', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  {deletingId === product.id ? '...' : '🗑️'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}