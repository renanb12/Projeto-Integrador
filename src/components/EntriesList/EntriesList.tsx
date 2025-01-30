import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { EntryForm } from '../EntryForm/EntryForm';
import { fetchEntries, fetchEntryProducts } from '../../services/entryService';
import type { Entry } from '../../types/entry';

interface EntryProduct {
  code: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export function EntriesList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [entryProducts, setEntryProducts] = useState<Record<string, EntryProduct[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchEntries();
      setEntries(data);
    } catch (error) {
      // setError('Erro ao carregar entradas. Por favor, tente novamente.');
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEntryProducts = async (entryId: string) => {
    try {
      const products = await fetchEntryProducts(entryId);
      setEntryProducts(prev => ({ ...prev, [entryId]: products }));
    } catch (error) {
      console.error('Error fetching entry products:', error);
      setError('Erro ao carregar produtos da entrada.');
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const filteredEntries = entries.filter(entry =>
    entry.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.note_number?.includes(searchTerm) ||
    entry.supplier_cnpj?.includes(searchTerm)
  );

  const toggleEntry = async (entryId: string) => {
    if (expandedEntry === entryId) {
      setExpandedEntry(null);
    } else {
      setExpandedEntry(entryId);
      if (!entryProducts[entryId]) {
        await loadEntryProducts(entryId);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Entrada de Produtos</h2>
          <p className="text-gray-600 text-sm">{entries.length} notas fiscais</p>
        </div>
        <button 
          onClick={() => setShowEntryForm(true)}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Importar XML</span>
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
            placeholder="Buscar por fornecedor, número da nota ou CNPJ"
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-8"></th>
                <th className="text-left p-4 font-medium">Data de Entrada</th>
                <th className="text-left p-4 font-medium">Nº Nota</th>
                <th className="text-left p-4 font-medium">CNPJ</th>
                <th className="text-left p-4 font-medium">Fornecedor</th>
                <th className="text-left p-4 font-medium">Total Produtos</th>
                <th className="text-left p-4 font-medium">Total Itens</th>
                <th className="text-right p-4 font-medium">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <React.Fragment key={entry.id}>
                  <tr 
                    className="hover:bg-gray-50 transition-colors cursor-pointer" 
                    onClick={() => toggleEntry(entry.id)}
                  >
                    <td className="p-4">
                      {expandedEntry === entry.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </td>
                    <td className="p-4">
                      {new Date(entry.emission_date || entry.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">{entry.note_number}</td>
                    <td className="p-4">{entry.supplier_cnpj}</td>
                    <td className="p-4">{entry.supplier_name}</td>
                    <td className="p-4">{entry.total_products || '-'}</td>
                    <td className="p-4">{entry.total_items || '-'}</td>
                    <td className="p-4 text-right font-medium">
                      {entry.total_value 
                        ? `R$ ${Number(entry.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        : '-'
                      }
                    </td>
                  </tr>
                  {expandedEntry === entry.id && entryProducts[entry.id] && (
                    <tr>
                      <td colSpan={8} className="bg-gray-50 p-4">
                        <div className="rounded-lg overflow-hidden border border-gray-200">
                          <table className="w-full">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-left p-3 font-medium">Código</th>
                                <th className="text-left p-3 font-medium">Produto</th>
                                <th className="text-right p-3 font-medium">Quantidade</th>
                                <th className="text-right p-3 font-medium">Preço Unit.</th>
                                <th className="text-right p-3 font-medium">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {entryProducts[entry.id].map((product, index) => (
                                <tr key={index} className="hover:bg-white transition-colors">
                                  <td className="p-3">{product.code}</td>
                                  <td className="p-3">{product.name}</td>
                                  <td className="p-3 text-right">{product.quantity}</td>
                                  <td className="p-3 text-right">
                                    R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </td>
                                  <td className="p-3 text-right font-medium">
                                    R$ {Number(product.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEntryForm && (
        <EntryForm
          onClose={() => setShowEntryForm(false)}
          onSave={loadEntries}
        />
      )}
    </div>
  );
}