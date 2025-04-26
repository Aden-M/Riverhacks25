import { useTranslation } from 'react-i18next';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ServiceWithDetails, Event, Parking } from '@shared/schema';
import Header from '@/components/Header';
import EmergencyAlert from '@/components/EmergencyAlert';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatTime, getCurrentStatus, getStatusColor, getStatusText } from '@/lib/utils';

const ServiceDetails = () => {
  const [, params] = useRoute<{ id: string }>('/service/:id');
  const { t } = useTranslation();
  
  const serviceId = params?.id ? parseInt(params.id) : -1;
  
  // Fetch service details
  const { data: service, isLoading: serviceLoading } = useQuery<ServiceWithDetails>({
    queryKey: [`/api/services/${serviceId}`],
    enabled: serviceId > 0,
  });
  
  // Fetch events for this service
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: [`/api/events/service/${serviceId}`],
    enabled: serviceId > 0,
  });
  
  // Fetch parking for this service
  const { data: parking = [] } = useQuery<Parking[]>({
    queryKey: [`/api/parking/service/${serviceId}`],
    enabled: serviceId > 0,
  });
  
  // Fetch nearby services
  const { data: nearbyServices = [] } = useQuery<ServiceWithDetails[]>({
    queryKey: ['/api/services/nearby', service?.latitude, service?.longitude, 2],
    enabled: Boolean(service?.latitude && service?.longitude),
  });
  
  // Filter out current service from nearby services
  const filteredNearbyServices = nearbyServices.filter(s => s.id !== serviceId).slice(0, 3);
  
  if (serviceLoading || !service) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-light">
        <EmergencyAlert />
        <Header />
        <main className="container mx-auto px-4 py-6 flex-grow">
          <div className="h-96 bg-white rounded-lg shadow-md animate-pulse"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const { status, closingTime } = getCurrentStatus(service.hours || "");
  
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-light">
      <EmergencyAlert />
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Back button */}
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="text-[#3399CC]">
              <i className="fas fa-arrow-left mr-2"></i> {t('back_to_results')}
            </Button>
          </Link>
        </div>
        
        {/* Service header */}
        <div 
          className="h-48 md:h-64 bg-cover bg-center rounded-t-lg relative" 
          style={{ backgroundImage: `url('${service.imageUrl}')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-lg flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold font-public mb-2">{service.name}</h1>
              <p className="text-sm md:text-base">{service.address}</p>
            </div>
          </div>
          <div 
            className="absolute top-4 right-4 text-white px-3 py-1 text-sm font-medium rounded-full"
            style={{ backgroundColor: service.category?.color || "#757575" }}
          >
            <i className={`fas fa-${service.category?.icon} mr-1`}></i> 
            {t(service.category?.name.toLowerCase().replace(' ', '_') || '')}
          </div>
        </div>
        
        {/* Service details */}
        <div className="bg-white rounded-b-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Badge 
                    variant="outline"
                    className="text-white text-xs rounded-full px-2 py-0.5 mr-2"
                    style={{ backgroundColor: getStatusColor(status) }}
                  >
                    {t(getStatusText(status).toLowerCase())}
                  </Badge>
                  {closingTime && (
                    <span className="text-sm text-gray-dark">
                      {status === 'closing_soon' ? t('at') : t('until')} {formatTime(closingTime)}
                    </span>
                  )}
                </div>
                
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#0C8140] text-white hover:bg-[#0C8140]/90">
                    <i className="fas fa-directions mr-2"></i> {t('get_directions')}
                  </Button>
                </a>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-[#0C8140] font-public">
                  {t('hours_of_operation')}
                </h2>
                <p className="text-gray-dark">{service.hours}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-[#0C8140] font-public">
                  {t('phone')}
                </h2>
                <p className="text-gray-dark">
                  <a href={`tel:${service.phone}`} className="text-[#3399CC]">
                    {service.phone}
                  </a>
                </p>
              </div>
              
              {service.description && (
                <div className="mb-6">
                  <p className="text-gray-dark">{service.description}</p>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-[#0C8140] font-public">
                  {t('available_services')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {service.offerings?.map((offering, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="bg-gray-light text-gray-dark py-1 px-3"
                    >
                      {offering.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {parking.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 text-[#0C8140] font-public">
                    {t('parking_information')}
                  </h2>
                  {parking.map((park, index) => (
                    <div key={index} className="bg-gray-light rounded-lg p-4 mb-3">
                      <h3 className="font-medium mb-2">{park.name}</h3>
                      <p className="text-sm text-gray-dark mb-1">{park.address}</p>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                          <span className="text-xs text-gray-dark">{t('parking_type')}:</span>
                          <p className="text-sm">{park.type}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-dark">{t('parking_hours')}:</span>
                          <p className="text-sm">{park.hours}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-dark">{t('parking_rate')}:</span>
                          <p className="text-sm">{park.rate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right column */}
            <div className="lg:w-1/3">
              <h2 className="text-xl font-semibold mb-3 text-[#0C8140] font-public">
                {t('upcoming_events_at', { service: service.name })}
              </h2>
              
              {sortedEvents.length > 0 ? (
                <div className="space-y-3">
                  {sortedEvents.map((event, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-medium rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-dark">
                            {event.startTime && `${formatTime(event.startTime)} - ${formatTime(event.endTime || '')}`}
                          </p>
                        </div>
                        <Badge 
                          className="ml-2"
                          style={{ 
                            backgroundColor: event.category?.color || "#3399CC",
                            color: "white" 
                          }}
                        >
                          {formatDate(event.date)}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-sm mt-2">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-dark py-4 border border-gray-medium rounded-lg">
                  {t('no_events')}
                </p>
              )}
              
              {filteredNearbyServices.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mt-6 mb-3 text-[#0C8140] font-public">
                    {t('nearby_services')}
                  </h2>
                  <div className="space-y-3">
                    {filteredNearbyServices.map((nearbyService) => (
                      <Link key={nearbyService.id} href={`/service/${nearbyService.id}`}>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${nearbyService.category?.color || "#3399CC"}22` }}
                              >
                                <i 
                                  className={`fas fa-${nearbyService.category?.icon || "building"} text-lg`}
                                  style={{ color: nearbyService.category?.color || "#3399CC" }}
                                ></i>
                              </div>
                              <div>
                                <h3 className="font-medium">{nearbyService.name}</h3>
                                <p className="text-xs text-gray-dark">{nearbyService.address}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetails;
