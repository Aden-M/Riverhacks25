import { useQuery } from '@tanstack/react-query';
import { WeatherData } from '@/components/WeatherWidget';

export function useWeather() {
  return useQuery<WeatherData>({
    queryKey: ['/api/weather'],
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
