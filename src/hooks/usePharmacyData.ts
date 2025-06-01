
import { useState, useEffect } from 'react';
import { Product, Movement, Alert, WhatsAppConfig } from '@/types/pharmacy';

export const usePharmacyData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    phoneNumber: '',
    enabled: false
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('pharmacy-products');
    const savedMovements = localStorage.getItem('pharmacy-movements');
    const savedAlerts = localStorage.getItem('pharmacy-alerts');
    const savedWhatsapp = localStorage.getItem('pharmacy-whatsapp');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedMovements) setMovements(JSON.parse(savedMovements));
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    if (savedWhatsapp) setWhatsappConfig(JSON.parse(savedWhatsapp));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('pharmacy-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pharmacy-movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('pharmacy-alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('pharmacy-whatsapp', JSON.stringify(whatsappConfig));
  }, [whatsappConfig]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setProducts(prev => [...prev, newProduct]);
    
    // Add cadastro movement
    const movement: Movement = {
      id: Date.now().toString(),
      productId: newProduct.id,
      productName: newProduct.name,
      type: 'cadastro',
      quantity: product.stock,
      reason: 'Cadastro inicial do produto',
      date: new Date().toISOString(),
      user: 'Sistema'
    };
    
    setMovements(prev => [...prev, movement]);
    checkStockAlert(newProduct);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    setMovements(prev => prev.filter(movement => movement.productId !== id));
    setAlerts(prev => prev.filter(alert => alert.productId !== id));
  };

  const addMovement = (productId: string, type: 'entrada' | 'saida', quantity: number, reason: string, unitPrice?: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const movement: Movement = {
      id: Date.now().toString(),
      productId,
      productName: product.name,
      type,
      quantity,
      unitPrice,
      totalValue: unitPrice ? unitPrice * quantity : undefined,
      reason,
      date: new Date().toISOString(),
      user: 'Usuário'
    };

    setMovements(prev => [...prev, movement]);

    // Update product stock
    const newStock = type === 'entrada' 
      ? product.stock + quantity 
      : product.stock - quantity;

    updateProduct(productId, { stock: Math.max(0, newStock) });
    
    // Check for stock alerts
    const updatedProduct = { ...product, stock: Math.max(0, newStock) };
    checkStockAlert(updatedProduct);
  };

  const checkStockAlert = (product: Product) => {
    const totalEntries = movements
      .filter(m => m.productId === product.id && (m.type === 'entrada' || m.type === 'cadastro'))
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const alertThreshold = totalEntries * 0.15; // 15% of total entries
    
    if (product.stock <= alertThreshold && product.stock <= product.minStock) {
      const existingAlert = alerts.find(a => a.productId === product.id && !a.resolved);
      
      if (!existingAlert) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          productId: product.id,
          productName: product.name,
          currentStock: product.stock,
          minStock: product.minStock,
          percentage: totalEntries > 0 ? (product.stock / totalEntries) * 100 : 0,
          createdAt: new Date().toISOString(),
          resolved: false
        };
        
        setAlerts(prev => [...prev, newAlert]);
        
        // Simulate WhatsApp notification (in real app, this would call an API)
        if (whatsappConfig.enabled && whatsappConfig.phoneNumber) {
          console.log(`📱 WhatsApp Alert to ${whatsappConfig.phoneNumber}: Produto ${product.name} com estoque baixo (${product.stock} unidades)`);
        }
      }
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return {
    products,
    movements,
    alerts,
    whatsappConfig,
    addProduct,
    updateProduct,
    removeProduct,
    addMovement,
    resolveAlert,
    setWhatsappConfig
  };
};
