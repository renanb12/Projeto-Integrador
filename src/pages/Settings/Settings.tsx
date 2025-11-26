import React, { useState } from 'react';
import { Save, Building, Bell, Lock, Database } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export function Settings() {
  const [settings, setSettings] = useState({
    company_name: '3D Manager',
    company_document: '00.000.000/0000-00',
    email: 'contato@3dmanager.com',
    phone: '(51) 99999-9999',
    address: 'Rua Exemplo, 123',
    city: 'Porto Alegre',
    state: 'RS',
    notifications_email: true,
    notifications_system: true,
    auto_backup: true,
    backup_frequency: 'daily'
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Configurações"
        subtitle="Gerencie as configurações do sistema"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Building className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Informações da Empresa</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Empresa
              </label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={settings.company_document}
                onChange={(e) => setSettings({ ...settings, company_document: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Notificações</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por Email</p>
                <p className="text-sm text-gray-500">Receber alertas por email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications_email}
                onChange={(e) => setSettings({ ...settings, notifications_email: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações do Sistema</p>
                <p className="text-sm text-gray-500">Alertas no dashboard</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications_system}
                onChange={(e) => setSettings({ ...settings, notifications_system: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Backup</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Backup Automático</p>
                <p className="text-sm text-gray-500">Ativar backups automáticos</p>
              </div>
              <input
                type="checkbox"
                checked={settings.auto_backup}
                onChange={(e) => setSettings({ ...settings, auto_backup: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequência
              </label>
              <select
                value={settings.backup_frequency}
                onChange={(e) => setSettings({ ...settings, backup_frequency: e.target.value })}
                className="w-full p-2 border rounded-lg"
                disabled={!settings.auto_backup}
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Segurança</h3>
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
            <Button variant="outline" className="w-full">
              Autenticação em Dois Fatores
            </Button>
            <Button variant="outline" className="w-full">
              Sessões Ativas
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button icon={Save} onClick={handleSave}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
