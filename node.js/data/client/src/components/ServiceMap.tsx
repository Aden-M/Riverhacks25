import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Location } from './LocationSelector';
import { ServiceWithDetails } from '@shared/schema';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ServiceMapProps {
  services: ServiceWithDetails[];
  userLocation: Location;
  selectedCategories?: number[];
  onCategorySelect?: (categoryId: number) => void;
}

const ServiceMap = ({ 
  services, 
  userLocation, 
  selectedCategories = [], 
  onCategorySelect 
}: ServiceMapProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Initialize map if not already initialized
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [userLocation.latitude, userLocation.longitude], 
        12
      );
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
      
      // Add user location marker
      const userIcon = L.divIcon({
        html: `<div style="background-color: #0C8140; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white;"></div>`,
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      L.marker([userLocation.latitude, userLocation.longitude], {
        icon: userIcon
      })
        .addTo(mapInstanceRef.current)
        .bindPopup("Your Location")
        .openPopup();
    } else {
      // Update map center
      mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 12);
    }
    
    // Add service markers
    services.forEach(service => {
      // Skip if marker already exists
      if (markersRef.current[service.id]) return;
      
      const color = service.category?.color || "#3399CC";
      
      const icon = L.divIcon({
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      
      const marker = L.marker([service.latitude, service.longitude], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`<b>${service.name}</b>`);
      
      markersRef.current[service.id] = marker;
    });
    
    // Filter visible markers based on selected categories
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const serviceId = parseInt(id);
      const service = services.find(s => s.id === serviceId);
      
      if (!service) return;
      
      if (selectedCategories.length === 0 || selectedCategories.includes(service.categoryId)) {
        if (!mapInstanceRef.current?.hasLayer(marker)) {
          marker.addTo(mapInstanceRef.current!);
        }
      } else {
        mapInstanceRef.current?.removeLayer(marker);
      }
    });
    
    return () => {
      // Clean up map on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [services, userLocation, selectedCategories]);
  
  // Group services by category for category buttons
  const categoriesMap = services.reduce<Record<number, { id: number, name: string, icon: string, color: string }>>((acc, service) => {
    if (service.category && !acc[service.categoryId]) {
      acc[service.categoryId] = {
        id: service.categoryId,
        name: service.category.name,
        icon: service.category.icon,
        color: service.category.color
      };
    }
    return acc;
  }, {});
  
  const categories = Object.values(categoriesMap);
  
  const handleCategoryClick = (categoryId: number) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };
  
  return (
    <section className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-[#0C8140] font-public">
        {t('all_services_map')}
      </h2>
      
      <div ref={mapRef} className="h-[350px] w-full rounded-lg mb-4"></div>
      
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant="ghost"
            className={`flex flex-col items-center justify-center bg-gray-light hover:bg-gray p-2 rounded-md ${
              selectedCategories.includes(category.id) ? 'ring-2 ring-offset-1' : ''
            }`}
            style={{ 
              ringColor: category.color,
              ...(selectedCategories.includes(category.id) ? { backgroundColor: `${category.color}22` } : {})
            }}
            onClick={() => handleCategoryClick(category.id)}
          >
            <i 
              className={`fas fa-${category.icon} text-lg`}
              style={{ color: category.color }}
            ></i>
            <span className="text-xs mt-1">{t(category.name.split(' ')[0].toLowerCase())}</span>
          </Button>
        ))}
      </div>
    </section>
  );
};

export default ServiceMap;
