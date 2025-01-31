import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { ExitModal } from '../ExitModal/ExitModal';
import { fetchExits, createExit } from '../../services/exitService';
import type { Exit } from '../../types/exit';

export function ExitsList() {
  const [exits, setExits] = useState<Exit[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadExits = async () => {
    try {
      setLoading(true);
      const data = await fetchExits();
      setExits(data);
    } catch (err) {
      setError('Erro ao carregar saídas');
      console.error('Error loading exits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExits();
  }, []);

  const handleSaveExit = async (data: any) => {
    try {
      await createExit(data);
      await loadExits();
      setShowExitModal(false);
    } catch (err) {
      console.error('Error saving exit:', err);
      throw err;
    }
  };

  const filteredExits = exits.filter(exit =>
    exit.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exit.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-full overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Saída de Produtos</h2>
          <p className="text-gray-600 text-sm">Registre as saídas de produtos do estoque</p>
        </div>
        <button 
          onClick={() => setShowExitModal(true)}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Saída</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por produto ou motivo"
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="text-left p-4 font-medium whitespace-nowrap">Data</th>
                  <th className="text-left p-4 font-medium whitespace-nowrap">Produto</th>
                  <th className="text-left p-4 font-medium whitespace-nowrap">Quantidade</th>
                  <th className="text-left p-4 font-medium whitespace-nowrap">Motivo</th>
                  <th className="text-right p-4 font-medium whitespace-nowrap">Valor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExits.length === 0 ? (
                  <tr className="text-gray-500 text-center">
                    <td colSpan={5} className="py-8">
                      Nenhuma saída registrada
                    </td>
                  </tr>
                ) : (
                  filteredExits.map((exit) => (
                    <tr key={exit.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        {new Date(exit.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">{exit.product_name}</td>
                      <td className="p-4">
                        {exit.quantity} {exit.product_type}
                      </td>
                      <td className="p-4">{exit.reason}</td>
                      <td className="p-4 text-right">
                        R$ {Number(exit.total_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showExitModal && (
        <ExitModal
          onClose={() => setShowExitModal(false)}
          onSave={handleSaveExit}
        />
      )}
    </div>
  );
}