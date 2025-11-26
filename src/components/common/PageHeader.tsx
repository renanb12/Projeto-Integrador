import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
