import React, { useEffect, useState } from 'react';
import EventCard, { EventCardProps } from '@/components/EventCard';
import { toast } from 'sonner';

interface BackendEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer?: string;
}

const AllEvents: React.FC = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BackendEvent[] = await response.json();
        const formattedEvents: EventCardProps[] = data.map((event: BackendEvent) => ({
          id: event._id,
          title: event.title,
          date: event.date,
          location: event.location,
          description: event.description,
          organizer: event.organizer,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-foreground">All Events</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-52 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground mt-1">
            There are no events to display.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEvents;
