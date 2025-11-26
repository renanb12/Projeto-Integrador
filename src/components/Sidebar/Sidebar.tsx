import React from 'react';
import { Home, Package, ArrowDownToLine, ArrowUpFromLine, Users, Truck, UserCog, Settings, History, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/entries', icon: ArrowDownToLine, label: 'Entradas' },
    { path: '/exits', icon: ArrowUpFromLine, label: 'Saídas' },
    { path: '/customers', icon: Users, label: 'Clientes' },
    { path: '/inventory', icon: Package, label: 'Estoque' },
    { path: '/deliveries', icon: Truck, label: 'Entregas' },
    { path: '/users', icon: UserCog, label: 'Usuários' },
    { path: '/history', icon: History, label: 'Histórico' },
    { path: '/settings', icon: Settings, label: 'Configurações' }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <nav className={`
        fixed md:sticky top-0 h-full w-64 bg-gray-900 text-white p-4
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:transform-none transition-transform duration-200 ease-in-out
        z-30 overflow-y-auto flex-shrink-0
      `}>
        <div className="flex justify-between items-center md:hidden mb-6">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div>
          <h2 className="text-xs uppercase text-gray-400 mb-4">Navegação</h2>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 p-2 rounded transition-colors ${
                    location.pathname === item.path ? 'bg-gray-800' : 'hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}