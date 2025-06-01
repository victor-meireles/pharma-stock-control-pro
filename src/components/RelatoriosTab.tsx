
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Product, Movement } from '@/types/pharmacy';
import { Package, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Calendar } from 'lucide-react';

interface RelatoriosTabProps {
  products: Product[];
  movements: Movement[];
}

export const RelatoriosTab = ({ products, movements }: RelatoriosTabProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Estatísticas gerais
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  // Valores de estoque
  const totalStockValue = products.reduce((sum, product) => sum + (product.stock * product.costPrice), 0);
  const totalSaleValue = products.reduce((sum, product) => sum + (product.stock * product.sellPrice), 0);
  const potentialProfit = totalSaleValue - totalStockValue;

  // Movimentações do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthMovements = movements.filter(movement => {
    const movementDate = new Date(movement.date);
    return movementDate.getMonth() === currentMonth && movementDate.getFullYear() === currentYear;
  });

  const entradas = currentMonthMovements.filter(m => m.type === 'entrada');
  const saidas = currentMonthMovements.filter(m => m.type === 'saida');
  
  const totalEntradas = entradas.reduce((sum, m) => sum + m.quantity, 0);
  const totalSaidas = saidas.reduce((sum, m) => sum + m.quantity, 0);
  const valorEntradas = entradas.reduce((sum, m) => sum + (m.totalValue || 0), 0);
  const valorSaidas = saidas.reduce((sum, m) => sum + (m.totalValue || 0), 0);

  // Produtos mais vendidos
  const productSales = products.map(product => {
    const salesMovements = movements.filter(m => m.productId === product.id && m.type === 'saida');
    const totalSold = salesMovements.reduce((sum, m) => sum + m.quantity, 0);
    const totalRevenue = salesMovements.reduce((sum, m) => sum + (m.totalValue || 0), 0);
    
    return {
      ...product,
      totalSold,
      totalRevenue
    };
  }).sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);

  // Produtos com estoque crítico
  const criticalProducts = products
    .filter(p => p.stock <= p.minStock)
    .sort((a, b) => a.stock - b.stock);

  // Categorias mais vendidas
  const categorySales = products.reduce((acc, product) => {
    const salesMovements = movements.filter(m => m.productId === product.id && m.type === 'saida');
    const totalSold = salesMovements.reduce((sum, m) => sum + m.quantity, 0);
    
    if (!acc[product.category]) {
      acc[product.category] = {
        category: product.category,
        totalSold: 0,
        totalProducts: 0
      };
    }
    
    acc[product.category].totalSold += totalSold;
    acc[product.category].totalProducts += 1;
    
    return acc;
  }, {} as Record<string, { category: string; totalSold: number; totalProducts: number; }>);

  const topCategories = Object.values(categorySales)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Itens em Estoque</p>
              <p className="text-2xl font-bold">{totalStock}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
              <p className="text-2xl font-bold text-orange-600">{lowStockProducts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingDown className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sem Estoque</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Valores financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor do Estoque (Custo)</p>
              <p className="text-xl font-bold">{formatCurrency(totalStockValue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor do Estoque (Venda)</p>
              <p className="text-xl font-bold">{formatCurrency(totalSaleValue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lucro Potencial</p>
              <p className="text-xl font-bold text-purple-600">{formatCurrency(potentialProfit)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movimentações do mês */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Movimentações do Mês Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total de Entradas</p>
              <p className="text-2xl font-bold text-blue-600">{totalEntradas}</p>
              <p className="text-sm text-gray-500">{formatCurrency(valorEntradas)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total de Saídas</p>
              <p className="text-2xl font-bold text-red-600">{totalSaidas}</p>
              <p className="text-sm text-gray-500">{formatCurrency(valorSaidas)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${totalEntradas - totalSaidas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalEntradas - totalSaidas}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Movimentações</p>
              <p className="text-2xl font-bold">{currentMonthMovements.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos mais vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productSales.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}°</Badge>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{product.totalSold} vendidos</p>
                    <p className="text-sm text-gray-600">{formatCurrency(product.totalRevenue)}</p>
                  </div>
                </div>
              ))}
              {productSales.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhuma venda registrada</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categorias mais vendidas */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Categorias Mais Vendidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}°</Badge>
                    <div>
                      <p className="font-medium">{category.category}</p>
                      <p className="text-sm text-gray-600">{category.totalProducts} produtos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{category.totalSold} vendidos</p>
                  </div>
                </div>
              ))}
              {topCategories.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhuma categoria encontrada</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Produtos com estoque crítico */}
      {criticalProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Produtos com Estoque Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Estoque Mínimo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-mono">{product.stock}</TableCell>
                    <TableCell className="font-mono">{product.minStock}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                        {product.stock === 0 ? 'Sem estoque' : 'Estoque baixo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
