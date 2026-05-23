import React from 'react';
import { OrderStatus } from '../types';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  status: OrderStatus;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const configs = {
    [OrderStatus.PENDING]: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      icon: Clock,
      label: 'Procesando'
    },
    [OrderStatus.INVENTORY_RESERVED]: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: Clock,
      label: 'Stock Reservado'
    },
    [OrderStatus.CONFIRMED]: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: CheckCircle2,
      label: 'Confirmado'
    },
    [OrderStatus.CANCELLED]: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: XCircle,
      label: 'Cancelado'
    },
    [OrderStatus.FAILED]: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: XCircle,
      label: 'Fallido'
    }
  };

  const config = configs[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: Clock,
    label: status || 'Desconocido'
  };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
