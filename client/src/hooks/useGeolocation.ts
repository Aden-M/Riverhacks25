import { useState } from 'react';

interface GeolocationHook {
  getCurrentPosition: () => Promise<GeolocationPosition>;
  isLoading: boolean;
  error: GeolocationPositionError | null;
}

export function useGeolocation(): GeolocationHook {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        const customError = new Error('Geolocation is not supported by your browser') as GeolocationPositionError;
        setError(customError);
        setIsLoading(false);
        reject(customError);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false);
          resolve(position);
        },
        (error) => {
          setIsLoading(false);
          setError(error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  return {
    getCurrentPosition,
    isLoading,
    error
  };
}
