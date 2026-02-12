
import { Product, ApiResponse, RawProduct, RawPrice } from '../types';

const PRODUCTS_URL = 'http://web.chlitoral.com.br:8081/datasnap/rest/TCHAPI/Produto/00000000000001/1/True/True';
const PRICES_URL = 'http://web.chlitoral.com.br:8081/datasnap/rest/TCHAPI/VendaProduto/00000000000001/1';

const extractDataSnapResult = (data: any): any[] => {
  if (!data || !data.result) return [];
  if (Array.isArray(data.result[0])) return data.result[0];
  if (Array.isArray(data.result)) return data.result;
  return [];
};

export const fetchProducts = async (): Promise<{ products: Product[], isFromApi: boolean }> => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    // Removendo 'mode: no-cors' pois impediria a leitura do JSON. 
    // O erro 'Failed to fetch' é um problema de CORS no servidor do cliente.
  };

  try {
    const [prodRes, priceRes] = await Promise.all([
      fetch(PRODUCTS_URL, fetchOptions).then(res => {
        if (!res.ok) throw new Error('Servidor ERP retornou erro');
        return res.json();
      }),
      fetch(PRICES_URL, fetchOptions).then(res => {
        if (!res.ok) throw new Error('Servidor de Preços retornou erro');
        return res.json();
      })
    ]);

    const rawProducts = extractDataSnapResult(prodRes) as RawProduct[];
    const rawPrices = extractDataSnapResult(priceRes) as RawPrice[];

    if (rawProducts.length === 0) throw new Error("API vazia");

    const pricesMap = new Map<string, number>();
    rawPrices.forEach(p => {
      if (p.IDPRODUTO) pricesMap.set(String(p.IDPRODUTO), Number(p.VALORVENDA));
    });

    const mappedProducts = rawProducts.map(p => ({
      ID: String(p.IDPRODUTO),
      DESCRICAO: p.DESCRICAO || 'Produto sem descrição',
      CATEGORIA: p.CATEGORIA || 'DIVERSOS',
      PRECO: pricesMap.get(String(p.IDPRODUTO)) || 0,
      IMAGEM_URL: `https://picsum.photos/seed/${p.IDPRODUTO}/400/300`
    }));

    return { products: mappedProducts, isFromApi: true };

  } catch (error) {
    // Se falhar (CORS ou Servidor Down), usamos o Mock silenciosamente mas avisamos o App
    console.warn("Conexão direta com ERP bloqueada (CORS) ou servidor offline. Usando modo de demonstração.");
    return { products: MOCK_PRODUCTS, isFromApi: false };
  }
};

const MOCK_PRODUCTS: Product[] = [
  { ID: 'M1', DESCRICAO: 'Torta de Chocolate Belga', CATEGORIA: 'TORTAS', PRECO: 85.00, IMAGEM_URL: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
  { ID: 'M2', DESCRICAO: 'Torta de Morango com Chantilly', CATEGORIA: 'TORTAS', PRECO: 78.00, IMAGEM_URL: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400' },
  { ID: 'M3', DESCRICAO: 'Lasanha Quatro Queijos (1kg)', CATEGORIA: 'MASSAS', PRECO: 52.00, IMAGEM_URL: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400' },
  { ID: 'M4', DESCRICAO: 'Fettuccine ao Pesto', CATEGORIA: 'MASSAS', PRECO: 45.00, IMAGEM_URL: 'https://images.unsplash.com/photo-1645112481338-358090598944?w=400' },
  { ID: 'M5', DESCRICAO: 'Café Espresso Gourmet', CATEGORIA: 'CAFÉS', PRECO: 12.00, IMAGEM_URL: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=400' },
  { ID: 'M6', DESCRICAO: 'Cappuccino Italiano', CATEGORIA: 'CAFÉS', PRECO: 15.00, IMAGEM_URL: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400' },
];
