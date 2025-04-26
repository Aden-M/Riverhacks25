import { useQuery } from '@tanstack/react-query';
import { Alert } from '@shared/schema';

export function useEmergencyAlerts() {
  return useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}
