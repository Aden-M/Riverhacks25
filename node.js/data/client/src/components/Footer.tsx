import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#333333] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 font-public text-primary">{t('about')}</h3>
            <p className="text-sm text-neutral mb-4">{t('about_text')}</p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" aria-label="Facebook" className="text-neutral hover:text-primary">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link href="https://twitter.com" target="_blank" aria-label="Twitter" className="text-neutral hover:text-primary">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link href="https://instagram.com" target="_blank" aria-label="Instagram" className="text-neutral hover:text-primary">
                <i className="fab fa-instagram"></i>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 font-public text-primary">{t('quick_links')}</h3>
            <ul className="text-sm space-y-2">
              <li><Link href="/" className="text-neutral hover:text-primary">{t('all_services')}</Link></li>
              <li><Link href="/events" className="text-neutral hover:text-primary">{t('events_calendar')}</Link></li>
              <li><Link href="/centers" className="text-neutral hover:text-primary">{t('neighborhood_centers')}</Link></li>
              <li><Link href="/emergency" className="text-neutral hover:text-primary">{t('emergency_resources')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 font-public text-primary">{t('service_categories')}</h3>
            <ul className="text-sm space-y-2">
              <li><Link href="/?category=1" className="text-neutral hover:text-primary">{t('food_assistance')}</Link></li>
              <li><Link href="/?category=2" className="text-neutral hover:text-primary">{t('housing')}</Link></li>
              <li><Link href="/?category=3" className="text-neutral hover:text-primary">{t('health')}</Link></li>
              <li><Link href="/?category=5" className="text-neutral hover:text-primary">{t('employment')}</Link></li>
              <li><Link href="/?category=4" className="text-neutral hover:text-primary">{t('childcare')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 font-public text-primary">{t('contact')}</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2 text-secondary"></i>
                <a href="tel:311" className="text-neutral hover:text-primary">Call 311</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2 text-secondary"></i>
                <a href="mailto:info@austintexas.gov" className="text-neutral hover:text-primary">
                  info@austintexas.gov
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2 text-secondary"></i>
                <span className="text-neutral">City Hall, 301 W 2nd St, Austin, TX 78701</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-variant/30 mt-6 pt-6 text-center text-sm text-neutral">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
