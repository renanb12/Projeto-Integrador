import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  status: 'active' | 'inactive';
  last_login: string;
  created_at: string;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setUsers([
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          last_login: '2024-01-30 14:32',
          created_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'Manager User',
          email: 'manager@example.com',
          role: 'manager',
          status: 'active',
          last_login: '2024-01-29 10:15',
          created_at: '2024-01-05'
        },
        {
          id: '3',
          name: 'Operator User',
          email: 'operator@example.com',
          role: 'operator',
          status: 'active',
          last_login: '2024-01-30 09:00',
          created_at: '2024-01-10'
        }
      ]);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded flex items-center gap-1">
        <Shield className="w-3 h-3" /> Admin
      </span>,
      manager: <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Gerente</span>,
      operator: <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Operador</span>
    };
    return badges[role as keyof typeof badges];
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Ativo</span>,
      inactive: <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Inativo</span>
    };
    return badges[status as keyof typeof badges];
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Perfil',
      render: (value: any) => getRoleBadge(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => getStatusBadge(value)
    },
    {
      key: 'last_login',
      label: 'Último Acesso',
      render: (value: any) => new Date(value).toLocaleString('pt-BR')
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
        title="Usuários"
        subtitle={`${users.length} usuários cadastrados`}
        action={
          <Button icon={Plus} onClick={() => {}}>
            Novo Usuário
          </Button>
        }
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nome ou email"
        />
      </div>

      <Table
        columns={columns}
        data={filteredUsers}
        loading={loading}
        emptyMessage="Nenhum usuário encontrado"
      />
    </div>
  );
}
