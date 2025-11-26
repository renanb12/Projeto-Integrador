import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { CustomerModal } from '../../components/CustomerModal/CustomerModal';
import { fetchCustomers, deleteCustomer, createCustomer, updateCustomer, Customer } from '../../services/customerService';

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (customerData: any) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id.toString(), customerData);
      } else {
        await createCustomer(customerData);
      }
      await loadCustomers();
      setIsModalOpen(false);
      setSelectedCustomer(null);
    } catch (error: any) {
      console.error('Error saving customer:', error);
      throw new Error(error.response?.data?.message || 'Erro ao salvar cliente');
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCustomer(id);
        setCustomers(customers.filter(c => c.id.toString() !== id));
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Erro ao excluir cliente');
      }
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
      render: (_: any, row: Customer) => (
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
              handleDelete(row.id.toString());
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
        title="Clientes"
        subtitle={`${customers.length} clientes cadastrados`}
        action={
          <Button icon={Plus} onClick={() => {
            setSelectedCustomer(null);
            setIsModalOpen(true);
          }}>
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

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSave={handleSave}
        customer={selectedCustomer}
      />
    </div>
  );
}
