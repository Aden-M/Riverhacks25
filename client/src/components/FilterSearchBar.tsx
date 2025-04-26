import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { getCategoryColor } from '@/lib/utils';

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  subcategories?: string[];
}

interface FilterSearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (selectedCategories: Record<number, string[]>) => void;
}

const FilterSearchBar = ({ onSearch, onFilterChange }: FilterSearchBarProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<number, string[]>>({});

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Mock subcategories data
  const mockSubcategories: Record<string, string[]> = {
    "Food Assistance": ["Food Pantry", "Meal Service", "SNAP Assistance"],
    "Housing": ["Rental Assistance", "Utility Assistance", "Housing Counseling"],
    "Health": ["Health Screenings", "Immunizations", "MAP Enrollment"],
    "Childcare": ["After School Programs", "Summer Camps", "Early Childhood"],
    "Employment": ["Job Training", "Resume Help", "Career Counseling"],
    "Transportation": ["Bus Passes", "Mobility Assistance", "Ride Services"]
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSubcategoryChange = (categoryId: number, subcategory: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[categoryId]) {
        newFilters[categoryId] = [];
      }
      
      if (checked) {
        newFilters[categoryId] = [...newFilters[categoryId], subcategory];
      } else {
        newFilters[categoryId] = newFilters[categoryId].filter(sc => sc !== subcategory);
        
        // Remove category key if empty
        if (newFilters[categoryId].length === 0) {
          delete newFilters[categoryId];
        }
      }
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="search" className="block text-sm font-medium text-gray-dark mb-1">
              {t('search_services')}
            </label>
            <div className="relative">
              <Input
                type="text"
                id="search"
                className="w-full border border-gray-medium rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#3399CC]"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <i className="fas fa-search text-gray-dark absolute left-3 top-3"></i>
            </div>
          </form>
        </div>
        
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-dark mb-1">
            {t('filter_by_category')}
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Popover key={category.id}>
                <PopoverTrigger asChild>
                  <button className="border border-gray-medium bg-white hover:bg-gray-light px-3 py-1.5 rounded-full text-sm flex items-center">
                    <i 
                      className={`fas fa-${category.icon} mr-2`} 
                      style={{ color: category.color || getCategoryColor(category.name) }}
                    ></i>
                    {t(category.name.toLowerCase().replace(' ', '_'))}
                    <i className="fas fa-chevron-down ml-2 text-xs"></i>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2">
                  {/* Get subcategories based on category name */}
                  {mockSubcategories[category.name]?.map((subcategory, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <Checkbox 
                        id={`${category.name.toLowerCase()}-${index}`}
                        checked={selectedFilters[category.id]?.includes(subcategory)}
                        onCheckedChange={(checked) => 
                          handleSubcategoryChange(category.id, subcategory, checked === true)
                        }
                        className="mr-2"
                      />
                      <Label 
                        htmlFor={`${category.name.toLowerCase()}-${index}`}
                        className="text-sm"
                      >
                        {t(subcategory.toLowerCase().replace(' ', '_'))}
                      </Label>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSearchBar;
