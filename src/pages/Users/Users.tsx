import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { UserModal } from '../../components/UserModal/UserModal';
import api from '../../services/api';

interface User {
  id: number;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (userData: any) => {
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, userData);
      } else {
        await api.post('/users', userData);
      }
      await loadUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Error saving user:', error);
      throw new Error(error.response?.data?.message || 'Erro ao salvar usuário');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${id}`);
        await loadUsers();
      } catch (error: any) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.message || 'Erro ao excluir usuário');
      }
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
      render: (value: any) => value ? new Date(value).toLocaleString('pt-BR') : 'Nunca'
    },
    {
      key: 'actions',
      label: 'Ações',
      className: 'text-right',
      render: (_: any, row: User) => (
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
        title="Usuários"
        subtitle={`${users.length} usuários cadastrados`}
        action={
          <Button icon={Plus} onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}>
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

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSave}
        user={selectedUser}
      />
    </div>
  );
}
