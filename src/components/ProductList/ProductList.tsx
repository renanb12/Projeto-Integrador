import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, ChevronDown } from 'lucide-react';
import { ProductModal } from '../ProductModal/ProductModal';
import { fetchProducts, deleteProduct, createProduct, updateProduct } from '../../services/productService';
import type { Product } from '../../types/product';

const CATEGORIES = [
  'Todos',
  'Limpeza',
  'Alimentos',
  'Bebidas',
  'Higiene',
  'Papelaria',
  'Eletrônicos',
  'Ferramentas',
  'Outros'
];

export function ProductList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockRange, setStockRange] = useState({ min: '', max: '' });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const { products: productsList } = await fetchProducts();
      setProducts(productsList);
    } catch (err) {
      setError('Erro ao carregar produtos. Por favor, tente novamente.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError('Erro ao deletar produto');
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setIsModalOpen(false);
      setSelectedProduct(undefined);
      await loadProducts();
    } catch (err) {
      throw new Error('Erro ao salvar produto');
    }
  };

  const resetFilters = () => {
    setSelectedCategory('Todos');
    setPriceRange({ min: '', max: '' });
    setStockRange({ min: '', max: '' });
    setSearchTerm('');
  };

  const filteredProducts = products.filter((product) => {
    const searchFilter = 
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.barcode?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const categoryFilter = selectedCategory === 'Todos' || product.category === selectedCategory;

    const priceFilter = 
      (!priceRange.min || product.price >= Number(priceRange.min)) &&
      (!priceRange.max || product.price <= Number(priceRange.max));

    const stockFilter = 
      (!stockRange.min || product.stock >= Number(stockRange.min)) &&
      (!stockRange.max || product.stock <= Number(stockRange.max));

    return searchFilter && categoryFilter && priceFilter && stockFilter;
  });

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-gray-100 px-4 py-4 md:px-0 md:py-0 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Produtos</h2>
            <p className="text-gray-600 text-sm">{products.length} itens cadastrados</p>
          </div>
          <button 
            onClick={() => {
              setSelectedProduct(undefined);
              setIsModalOpen(true);
            }}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar Produto</span>
          </button>
        </div>

        {/* Search and Filters Section */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Preço (R$)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Estoque
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={stockRange.min}
                      onChange={(e) => setStockRange({ ...stockRange, min: e.target.value })}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={stockRange.max}
                      onChange={(e) => setStockRange({ ...stockRange, max: e.target.value })}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full p-2.5 text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-4 md:mx-0 mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mx-4 md:mx-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="text-left p-4 font-medium">ID</th>
                  <th className="text-left p-4 font-medium">Produto</th>
                  <th className="text-left p-4 font-medium">Categoria</th>
                  <th className="text-left p-4 font-medium">Estoque</th>
                  <th className="text-left p-4 font-medium">Preço de Venda</th>
                  <th className="text-left p-4 font-medium">Preço de Compra</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm">{product.id}</td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4 text-green-600 font-medium">
                      R$ {Number(product.price).toFixed(2)}
                    </td>
                    <td className="p-4 text-gray-600">
                      {product.purchase_price 
                        ? `R$ ${Number(product.purchase_price).toFixed(2)}`
                        : '-'
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <ProductModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(undefined);
          }}
          onSave={handleSaveProduct}
          product={selectedProduct}
        />
      )}
    </div>
  );
}