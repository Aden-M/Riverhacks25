import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="border border-gray-medium rounded-md">
      <button 
        onClick={() => setLanguage('en')} 
        className={`px-3 py-1 rounded-l-md ${
          language === 'en' 
            ? 'bg-[#0C8140] text-white' 
            : 'bg-white text-[#0C8140]'
        }`}
      >
        {t('english')}
      </button>
      <button 
        onClick={() => setLanguage('es')} 
        className={`px-3 py-1 rounded-r-md ${
          language === 'es' 
            ? 'bg-[#0C8140] text-white' 
            : 'bg-white text-[#0C8140]'
        }`}
      >
        {t('spanish')}
      </button>
    </div>
  );
};

export default LanguageToggle;
