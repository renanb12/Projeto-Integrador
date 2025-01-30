import React, { useState, useEffect } from 'react';
import { Search, Copy } from 'lucide-react';
import { fetchHistory } from '../../services/historyService';
import type { HistoryEntry } from '../../types/history';

export function HistoryList() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const stats = {
    products: history.filter(h => h.type === 'Produtos').length,
    entries: history.filter(h => h.type === 'Entrada').length,
    exits: history.filter(h => h.type === 'Saída').length,
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredHistory = history.filter(item =>
    item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Removido':
        return 'text-red-700 bg-red-100';
      case 'Adicionado':
        return 'text-green-700 bg-green-100';
      case 'Modificado':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-8">Históricos recentes</h2>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Itens, valores ou código"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.products}</div>
              <div className="text-sm text-gray-600">Itens em Produtos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.exits}</div>
              <div className="text-sm text-gray-600">Itens em Saída</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.entries}</div>
              <div className="text-sm text-gray-600">Itens em Entrada</div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left p-4">Alterado em</th>
                <th className="text-left p-4">Tipo</th>
                <th className="text-left p-4">Categoria</th>
                <th className="text-left p-4">Nome do Fornecedor</th>
                <th className="text-left p-4">Nome da Mercadoria</th>
                <th className="text-left p-4">QTDE.</th>
                <th className="text-left p-4">Valor Unitário</th>
                <th className="text-left p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-sm ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-blue-600 ${item.type === 'Entrada' ? 'font-medium' : ''}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">{item.supplier_name || '-'}</td>
                  <td className="p-4">{item.product_name}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4 text-red-600">
                    R$ {item.unit_price ? Number(item.unit_price).toFixed(2) : '-'}
                  </td>
                  <td className="p-4">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => navigator.clipboard.writeText(item.item_id)}
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}