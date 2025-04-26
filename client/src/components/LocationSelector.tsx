import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationSelectorProps {
  userLocation: Location;
  onLocationChange: (location: Location) => void;
}

const LocationSelector = ({ userLocation, onLocationChange }: LocationSelectorProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { getCurrentPosition } = useGeolocation();
  const [address, setAddress] = useState(userLocation.address);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!miniMapRef.current) return;

    // Initialize the map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(miniMapRef.current).setView(
        [userLocation.latitude, userLocation.longitude], 
        14
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Create marker for user location
      const icon = L.divIcon({
        html: `<div style="background-color: #0C8140; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      markerRef.current = L.marker(
        [userLocation.latitude, userLocation.longitude],
        { icon }
      ).addTo(mapInstanceRef.current);
    } else {
      // Update marker position
      mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 14);
      if (markerRef.current) {
        markerRef.current.setLatLng([userLocation.latitude, userLocation.longitude]);
      }
    }

    return () => {
      // Clean up map on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation]);

  useEffect(() => {
    setAddress(userLocation.address);
  }, [userLocation.address]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    // In a real app, you would use a geocoding service to convert the address to coordinates
    // For now, we'll just update the address in the user location
    onLocationChange({
      ...userLocation,
      address
    });

    toast({
      title: "Location updated",
      description: `Address set to: ${address}`,
    });
  };

  const handleDetectLocation = async () => {
    try {
      const position = await getCurrentPosition();
      
      // In a real app, you would use reverse geocoding to get the address from coordinates
      // For now, we'll just set a placeholder address
      const newLocation: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: "Current Location",
      };
      
      onLocationChange(newLocation);
      
      toast({
        title: "Location detected",
        description: "Using your current location",
      });
    } catch (error) {
      toast({
        title: "Error detecting location",
        description: "Please enable location services or enter your address manually",
        variant: "destructive",
      });
    }
  };

  const handleOpenMapPicker = () => {
    // In a real app, this would open a modal with a larger map for selection
    toast({
      title: "Map picker",
      description: "This feature would open a map for location selection",
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="w-full">
          <form onSubmit={handleAddressSubmit} className="flex items-center">
            <div className="relative flex-grow">
              <Input
                type="text"
                id="location"
                className="w-full border border-neutral rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('enter_address')}
                value={address}
                onChange={handleAddressChange}
              />
              <i className="fas fa-map-marker-alt text-primary absolute left-3 top-3"></i>
            </div>
            <Button 
              type="submit"
              className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t('go')}
            </Button>
          </form>
        </div>
      </div>
      
      <div className="flex mt-3 gap-3">
        <Button
          onClick={handleDetectLocation}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          size="sm"
        >
          <i className="fas fa-location-arrow mr-2"></i> {t('use_current_location')}
        </Button>
        <Button
          onClick={handleOpenMapPicker}
          variant="outline"
          className="border border-secondary text-secondary"
          size="sm"
        >
          <i className="fas fa-map mr-2"></i> {t('pick_on_map')}
        </Button>
      </div>
    </div>
  );
};

export default LocationSelector;
