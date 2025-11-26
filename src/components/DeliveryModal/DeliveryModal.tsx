import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';

interface Delivery {
  id?: number;
  route_name: string;
  truck_id?: number | null;
  driver_name: string;
  departure_time: string;
  estimated_arrival: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  current_location?: string;
}

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (delivery: Delivery) => Promise<void>;
  delivery?: Delivery | null;
}

export function DeliveryModal({ isOpen, onClose, onSave, delivery }: DeliveryModalProps) {
  const [formData, setFormData] = useState<Delivery>({
    route_name: '',
    truck_id: null,
    driver_name: '',
    departure_time: '',
    estimated_arrival: '',
    status: 'pending',
    current_location: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (delivery) {
      setFormData(delivery);
    } else {
      setFormData({
        route_name: '',
        truck_id: null,
        driver_name: '',
        departure_time: '',
        estimated_arrival: '',
        status: 'pending',
        current_location: ''
      });
    }
  }, [delivery, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving delivery:', error);
      alert('Erro ao salvar entrega');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {delivery ? 'Editar Rota' : 'Nova Rota de Entrega'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Rota *
              </label>
              <input
                type="text"
                required
                value={formData.route_name}
                onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                placeholder="Ex: Rota Centro"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Motorista *
              </label>
              <input
                type="text"
                required
                value={formData.driver_name}
                onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Delivery['status'] })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Rota</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário de Partida
              </label>
              <input
                type="time"
                value={formData.departure_time}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Previsão de Chegada
              </label>
              <input
                type="time"
                value={formData.estimated_arrival}
                onChange={(e) => setFormData({ ...formData, estimated_arrival: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização Atual
              </label>
              <input
                type="text"
                value={formData.current_location}
                onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
                placeholder="Ex: Av. Ipiranga, 1200"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
