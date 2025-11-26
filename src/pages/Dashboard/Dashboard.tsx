import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { fetchDashboardStats, fetchRecentActivities } from '../../services/dashboardService';

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
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentActivities()
      ]);
      setStats(statsData);
      setActivities(activitiesData);
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
            {loading ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.type} - {activity.status}</p>
                    <p className="text-xs text-gray-500">{activity.description || 'Sem descrição'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Resumo do Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <p className="text-sm font-medium">Total em Estoque</p>
                <p className="text-xs text-gray-500">{stats.totalProducts} produtos</p>
              </div>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">Ativo</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <p className="text-sm font-medium">Faturamento do Mês</p>
                <p className="text-xs text-gray-500">
                  R$ {Number(stats.totalRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">Crescimento</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Entregas Pendentes</p>
                <p className="text-xs text-gray-500">{stats.pendingDeliveries} rotas</p>
              </div>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">Pendente</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
