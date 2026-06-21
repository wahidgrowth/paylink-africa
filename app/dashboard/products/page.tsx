'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Product = {
  id: string
  title: string
  description: string
  price: number
  slug: string
  image_url?: string
  is_active: boolean
  created_at: string
}

const LinkIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
const EditIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const EyeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const ProductEmptyIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
const ProductPlaceholderIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
const CheckIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>

export default function ProductsPage() {
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

      {/* CHARGEMENT */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Chargement...</p>
        </div>
      )}

      {/* VIDE */}
      {!loading && products.length === 0 && (
        <div style={{ background: '#111111', borderRadius: '16px', padding: '60px 40px', border: '0.5px dashed #2a2a2a', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><ProductEmptyIcon /></div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: '0 0 8px' }}>Aucun produit créé</h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px' }}>Crée ton premier produit et commence à vendre en Mobile Money.</p>
          <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#10B981', border: 'none', color: '#000', fontSize: '13px', fontWeight: '700', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>
              Créer mon premier produit
            </button>
          </Link>
        </div>
      )}

      {/* AUCUN RÉSULTAT */}
      {!loading && products.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Aucun produit trouvé pour "{search}"</p>
        </div>
      )}

      {/* GRILLE */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filtered.map((product) => (
            <div key={product.id} style={{ background: '#111111', borderRadius: '14px', border: '0.5px solid #1F1F1F', overflow: 'hidden' }}>

              {/* IMAGE */}
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '160px', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ProductPlaceholderIcon />
                </div>
              )}

              {/* CONTENU */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: 0, lineHeight: '1.4', flex: 1, marginRight: '8px' }}>{product.title}</h3>
                  <span style={{ background: '#10B98120', color: '#10B981', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', flexShrink: 0 }}>Actif</span>
                </div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description || 'Aucune description'}
                </p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#10B981', margin: '0 0 4px' }}>
                  {product.price.toLocaleString('fr-FR')} FCFA
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#444', fontFamily: 'monospace' }}>
                  /p/<span style={{ color: '#6B7280' }}>{product.slug}</span>
                </p>
              </div>

              {/* ACTIONS */}
              <div style={{ padding: '12px 20px', borderTop: '0.5px solid #1F1F1F', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => copyLink(product.slug)}
                  style={{ flex: 1, background: copiedSlug === product.slug ? '#10B98120' : '#1A1A1A', border: `0.5px solid ${copiedSlug === product.slug ? '#10B98140' : '#2a2a2a'}`, color: copiedSlug === product.slug ? '#10B981' : '#9CA3AF', fontSize: '12px', fontWeight: '600', padding: '8px 0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  {copiedSlug === product.slug ? <><CheckIcon /> Copié</> : <><LinkIcon /> Copier</>}
                </button>
                <Link href={`/dashboard/products/${product.id}/edit`} style={{ textDecoration: 'none' }}>
                  <button style={{ background: '#1A1A1A', border: '0.5px solid #2a2a2a', color: '#9CA3AF', fontSize: '12px', fontWeight: '600', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <EditIcon />
                  </button>
                </Link>
                <Link href={`/p/${product.slug}`} target="_blank" style={{ textDecoration: 'none' }}>
                  <button style={{ background: '#1A1A1A', border: '0.5px solid #2a2a2a', color: '#9CA3AF', fontSize: '12px', fontWeight: '600', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <EyeIcon />
                  </button>
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  disabled={deletingId === product.id}
                  style={{ background: '#1A1A1A', border: '0.5px solid #2a2a2a', color: '#EF4444', fontSize: '12px', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {deletingId === product.id ? '...' : <TrashIcon />}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}