
export interface Product {
  ID: string;
  DESCRICAO: string;
  PRECO: number;
  CATEGORIA: string; 
  IMAGEM_URL?: string;
}

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  fee: number;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  canAccessProduction: boolean;
  canAccessAdmin: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  whatsapp: string;
  seller?: string;
  companyName?: string; 
  isCompleteRegistration: boolean;
  deliveryMethod: 'DELIVERY' | 'PICKUP'; 
  pickupStore?: string; 
  neighborhood?: string; 
  deliveryFee?: number; 
  address?: string;
  addressNumber?: string;
  cep?: string;
  complement?: string;
  city?: string;
  deliveryDate?: string;
  deliveryTime?: string; 
  items: CartItem[];
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';
  createdAt: string;
  isPrinted?: boolean;
}

export interface ApiResponse<T> {
  result: T[];
}

export interface RawProduct {
  IDPRODUTO: string;
  DESCRICAO: string;
  CODBARRA?: string;
  UNIDADE?: string;
  CATEGORIA?: string; 
}

export interface RawPrice {
  IDPRODUTO: string;
  VALORVENDA: number;
}
