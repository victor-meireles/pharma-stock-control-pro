
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Product, Movement } from '@/types/pharmacy';
import { Plus, ArrowUp, ArrowDown, UserPlus } from 'lucide-react';

interface MovimentacoesTabProps {
  products: Product[];
  movements: Movement[];
  onAddMovement: (productId: string, type: 'entrada' | 'saida', quantity: number, reason: string, unitPrice?: number) => void;
}

export const MovimentacoesTab = ({ products, movements, onAddMovement }: MovimentacoesTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'entrada' as 'entrada' | 'saida',
    quantity: 0,
    reason: '',
    unitPrice: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || formData.quantity <= 0) return;

    onAddMovement(
      formData.productId,
      formData.type,
      formData.quantity,
      formData.reason,
      formData.unitPrice > 0 ? formData.unitPrice : undefined
    );

    setFormData({
      productId: '',
      type: 'entrada',
      quantity: 0,
      reason: '',
      unitPrice: 0
    });
    setShowForm(false);
  };

  const getMovementIcon = (type: Movement['type']) => {
    switch (type) {
      case 'entrada':
        return <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
          <ArrowUp className="h-2 w-2 text-white" />
        </div>;
      case 'saida':
        return <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
          <ArrowDown className="h-2 w-2 text-white" />
        </div>;
      case 'cadastro':
        return <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
          <UserPlus className="h-2 w-2 text-white" />
        </div>;
    }
  };

  const getMovementBadgeColor = (type: Movement['type']) => {
    switch (type) {
      case 'entrada': return 'bg-blue-100 text-blue-800';
      case 'saida': return 'bg-red-100 text-red-800';
      case 'cadastro': return 'bg-green-100 text-green-800';
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Movimentações de Estoque</CardTitle>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Movimentação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Registrar Movimentação</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product">Produto *</Label>
                      <Select 
                        value={formData.productId} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} (Estoque atual: {product.stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="type">Tipo de Movimentação *</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value: 'entrada' | 'saida') => setFormData(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entrada">Entrada</SelectItem>
                          <SelectItem value="saida">Saída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantidade *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="unitPrice">Preço Unitário (R$)</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        step="0.01"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Motivo *</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Descreva o motivo da movimentação..."
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Registrar Movimentação</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Unit.</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((movement) => (
                    <TableRow key={movement.id} className="hover:bg-gray-50">
                      <TableCell>{getMovementIcon(movement.type)}</TableCell>
                      <TableCell className="font-medium">{movement.productName}</TableCell>
                      <TableCell>
                        <Badge className={getMovementBadgeColor(movement.type)}>
                          {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{movement.quantity}</TableCell>
                      <TableCell>{formatCurrency(movement.unitPrice)}</TableCell>
                      <TableCell>{formatCurrency(movement.totalValue)}</TableCell>
                      <TableCell className="max-w-xs truncate" title={movement.reason}>
                        {movement.reason}
                      </TableCell>
                      <TableCell>
                        {new Date(movement.date).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(movement.date).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </TableCell>
                      <TableCell>{movement.user}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {movements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma movimentação registrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
