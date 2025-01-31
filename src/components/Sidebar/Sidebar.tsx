import React from 'react';
import { Package, ArrowDownToLine, ArrowUpFromLine, History, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
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
            <li>
              <Link
                to="/"
                onClick={onClose}
                className={`flex items-center gap-3 p-2 rounded ${
                  location.pathname === '/' ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Produtos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/entries"
                onClick={onClose}
                className={`flex items-center gap-3 p-2 rounded ${
                  location.pathname === '/entries' ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <ArrowDownToLine className="w-5 h-5" />
                <span>Entradas</span>
              </Link>
            </li>
            <li>
              <Link
                to="/exits"
                onClick={onClose}
                className={`flex items-center gap-3 p-2 rounded ${
                  location.pathname === '/exits' ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <ArrowUpFromLine className="w-5 h-5" />
                <span>Saídas</span>
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                onClick={onClose}
                className={`flex items-center gap-3 p-2 rounded ${
                  location.pathname === '/history' ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <History className="w-5 h-5" />
                <span>Histórico</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}