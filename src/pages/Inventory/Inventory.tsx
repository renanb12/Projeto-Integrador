import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { StatCard } from '../../components/common/StatCard';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  location: string;
  status: 'available' | 'low' | 'out';
}

export function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setInventory([
        {
          id: '1',
          name: 'Picanha',
          category: 'Carne Bovina',
          stock: 150,
          unit: 'KG',
          price: 65.90,
          location: 'Câmara Fria 1',
          status: 'available'
        },
        {
          id: '2',
          name: 'Alcatra',
          category: 'Carne Bovina',
          stock: 20,
          unit: 'KG',
          price: 45.90,
          location: 'Câmara Fria 1',
          status: 'low'
        },
        {
          id: '3',
          name: 'Costela',
          category: 'Carne Bovina',
          stock: 0,
          unit: 'KG',
          price: 35.90,
          location: 'Câmara Fria 2',
          status: 'out'
        }
      ]);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: inventory.length,
    available: inventory.filter(i => i.status === 'available').length,
    low: inventory.filter(i => i.status === 'low').length,
    out: inventory.filter(i => i.status === 'out').length
  };

  const getStatusBadge = (status: string) => {
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
      render: (value: any, row: InventoryItem) => `${value} ${row.unit}`
    },
    {
      key: 'price',
      label: 'Preço',
      render: (value: any) => `R$ ${value.toFixed(2)}`
    },
    { key: 'location', label: 'Localização' },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => getStatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Ações',
      className: 'text-right',
      render: () => (
        <div className="flex gap-2 justify-end">
          <button className="text-blue-600 hover:text-blue-800">
            <Edit className="w-5 h-5" />
          </button>
          <button className="text-red-600 hover:text-red-800">
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
          <Button icon={Plus} onClick={() => {}}>
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
    </div>
  );
}
