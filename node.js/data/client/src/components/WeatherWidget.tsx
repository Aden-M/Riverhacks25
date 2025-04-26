import { useTranslation } from 'react-i18next';

export interface WeatherData {
  location: string;
  temperature: number;
  unit: string;
  condition: string;
  icon: string;
}

interface WeatherWidgetProps {
  weather: WeatherData;
}

const WeatherWidget = ({ weather }: WeatherWidgetProps) => {
  const { t } = useTranslation();

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, string> = {
      'sun': 'fa-sun',
      'cloud': 'fa-cloud',
      'cloud-rain': 'fa-cloud-rain',
      'cloud-showers-heavy': 'fa-cloud-showers-heavy',
      'bolt': 'fa-bolt',
      'snowflake': 'fa-snowflake',
    };

    return iconMap[iconCode] || 'fa-sun';
  };

  return (
    <div className="bg-primary/20 rounded-lg px-3 py-2 flex items-center">
      <i className={`fas ${getWeatherIcon(weather.icon)} text-primary mr-2`}></i>
      <div>
        <p className="text-xs text-neutral-variant">{weather.location}</p>
        <p className="font-medium text-secondary">{weather.temperature}°{weather.unit}</p>
      </div>
    </div>
  );
};

export default WeatherWidget;
