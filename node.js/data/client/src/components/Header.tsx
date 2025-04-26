import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import WeatherWidget from './WeatherWidget';
import { useWeather } from '@/hooks/useWeather';
import { Link } from 'wouter';

const Header = () => {
  const { t } = useTranslation();
  const { data: weather } = useWeather();

  return (
    <header className="sticky top-0 z-50 bg-card shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <Link href="/">
          <div className="flex items-center mb-3 md:mb-0 cursor-pointer">
            <img 
              src="https://www.austintexas.gov/sites/default/files/austin_seal_preferred.png" 
              alt="City of Austin Seal" 
              className="h-12 md:h-14 mr-3" 
            />
            <div>
              <h1 className="text-primary text-xl md:text-2xl font-bold font-public">
                {t('app_title')}
              </h1>
              <p className="text-sm text-neutral-variant">{t('app_subtitle')}</p>
            </div>
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Weather Widget */}
          {weather && <WeatherWidget weather={weather} />}
          
          {/* Language Toggle - hiding here as it's in location section now */}
        </div>
      </div>
    </header>
  );
};

export default Header;
