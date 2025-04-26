import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Header
      "app_title": "Austin Community Services Finder",
      "app_subtitle": "Find resources near you",
      
      // Language toggle
      "english": "EN",
      "spanish": "ES",
      
      // Location selector
      "your_location": "Your Location",
      "enter_address": "Enter your address",
      "use_current_location": "Use Current Location",
      "pick_on_map": "Pick on Map",
      
      // Filter and search
      "search_services": "Search Services",
      "search_placeholder": "Search by name, keyword, or service...",
      "filter_by_category": "Filter by Category",
      
      // Service categories
      "food_assistance": "Food Assistance",
      "housing": "Housing",
      "health": "Health",
      "childcare": "Childcare",
      "employment": "Employment",
      "transportation": "Transportation",
      
      // Subcategories
      "food_pantry": "Food Pantry",
      "meal_service": "Meal Service",
      "snap_assistance": "SNAP Assistance",
      "rental_assistance": "Rental Assistance",
      "utility_assistance": "Utility Assistance",
      "housing_counseling": "Housing Counseling",
      "health_screenings": "Health Screenings",
      "immunizations": "Immunizations",
      "map_enrollment": "MAP Enrollment",
      
      // Services list
      "services_near_you": "Services Near You",
      "sort_by": "Sort by:",
      "distance": "Distance",
      "alphabetical": "Alphabetical",
      "rating": "Rating",
      "open_now": "Open Now",
      "closing_soon": "Closing Soon",
      "closed": "Closed",
      "until": "Until",
      "at": "at",
      "services_offered": "Services Offered:",
      "more_details": "More Details",
      "directions": "Directions",
      "view_all_services": "View All Services",
      
      // View toggles
      "list_view": "List View",
      "map_view": "Map View",
      
      // Events calendar
      "upcoming_events": "Upcoming Community Events",
      "month_view": "Month View",
      "list_view": "List View",
      "view_full_calendar": "View Full Calendar",
      
      // Days of week
      "sun": "Sun",
      "mon": "Mon",
      "tue": "Tue",
      "wed": "Wed",
      "thu": "Thu",
      "fri": "Fri",
      "sat": "Sat",
      
      // Map
      "all_services_map": "All Services Map",
      "food": "Food",
      "housing": "Housing",
      "health": "Health",
      "childcare": "Childcare",
      "jobs": "Jobs",
      "transport": "Transport",
      
      // Footer
      "about": "About",
      "about_text": "The Austin Community Services Finder helps residents locate nearby support services offered by the City of Austin and partners.",
      "quick_links": "Quick Links",
      "all_services": "All Services",
      "events_calendar": "Events Calendar",
      "neighborhood_centers": "Neighborhood Centers",
      "emergency_resources": "Emergency Resources",
      "service_categories": "Service Categories",
      "contact": "Contact",
      "copyright": "© 2023 City of Austin. All rights reserved.",
      
      // Service details page
      "back_to_results": "Back to Results",
      "get_directions": "Get Directions",
      "hours_of_operation": "Hours of Operation",
      "phone": "Phone",
      "available_services": "Available Services",
      "parking_information": "Parking Information",
      "parking_type": "Type",
      "parking_hours": "Hours",
      "parking_rate": "Rate",
      "upcoming_events_at": "Upcoming Events at {{service}}",
      "no_events": "No upcoming events at this location",
      "nearby_services": "Nearby Services"
    }
  },
  es: {
    translation: {
      // Header
      "app_title": "Buscador de Servicios Comunitarios de Austin",
      "app_subtitle": "Encuentra recursos cerca de ti",
      
      // Language toggle
      "english": "EN",
      "spanish": "ES",
      
      // Location selector
      "your_location": "Tu Ubicación",
      "enter_address": "Ingresa tu dirección",
      "use_current_location": "Usar Ubicación Actual",
      "pick_on_map": "Elegir en el Mapa",
      
      // Filter and search
      "search_services": "Buscar Servicios",
      "search_placeholder": "Buscar por nombre, palabra clave o servicio...",
      "filter_by_category": "Filtrar por Categoría",
      
      // Service categories
      "food_assistance": "Asistencia Alimentaria",
      "housing": "Vivienda",
      "health": "Salud",
      "childcare": "Cuidado Infantil",
      "employment": "Empleo",
      "transportation": "Transporte",
      
      // Subcategories
      "food_pantry": "Banco de Alimentos",
      "meal_service": "Servicio de Comidas",
      "snap_assistance": "Asistencia SNAP",
      "rental_assistance": "Asistencia de Alquiler",
      "utility_assistance": "Asistencia de Servicios Públicos",
      "housing_counseling": "Asesoramiento de Vivienda",
      "health_screenings": "Exámenes de Salud",
      "immunizations": "Vacunas",
      "map_enrollment": "Inscripción MAP",
      
      // Services list
      "services_near_you": "Servicios Cerca de Ti",
      "sort_by": "Ordenar por:",
      "distance": "Distancia",
      "alphabetical": "Alfabético",
      "rating": "Calificación",
      "open_now": "Abierto Ahora",
      "closing_soon": "Cerrando Pronto",
      "closed": "Cerrado",
      "until": "Hasta",
      "at": "a las",
      "services_offered": "Servicios Ofrecidos:",
      "more_details": "Más Detalles",
      "directions": "Direcciones",
      "view_all_services": "Ver Todos los Servicios",
      
      // View toggles
      "list_view": "Vista de Lista",
      "map_view": "Vista de Mapa",
      
      // Events calendar
      "upcoming_events": "Próximos Eventos Comunitarios",
      "month_view": "Vista Mensual",
      "list_view": "Vista de Lista",
      "view_full_calendar": "Ver Calendario Completo",
      
      // Days of week
      "sun": "Dom",
      "mon": "Lun",
      "tue": "Mar",
      "wed": "Mié",
      "thu": "Jue",
      "fri": "Vie",
      "sat": "Sáb",
      
      // Map
      "all_services_map": "Mapa de Todos los Servicios",
      "food": "Comida",
      "housing": "Vivienda",
      "health": "Salud",
      "childcare": "Niños",
      "jobs": "Empleos",
      "transport": "Transporte",
      
      // Footer
      "about": "Acerca de",
      "about_text": "El Buscador de Servicios Comunitarios de Austin ayuda a los residentes a localizar servicios de apoyo cercanos ofrecidos por la Ciudad de Austin y sus socios.",
      "quick_links": "Enlaces Rápidos",
      "all_services": "Todos los Servicios",
      "events_calendar": "Calendario de Eventos",
      "neighborhood_centers": "Centros Vecinales",
      "emergency_resources": "Recursos de Emergencia",
      "service_categories": "Categorías de Servicios",
      "contact": "Contacto",
      "copyright": "© 2023 Ciudad de Austin. Todos los derechos reservados.",
      
      // Service details page
      "back_to_results": "Volver a los Resultados",
      "get_directions": "Obtener Direcciones",
      "hours_of_operation": "Horario de Operación",
      "phone": "Teléfono",
      "available_services": "Servicios Disponibles",
      "parking_information": "Información de Estacionamiento",
      "parking_type": "Tipo",
      "parking_hours": "Horario",
      "parking_rate": "Tarifa",
      "upcoming_events_at": "Próximos Eventos en {{service}}",
      "no_events": "No hay próximos eventos en esta ubicación",
      "nearby_services": "Servicios Cercanos"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

export default i18n;
