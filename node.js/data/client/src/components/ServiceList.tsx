import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ServiceCard from './ServiceCard';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Location } from './LocationSelector';
import { calculateDistance } from '@/lib/utils';
import { ServiceWithDetails } from '@shared/schema';

interface ServiceListProps {
  services: ServiceWithDetails[];
  userLocation: Location;
  isLoading?: boolean;
}

type SortOption = 'distance' | 'alphabetical' | 'rating';

const ServiceList = ({ services, userLocation, isLoading }: ServiceListProps) => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [showAll, setShowAll] = useState(false);

  // Calculate distance for each service from user location
  const servicesWithDistance = services.map(service => ({
    ...service,
    distance: calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      service.latitude,
      service.longitude
    )
  }));

  // Sort services based on selected option
  const sortedServices = [...servicesWithDistance].sort((a, b) => {
    if (sortBy === 'distance') {
      return a.distance - b.distance;
    } else if (sortBy === 'alphabetical') {
      return a.name.localeCompare(b.name);
    } else {
      // In a real app, you might sort by rating
      return 0;
    }
  });

  // Display only first few services if not showing all
  const displayedServices = showAll ? sortedServices : sortedServices.slice(0, 6);

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#0C8140] font-public">
          {t('services_near_you')}
        </h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-dark mr-2">{t('sort_by')}</span>
          <Select defaultValue={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="border border-gray-medium rounded-md px-2 py-1 text-sm w-32">
              <SelectValue placeholder={t('distance')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">{t('distance')}</SelectItem>
              <SelectItem value="alphabetical">{t('alphabetical')}</SelectItem>
              <SelectItem value="rating">{t('rating')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md h-40 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                distance={service.distance}
              />
            ))}
          </div>
          
          {!showAll && sortedServices.length > 4 && (
            <div className="flex justify-center mt-6">
              <Button 
                onClick={() => setShowAll(true)}
                className="bg-[#0C8140] text-white hover:bg-[#0C8140]/90"
              >
                {t('view_all_services')}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ServiceList;
