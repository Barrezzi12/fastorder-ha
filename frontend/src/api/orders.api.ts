import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api.client';
import { Order, OrderRequest } from '../types';

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/orders');
      return data;
    },
    refetchInterval: 3000, // Pooling cada 3s para ver cambios de estado asíncronos
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: OrderRequest) => {
      const { data } = await apiClient.post('/api/orders', order);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
