import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api.client';
import { Product } from '../types';

export const useCatalog = () => {
  return useQuery<Product[]>({
    queryKey: ['catalog'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/menu');
      return data;
    },
  });
};
