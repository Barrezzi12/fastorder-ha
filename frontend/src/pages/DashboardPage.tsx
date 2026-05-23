import React from 'react';
import { useOrders } from '../api/orders.api';
import { useCatalog } from '../api/menu.api';
import { OrderStatus } from '../types';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { data: orders } = useOrders();
  const { data: products } = useCatalog();

  const stats = [
    { 
      label: 'Confirmados', 
      val: orders?.filter(o => o.status === OrderStatus.CONFIRMED).length || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      label: 'Pendientes', 
      val: orders?.filter(o => o.status === OrderStatus.PENDING).length || 0,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    { 
      label: 'Cancelados', 
      val: orders?.filter(o => o.status === OrderStatus.CANCELLED).length || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    { 
      label: 'Catálogo', 
      val: products?.length || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Panel</h1>
          <p className="text-gray-500 mt-2">Resumen de operaciones en tiempo real.</p>
        </div>
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-100">
          <Activity className="w-3 h-3 animate-pulse" />
          Sistema Online
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">¿Tienes Hambre?</h2>
            <p className="text-orange-100 mb-6 max-w-xs opacity-90">Explora nuestro menú interactivo y realiza tu pedido con confirmación inmediata.</p>
            <Link to="/catalog" className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors">
              Ir al Menú <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Activity className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Última Actividad</h2>
          <div className="flex-1 space-y-4">
             {orders?.slice(0, 3).map(order => (
               <div key={order.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-sm font-medium text-gray-700">Pedido #{order.externalId?.substring(0,6) || 'N/A'}</span>
                  </div>
                  <StatusBadge status={order.status} />
               </div>
             ))}
             {(!orders || orders.length === 0) && <p className="text-gray-400 text-sm">Esperando el primer pedido...</p>}
          </div>
          <Link to="/orders" className="mt-6 text-sm font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1">
            Ver todo el historial <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
