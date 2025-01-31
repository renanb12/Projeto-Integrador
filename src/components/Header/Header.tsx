import React from 'react';
import { Menu } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center h-16">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-gray-600 hover:text-gray-900"
        >
          <Menu className="w-6 h-6" />
        </button>
        <img src="/logo.svg" alt="3D Manager" className="h-8" />
        <h1 className="text-xl md:text-2xl font-bold">3D Manager</h1>
      </div>
      <UserMenu />
    </header>
  );
}