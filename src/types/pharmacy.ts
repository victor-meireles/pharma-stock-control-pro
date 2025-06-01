
export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  expirationDate: string;
  barcode?: string;
  description?: string;
  createdAt: string;
}

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: 'entrada' | 'saida' | 'cadastro';
  quantity: number;
  unitPrice?: number;
  totalValue?: number;
  reason: string;
  date: string;
  user: string;
}

export interface Alert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  percentage: number;
  createdAt: string;
  resolved: boolean;
}

export interface WhatsAppConfig {
  phoneNumber: string;
  enabled: boolean;
}
