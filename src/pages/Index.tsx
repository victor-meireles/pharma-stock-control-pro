
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EstoqueTab } from '@/components/EstoqueTab';
import { MovimentacoesTab } from '@/components/MovimentacoesTab';
import { RelatoriosTab } from '@/components/RelatoriosTab';
import { AlertasTab } from '@/components/AlertasTab';
import { usePharmacyData } from '@/hooks/usePharmacyData';
import { Package, TrendingUp, BarChart3, Bell } from 'lucide-react';

const Index = () => {
  const {
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
  } = usePharmacyData();

  const activeAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            PharmControl
          </h1>
          <p className="text-lg text-gray-600">
            Sistema de Controle de Estoque para Farmácia
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Tabs defaultValue="estoque" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="estoque" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Estoque
              </TabsTrigger>
              <TabsTrigger value="movimentacoes" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Movimentações
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="alertas" className="flex items-center gap-2 relative">
                <Bell className="h-4 w-4" />
                Alertas
                {activeAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeAlerts.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="estoque" className="space-y-6">
              <EstoqueTab
                products={products}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onRemoveProduct={removeProduct}
              />
            </TabsContent>

            <TabsContent value="movimentacoes" className="space-y-6">
              <MovimentacoesTab
                products={products}
                movements={movements}
                onAddMovement={addMovement}
              />
            </TabsContent>

            <TabsContent value="relatorios" className="space-y-6">
              <RelatoriosTab
                products={products}
                movements={movements}
              />
            </TabsContent>

            <TabsContent value="alertas" className="space-y-6">
              <AlertasTab
                alerts={alerts}
                whatsappConfig={whatsappConfig}
                onResolveAlert={resolveAlert}
                onUpdateWhatsAppConfig={setWhatsappConfig}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            PharmControl - Desenvolvido para otimizar o controle de estoque da sua farmácia
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
