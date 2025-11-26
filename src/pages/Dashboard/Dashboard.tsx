import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingDeliveries: 0,
    entriesThisMonth: 0,
    exitsThisMonth: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setStats({
        totalProducts: 127,
        totalRevenue: 45678.90,
        totalCustomers: 42,
        pendingDeliveries: 8,
        entriesThisMonth: 23,
        exitsThisMonth: 45
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total de Produtos"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Faturamento Total"
          value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Total de Clientes"
          value={stats.totalCustomers}
          icon={Users}
          color="orange"
          loading={loading}
        />
        <StatCard
          title="Entregas Pendentes"
          value={stats.pendingDeliveries}
          icon={ShoppingCart}
          color="red"
          loading={loading}
        />
        <StatCard
          title="Entradas (Mês)"
          value={stats.entriesThisMonth}
          icon={TrendingDown}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Saídas (Mês)"
          value={stats.exitsThisMonth}
          icon={TrendingUp}
          color="green"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova entrada registrada</p>
                  <p className="text-xs text-gray-500">Há {item} hora(s)</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Produtos em Baixo Estoque</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                <div>
                  <p className="text-sm font-medium">Produto {item}</p>
                  <p className="text-xs text-gray-500">Estoque: {item * 5} unidades</p>
                </div>
                <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">Baixo</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
