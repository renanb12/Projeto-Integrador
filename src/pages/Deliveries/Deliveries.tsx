import React, { useState, useEffect } from 'react';
import { Plus, Truck, MapPin, Clock, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { StatCard } from '../../components/common/StatCard';
import { DeliveryModal } from '../../components/DeliveryModal/DeliveryModal';
import api from '../../services/api';

interface Delivery {
  id: number;
  route_name: string;
  driver_name: string;
  vehicle: string;
  stops: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  departure_time: string;
  estimated_arrival: string;
  current_location?: string;
}

export function Deliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/deliveries');
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (deliveryData: any) => {
    try {
      if (selectedDelivery) {
        await api.put(`/deliveries/${selectedDelivery.id}`, deliveryData);
      } else {
        await api.post('/deliveries', deliveryData);
      }
      await loadDeliveries();
      setIsModalOpen(false);
      setSelectedDelivery(null);
    } catch (error: any) {
      console.error('Error saving delivery:', error);
      throw new Error(error.response?.data?.message || 'Erro ao salvar entrega');
    }
  };

  const handleEdit = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta rota?')) {
      try {
        await api.delete(`/deliveries/${id}`);
        await loadDeliveries();
      } catch (error) {
        console.error('Error deleting delivery:', error);
        alert('Erro ao excluir rota');
      }
    }
  };

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (delivery.vehicle && delivery.vehicle.includes(searchTerm))
  );

  const stats = {
    pending: deliveries.filter(d => d.status === 'pending').length,
    in_progress: deliveries.filter(d => d.status === 'in_progress').length,
    completed: deliveries.filter(d => d.status === 'completed').length,
    total_stops: deliveries.reduce((acc, d) => acc + (d.stops || 0), 0)
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">Pendente</span>,
      in_progress: <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Em Rota</span>,
      completed: <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Concluída</span>,
      cancelled: <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Cancelada</span>
    };
    return badges[status as keyof typeof badges];
  };

  const columns = [
    { key: 'route_name', label: 'Rota' },
    { key: 'driver_name', label: 'Motorista' },
    {
      key: 'vehicle',
      label: 'Veículo',
      render: (value: any) => value || '-'
    },
    {
      key: 'stops',
      label: 'Paradas',
      render: (value: any) => value || 0
    },
    {
      key: 'departure_time',
      label: 'Horários',
      render: (value: any, row: Delivery) => (
        <div className="text-sm">
          <div>{value || '-'}</div>
          {row.estimated_arrival && (
            <div className="text-gray-500 text-xs">Est: {row.estimated_arrival}</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => getStatusBadge(value)
    },
    {
      key: 'current_location',
      label: 'Localização',
      render: (value: any) => value || '-'
    },
    {
      key: 'actions',
      label: 'Ações',
      className: 'text-right',
      render: (_: any, row: Delivery) => (
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
        title="Entregas"
        subtitle={`${deliveries.length} rotas de entrega`}
        action={
          <Button icon={Plus} onClick={() => {
            setSelectedDelivery(null);
            setIsModalOpen(true);
          }}>
            Nova Rota
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Pendentes" value={stats.pending} icon={Clock} color="orange" />
        <StatCard title="Em Rota" value={stats.in_progress} icon={Truck} color="blue" />
        <StatCard title="Concluídas" value={stats.completed} color="green" />
        <StatCard title="Total de Paradas" value={stats.total_stops} icon={MapPin} color="blue" />
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por rota, motorista ou veículo"
        />
      </div>

      <Table
        columns={columns}
        data={filteredDeliveries}
        loading={loading}
        emptyMessage="Nenhuma entrega encontrada"
      />

      <DeliveryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDelivery(null);
        }}
        onSave={handleSave}
        delivery={selectedDelivery}
      />
    </div>
  );
}
