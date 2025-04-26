import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceWithDetails } from '@shared/schema';
import { formatTime, getCurrentStatus, getStatusColor, getStatusText } from '@/lib/utils';

interface ServiceCardProps {
  service: ServiceWithDetails;
  distance: number;
}

const ServiceCard = ({ service, distance }: ServiceCardProps) => {
  const { t } = useTranslation();
  
  const { status, closingTime } = getCurrentStatus(service.hours || "");
  
  const getOfferingsToDisplay = () => {
    if (!service.offerings || service.offerings.length === 0) {
      return [];
    }
    
    // Show first 3 offerings, indicate if there are more
    const displayOfferings = service.offerings.slice(0, 3);
    return displayOfferings;
  };
  
  const hasMoreOfferings = service.offerings && service.offerings.length > 3;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex">
        {/* Category Icon */}
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4"
          style={{ backgroundColor: `${service.category?.color || "#F2C94C"}22` }}
        >
          <i 
            className={`fas fa-${service.category?.icon || "building"} text-lg`}
            style={{ color: service.category?.color || "#F2C94C" }}
          ></i>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-card-foreground">{service.name}</h3>
            <span className="text-xs text-neutral">{distance.toFixed(1)} mi</span>
          </div>
          
          <p className="text-sm text-neutral-variant mb-2">{service.address}</p>
          
          <div className="flex items-center mb-2">
            <Badge 
              variant="outline"
              className="text-xs rounded-full px-2 py-0.5 mr-2 text-primary-foreground"
              style={{ 
                backgroundColor: getStatusColor(status)
              }}
            >
              {t(getStatusText(status).toLowerCase())}
            </Badge>
            {closingTime && (
              <span className="text-xs text-neutral-variant">
                {status === 'closing_soon' ? t('at') : t('until')} {formatTime(closingTime)}
              </span>
            )}
          </div>
          
          {/* Services offered - compact view */}
          <div className="flex flex-wrap gap-1 mb-2">
            {getOfferingsToDisplay().slice(0, 2).map((offering, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="bg-accent/20 text-accent-foreground text-xs px-2 py-0.5 rounded-full"
              >
                {offering.name}
              </Badge>
            ))}
            {service.offerings && service.offerings.length > 2 && (
              <Badge 
                variant="secondary"
                className="bg-accent/20 text-accent-foreground text-xs px-2 py-0.5 rounded-full"
              >
                +{service.offerings.length - 2} {t('more')}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between">
            <Link href={`/service/${service.id}`}>
              <Button 
                variant="link" 
                className="p-0 text-primary text-sm font-medium"
                size="sm"
              >
                <i className="fas fa-info-circle mr-1"></i> {t('more_details')}
              </Button>
            </Link>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="link"
                className="p-0 text-secondary text-sm font-medium"
                size="sm"
              >
                <i className="fas fa-directions mr-1"></i> {t('directions')}
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
