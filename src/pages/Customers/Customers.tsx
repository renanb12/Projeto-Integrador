import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';

interface Customer {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  created_at: string;
}

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setCustomers([
        {
          id: '1',
          name: 'João Silva',
          document: '123.456.789-00',
          email: 'joao@example.com',
          phone: '(51) 99999-9999',
          address: 'Rua A, 123',
          city: 'Porto Alegre',
          state: 'RS',
          created_at: '2024-01-15'
        },
        {
          id: '2',
          name: 'Maria Santos',
          document: '987.654.321-00',
          email: 'maria@example.com',
          phone: '(51) 98888-8888',
          address: 'Av. B, 456',
          city: 'Canoas',
          state: 'RS',
          created_at: '2024-02-10'
        }
      ]);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.document.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'document', label: 'CPF/CNPJ' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Telefone' },
    {
      key: 'address',
      label: 'Localização',
      render: (_: any, row: Customer) => `${row.city}, ${row.state}`
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
        title="Clientes"
        subtitle={`${customers.length} clientes cadastrados`}
        action={
          <Button icon={Plus} onClick={() => {}}>
            Novo Cliente
          </Button>
        }
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nome, CPF/CNPJ ou email"
        />
      </div>

      <Table
        columns={columns}
        data={filteredCustomers}
        loading={loading}
        emptyMessage="Nenhum cliente encontrado"
      />
    </div>
  );
}
