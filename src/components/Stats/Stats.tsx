import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../services/productService';

interface StatsData {
  stockValue: number;
  costValue: number;
  profitValue: number;
}

export function Stats() {
  const [stats, setStats] = useState<StatsData>({
    stockValue: 0,
    costValue: 0,
    profitValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const { totals } = await fetchProducts();
        if (totals) {
          setStats(totals);
        }
      } catch (err) {
        console.error('Error loading stats:', err);
        setError('Erro ao carregar estatísticas');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm mb-1">Valor em estoque</h3>
        <p className="text-2xl font-bold text-orange-500">
          R$ {stats.stockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm mb-1">Custo do estoque</h3>
        <p className="text-2xl font-bold text-red-500">
          R$ {stats.costValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm mb-1">Lucro do estoque</h3>
        <p className="text-2xl font-bold text-green-500">
          R$ {stats.profitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}