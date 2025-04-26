import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@/lib/utils';
import { Event, EventWithService } from '@shared/schema';
import { Link } from 'wouter';

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: EventWithService[];
}

const EventsCalendar = () => {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState<'month' | 'list'>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch events with service details
  const { data: events = [] } = useQuery<EventWithService[]>({
    queryKey: ['/api/events'],
  });

  // Generate calendar days for current month view
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // Start with first day of month
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Determine the first day to display (might be from previous month)
    const firstDayOfCalendar = new Date(firstDayOfMonth);
    firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay());
    
    // Create 42 days (6 weeks)
    const calendarDays = 42;
    
    for (let i = 0; i < calendarDays; i++) {
      const currentDate = new Date(firstDayOfCalendar);
      currentDate.setDate(currentDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === currentMonth.getMonth();
      const isToday = 
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();
      
      // Find events for this day
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === currentDate.getDate() &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      });
      
      days.push({
        date: currentDate,
        dayOfMonth: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        events: dayEvents
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  // Get days of week for headers
  const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  // Get events for list view (upcoming events)
  const upcomingEvents = [...events]
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10); // Show next 10 events

  return (
    <section className="bg-card rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-primary font-public">
        {t('upcoming_events')}
      </h2>
      
      {/* Simplified Calendar View - Just list upcoming events */}
      <div className="space-y-3">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.slice(0, 5).map((event, index) => (
            <div key={index} className="border-b border-neutral pb-3 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-card-foreground">{event.title}</h3>
                  <p className="text-sm text-neutral-variant">
                    {event.startTime && `${event.startTime} - ${event.endTime}`}
                  </p>
                  {event.description && (
                    <p className="text-sm mt-1 text-neutral-variant truncate max-w-xs">
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-secondary">{formatDate(event.date)}</p>
                  <p className="text-xs text-neutral-variant">{event.service?.name}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-neutral py-4">No upcoming events found</p>
        )}
      </div>
      
      <div className="mt-4">
        <Link href="/events" className="text-primary font-medium text-sm flex items-center justify-center">
          {t('view_full_calendar')} <i className="fas fa-arrow-right ml-1"></i>
        </Link>
      </div>
    </section>
  );
};

export default EventsCalendar;
