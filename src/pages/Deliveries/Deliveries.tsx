import React, { useState, useEffect } from 'react';
import { Plus, Truck, MapPin, Clock } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { StatCard } from '../../components/common/StatCard';

interface Delivery {
  id: string;
  route_name: string;
  driver: string;
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

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setDeliveries([
        {
          id: '1',
          route_name: 'Rota Centro',
          driver: 'Carlos Silva',
          vehicle: 'ABC-1234',
          stops: 8,
          status: 'in_progress',
          departure_time: '08:00',
          estimated_arrival: '14:00',
          current_location: 'Av. Ipiranga, 1200'
        },
        {
          id: '2',
          route_name: 'Rota Zona Sul',
          driver: 'João Santos',
          vehicle: 'XYZ-5678',
          stops: 12,
          status: 'pending',
          departure_time: '09:00',
          estimated_arrival: '16:00'
        },
        {
          id: '3',
          route_name: 'Rota Norte',
          driver: 'Pedro Lima',
          vehicle: 'DEF-9012',
          stops: 6,
          status: 'completed',
          departure_time: '07:00',
          estimated_arrival: '12:00'
        }
      ]);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.vehicle.includes(searchTerm)
  );

  const stats = {
    pending: deliveries.filter(d => d.status === 'pending').length,
    in_progress: deliveries.filter(d => d.status === 'in_progress').length,
    completed: deliveries.filter(d => d.status === 'completed').length,
    total_stops: deliveries.reduce((acc, d) => acc + d.stops, 0)
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
    { key: 'driver', label: 'Motorista' },
    { key: 'vehicle', label: 'Veículo' },
    { key: 'stops', label: 'Paradas' },
    {
      key: 'departure_time',
      label: 'Partida',
      render: (value: any, row: Delivery) => (
        <div className="text-sm">
          <div>{value}</div>
          <div className="text-gray-500 text-xs">Est: {row.estimated_arrival}</div>
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
      label: 'Localização Atual',
      render: (value: any) => value || '-'
    }
  ];

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Entregas"
        subtitle={`${deliveries.length} rotas de entrega`}
        action={
          <Button icon={Plus} onClick={() => {}}>
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
    </div>
  );
}
