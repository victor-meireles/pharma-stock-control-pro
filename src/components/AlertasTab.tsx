
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, WhatsAppConfig } from '@/types/pharmacy';
import { AlertTriangle, Phone, Check, Bell, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlertasTabProps {
  alerts: Alert[];
  whatsappConfig: WhatsAppConfig;
  onResolveAlert: (alertId: string) => void;
  onUpdateWhatsAppConfig: (config: WhatsAppConfig) => void;
}

export const AlertasTab = ({ alerts, whatsappConfig, onResolveAlert, onUpdateWhatsAppConfig }: AlertasTabProps) => {
  const [phoneNumber, setPhoneNumber] = useState(whatsappConfig.phoneNumber);
  const { toast } = useToast();

  const handleSaveWhatsApp = () => {
    // Validação básica do número
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      toast({
        title: "Número inválido",
        description: "Digite um número de WhatsApp válido (DDD + número)",
        variant: "destructive"
      });
      return;
    }

    onUpdateWhatsAppConfig({
      phoneNumber: cleanNumber,
      enabled: whatsappConfig.enabled
    });

    toast({
      title: "Configuração salva",
      description: "Número do WhatsApp configurado com sucesso!",
    });
  };

  const handleToggleWhatsApp = (enabled: boolean) => {
    if (enabled && !whatsappConfig.phoneNumber) {
      toast({
        title: "Configure o número",
        description: "Primeiro configure um número de WhatsApp válido",
        variant: "destructive"
      });
      return;
    }

    onUpdateWhatsAppConfig({
      ...whatsappConfig,
      enabled
    });

    toast({
      title: enabled ? "Alertas ativados" : "Alertas desativados",
      description: enabled 
        ? "Você receberá alertas por WhatsApp quando o estoque estiver baixo"
        : "Os alertas por WhatsApp foram desativados",
    });
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      {/* Configuração do WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Configuração de Alertas WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsapp">Número do WhatsApp</Label>
              <div className="flex gap-2">
                <Input
                  id="whatsapp"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="flex-1"
                />
                <Button onClick={handleSaveWhatsApp} variant="outline">
                  Salvar
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Digite apenas números (DDD + número)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enable-alerts"
                checked={whatsappConfig.enabled}
                onCheckedChange={handleToggleWhatsApp}
              />
              <Label htmlFor="enable-alerts">Ativar alertas por WhatsApp</Label>
            </div>
          </div>

          {whatsappConfig.enabled && whatsappConfig.phoneNumber && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <Check className="h-4 w-4" />
                <span className="font-medium">Alertas ativados</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Alertas serão enviados para: {formatPhoneNumber(whatsappConfig.phoneNumber)}
              </p>
              <p className="text-green-600 text-xs mt-2">
                ℹ️ Os alertas são enviados quando um produto atinge 15% ou menos do total de entradas + cadastro inicial
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Como funciona o sistema de alertas:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• O sistema monitora automaticamente o estoque de todos os produtos</li>
              <li>• Quando um produto atinge 15% ou menos do total de entradas, um alerta é gerado</li>
              <li>• Se o WhatsApp estiver configurado, você receberá uma notificação automática</li>
              <li>• Os alertas aparecem nesta aba para acompanhamento</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Alertas Ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Alertas Ativos ({activeAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length > 0 ? (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <h4 className="font-medium text-orange-900">{alert.productName}</h4>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          Estoque Baixo
                        </Badge>
                      </div>
                      <div className="text-sm text-orange-800 space-y-1">
                        <p>• Estoque atual: <span className="font-mono font-medium">{alert.currentStock}</span> unidades</p>
                        <p>• Estoque mínimo: <span className="font-mono font-medium">{alert.minStock}</span> unidades</p>
                        <p>• Porcentagem do total: <span className="font-mono font-medium">{alert.percentage.toFixed(1)}%</span></p>
                        <p className="text-xs text-orange-600">
                          Alerta criado em: {new Date(alert.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => onResolveAlert(alert.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Resolver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum alerta ativo no momento</p>
              <p className="text-sm">Os produtos estão com estoque adequado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Alertas Resolvidos */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Alertas Resolvidos ({resolvedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resolvedAlerts.slice(0, 10).map((alert) => (
                <div key={alert.id} className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">{alert.productName}</p>
                      <p className="text-sm text-gray-600">
                        Estoque estava em {alert.currentStock} unidades ({alert.percentage.toFixed(1)}%)
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Resolvido
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
