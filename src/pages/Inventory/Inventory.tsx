import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { StatCard } from '../../components/common/StatCard';
import { ProductModal } from '../../components/ProductModal/ProductModal';
import api from '../../services/api';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  type: string;
  price: number;
  purchase_price?: number;
  location?: string;
  barcode?: string;
}

export function Inventory() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setInventory(response.data.products || response.data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (productData: any) => {
    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, productData);
      } else {
        await api.post('/products', productData);
      }
      await loadInventory();
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      console.error('Error saving product:', error);
      throw new Error(error.response?.data?.message || 'Erro ao salvar produto');
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${id}`);
        await loadInventory();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Erro ao excluir produto');
      }
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatus = (stock: number) => {
    if (stock === 0) return 'out';
    if (stock < 50) return 'low';
    return 'available';
  };

  const stats = {
    total: inventory.length,
    available: inventory.filter(i => getStatus(i.stock) === 'available').length,
    low: inventory.filter(i => getStatus(i.stock) === 'low').length,
    out: inventory.filter(i => getStatus(i.stock) === 'out').length
  };

  const getStatusBadge = (stock: number) => {
    const status = getStatus(stock);
    const badges = {
      available: <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Disponível</span>,
      low: <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">Baixo</span>,
      out: <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Esgotado</span>
    };
    return badges[status as keyof typeof badges];
  };

  const columns = [
    { key: 'name', label: 'Produto' },
    { key: 'category', label: 'Categoria' },
    {
      key: 'stock',
      label: 'Estoque',
      render: (value: any, row: Product) => `${value} ${row.type}`
    },
    {
      key: 'price',
      label: 'Preço',
      render: (value: any) => `R$ ${Number(value).toFixed(2)}`
    },
    {
      key: 'location',
      label: 'Localização',
      render: (value: any) => value || '-'
    },
    {
      key: 'stock',
      label: 'Status',
      render: (value: any) => getStatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Ações',
      className: 'text-right',
      render: (_: any, row: Product) => (
        <div className="flex gap-2 justify-end">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Estoque"
        subtitle={`${inventory.length} produtos em estoque`}
        action={
          <Button icon={Plus} onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}>
            Novo Produto
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total de Produtos" value={stats.total} icon={Package} color="blue" />
        <StatCard title="Disponível" value={stats.available} color="green" />
        <StatCard title="Estoque Baixo" value={stats.low} color="orange" />
        <StatCard title="Esgotado" value={stats.out} color="red" />
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por produto ou categoria"
        />
      </div>

      <Table
        columns={columns}
        data={filteredInventory}
        loading={loading}
        emptyMessage="Nenhum produto encontrado"
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
        product={selectedProduct}
      />
    </div>
  );
}
