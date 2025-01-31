import React, { useState } from 'react';
import { LogOut, Settings, ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserSettings } from './UserSettings';

export function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
        <span className="text-gray-700">{user.name || 'Usuário sem nome'}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <button
            onClick={() => {
              setIsSettingsOpen(true);
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      )}

      {isSettingsOpen && (
        <UserSettings onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
}