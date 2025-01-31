import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import type { Product } from '../../types/product';
import { fetchProducts } from '../../services/productService';

interface ExitModalProps {
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function ExitModal({ onClose, onSave }: ExitModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchProducts = async (term: string) => {
    if (term.length < 3) return;
    
    try {
      setLoading(true);
      const { products: results } = await fetchProducts();
      setProducts(
        results.filter(p => 
          p.name.toLowerCase().includes(term.toLowerCase()) ||
          p.barcode?.toLowerCase().includes(term.toLowerCase())
        )
      );
    } catch (err) {
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError('Selecione um produto');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Quantidade inválida');
      return;
    }
    if (!reason) {
      setError('Informe o motivo da saída');
      return;
    }
    if (Number(quantity) > selectedProduct.stock) {
      setError('Quantidade maior que o estoque disponível');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        productId: selectedProduct.id,
        quantity: Number(quantity),
        reason
      });
    } catch (err) {
      setError('Erro ao registrar saída');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[500px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Nova Saída</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar produto por nome ou código"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchProducts(e.target.value);
                }}
              />
            </div>
            {searchTerm.length >= 3 && products.length > 0 && !selectedProduct && (
              <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSearchTerm(product.name);
                    }}
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      Estoque: {product.stock} {product.type} | 
                      Código: {product.barcode || 'N/A'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedProduct && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Estoque disponível: {selectedProduct.stock} {selectedProduct.type}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo da Saída
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Selecione um motivo</option>
                  <option value="Venda">Venda</option>
                  <option value="Perda">Perda</option>
                  <option value="Defeito">Defeito</option>
                  <option value="Devolução">Devolução</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Registrar Saída'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}