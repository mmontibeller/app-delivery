import { Product } from '../types'

const API_URL = 'https://api.litoraltech.com.br/produtos'

// ==========================
// BUSCAR PRODUTOS + GRUPOS
// ==========================
export const fetchProducts = async (): Promise<{ products: Product[]; isFromApi: boolean }> => {
  try {
    // 1️⃣ Buscar grupos
    const gruposRes = await fetch(`${API_URL}/grupos`)
    if (!gruposRes.ok) throw new Error('Erro ao buscar grupos')
    const grupos = await gruposRes.json()

    const todosProdutos: Product[] = []

    // 2️⃣ Para cada grupo, buscar produtos
    for (const grupo of grupos) {
      const produtosRes = await fetch(`${API_URL}?grupo=${grupo.id}`)
      if (!produtosRes.ok) continue

      const produtos = await produtosRes.json()

      const produtosFormatados: Product[] = produtos.map((p: any) => ({
        ID: String(p.id),
        DESCRICAO: p.descricao || '',
        CATEGORIA: grupo.descricao || 'GERAL',
        PRECO: Number(p.preco || 0),

        IMAGEM_URL:
          p.imagem && p.imagem.length > 50
            ? `data:image/jpeg;base64,${p.imagem}`
            : '/placeholder.png'
      }))

      todosProdutos.push(...produtosFormatados)
    }

    return { products: todosProdutos, isFromApi: true }
  } catch (error) {
    console.warn('Erro ao buscar da API própria. Usando modo demo.')

    return { products: MOCK_PRODUCTS, isFromApi: false }
  }
}

// ==========================
// MOCK (fallback apenas)
// ==========================
const MOCK_PRODUCTS: Product[] = [
  {
    ID: 'M1',
    DESCRICAO: 'Produto Demo',
    CATEGORIA: 'DEMO',
    PRECO: 10.0,
    IMAGEM_URL: '/placeholder.png'
  }
]
