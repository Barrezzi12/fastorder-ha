import React from 'react';
import { ShoppingBag, LayoutDashboard, Utensils, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/catalog', label: 'Menú', icon: Utensils },
    { path: '/orders', label: 'Pedidos', icon: ClipboardList },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-orange-600 w-8 h-8" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">FastOrder HA</span>
          </div>
          
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'text-orange-600' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
