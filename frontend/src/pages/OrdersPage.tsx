import React from 'react';
import { useOrders } from '../api/orders.api';
import { StatusBadge } from '../components/StatusBadge';
import { Loader2, Package, Calendar } from 'lucide-react';

export const OrdersPage = () => {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-orange-600" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Historial de Pedidos</h1>
        <p className="text-gray-500 mt-2">Seguimiento en tiempo real de tus solicitudes.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orden</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders?.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{order.externalId?.substring(0, 8) || 'N/A'}...</div>
                      <div className="text-xs text-gray-400 font-mono">IDP: {order.clientOrderId?.substring(0, 8) || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 opacity-50" />
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-0.5 font-bold text-gray-900">
                    <span className="text-gray-400 mr-0.5">Q</span>
                    {(order.total || 0).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders?.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            No hay pedidos registrados aún.
          </div>
        )}
      </div>
    </div>
  );
};
