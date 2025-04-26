import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import EmergencyAlert from '@/components/EmergencyAlert';
import LocationSelector, { Location } from '@/components/LocationSelector';
import FilterSearchBar from '@/components/FilterSearchBar';
import ServiceList from '@/components/ServiceList';
import EventsCalendar from '@/components/EventsCalendar';
import ServiceMap from '@/components/ServiceMap';
import Footer from '@/components/Footer';
import { ServiceWithDetails } from '@shared/schema';

const Home = () => {
  const { t } = useTranslation();
  
  // Default location (Austin City Hall)
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 30.2672,
    longitude: -97.7431,
    address: "1000 E 11th St, Austin, TX 78702"
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<number, string[]>>({});
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedMapCategories, setSelectedMapCategories] = useState<number[]>([]);
  
  // Restore saved location from localStorage if available
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setUserLocation(JSON.parse(savedLocation));
      } catch (error) {
        console.error('Failed to parse saved location', error);
      }
    }
  }, []);
  
  // Fetch services data
  const { data: services = [], isLoading: servicesLoading } = useQuery<ServiceWithDetails[]>({
    queryKey: ['/api/services/nearby', userLocation.latitude, userLocation.longitude],
  });
  
  // Handle location change
  const handleLocationChange = (newLocation: Location) => {
    setUserLocation(newLocation);
    // Save to localStorage
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle filter change
  const handleFilterChange = (filters: Record<number, string[]>) => {
    setSelectedFilters(filters);
  };
  
  // Handle category selection on map
  const handleMapCategorySelect = (categoryId: number) => {
    setSelectedMapCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  // Filter services based on search and category filters
  const filteredServices = services.filter(service => {
    // Filter by search query
    if (searchQuery && !service.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by selected categories/subcategories
    if (Object.keys(selectedFilters).length > 0) {
      // If category is selected, check if service matches category
      const categoryIds = Object.keys(selectedFilters).map(Number);
      if (!categoryIds.includes(service.categoryId)) {
        return false;
      }
      
      // If category has selected subcategories, check if service has any of those offerings
      const selectedSubcategories = selectedFilters[service.categoryId];
      if (selectedSubcategories && selectedSubcategories.length > 0) {
        // Check if service has any of the selected offerings
        const hasSelectedOffering = service.offerings?.some(offering => 
          selectedSubcategories.includes(offering.name)
        );
        
        if (!hasSelectedOffering) {
          return false;
        }
      }
    }
    
    return true;
  });
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-light">
      <EmergencyAlert />
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Location Selector with Language Toggle */}
        <div className="bg-card rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary font-public">
              {t('your_location')}
            </h2>
            <div className="flex items-center">
              {/* Language toggle in the location section as per wireframe */}
              <div className="ml-auto">
                <select 
                  className="bg-card border border-neutral rounded px-2 py-1 text-sm text-card-foreground"
                  onChange={(e) => {
                    // Handle language change
                    import('i18next').then(i18nextModule => {
                      const i18next = i18nextModule.default;
                      i18next.changeLanguage(e.target.value);
                      localStorage.setItem('language', e.target.value);
                    });
                  }}
                  defaultValue={localStorage.getItem('language') || 'en'}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>
          <LocationSelector 
            userLocation={userLocation} 
            onLocationChange={handleLocationChange} 
          />
        </div>
        
        {/* Main Content Area - Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Services/Search */}
          <div className="w-full md:w-3/5">
            {/* Filter and Search Bar */}
            <FilterSearchBar 
              onSearch={handleSearch} 
              onFilterChange={handleFilterChange} 
            />
            
            {/* View Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-card rounded-full shadow-md inline-flex">
                <button 
                  className={`px-6 py-2 rounded-l-full ${
                    viewMode === 'list' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-primary'
                  }`}
                  onClick={() => setViewMode('list')}
                >
                  {t('list_view')}
                </button>
                <button 
                  className={`px-6 py-2 rounded-r-full ${
                    viewMode === 'map' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-primary'
                  }`}
                  onClick={() => setViewMode('map')}
                >
                  {t('map_view')}
                </button>
              </div>
            </div>
            
            {/* Service List or Map View */}
            {viewMode === 'list' ? (
              <ServiceList 
                services={filteredServices} 
                userLocation={userLocation} 
                isLoading={servicesLoading} 
              />
            ) : (
              <ServiceMap 
                services={services} 
                userLocation={userLocation} 
                selectedCategories={selectedMapCategories}
                onCategorySelect={handleMapCategorySelect}
              />
            )}
          </div>
          
          {/* Right Column - Calendar/Form */}
          <div className="w-full md:w-2/5">
            {/* Events Calendar */}
            <EventsCalendar />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
