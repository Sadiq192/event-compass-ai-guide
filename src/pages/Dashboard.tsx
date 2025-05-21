
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import EventCard, { EventCardProps } from '@/components/EventCard';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Reminder {
  id: string;
  message: string;
  eventId: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Mock API call to fetch events
    const fetchEvents = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockEvents: EventCardProps[] = [
          {
            id: '1',
            name: 'Annual Company Conference',
            date: '2025-09-15T09:00:00',
            location: 'Grand Hotel, New York',
            description: 'Our annual company conference bringing together team members from all departments for strategic planning and team building.',
          },
          {
            id: '2',
            name: 'Product Launch',
            date: '2025-06-30T14:00:00',
            location: 'Tech Hub, San Francisco',
            description: 'Launch event for our newest product line featuring presentations and interactive demos.',
          },
          {
            id: '3',
            name: 'Client Appreciation Dinner',
            date: '2025-07-22T18:00:00',
            location: 'Skyline Restaurant, Chicago',
            description: 'An elegant dinner event to thank our top clients for their continued partnership.',
          },
        ];
        
        setEvents(mockEvents);
        
        // Mock reminders
        const mockReminders: Reminder[] = [
          {
            id: '1',
            message: 'Conference venue booking deadline in 3 days',
            eventId: '1',
          },
          {
            id: '2',
            message: 'Confirm catering menu for Product Launch',
            eventId: '2',
          },
        ];
        
        // Show reminders as toasts
        mockReminders.forEach(reminder => {
          toast(reminder.message, {
            description: "Click to view related event",
            action: {
              label: "View",
              onClick: () => navigate(`/event/${reminder.eventId}`),
            },
          });
        });
        
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [navigate]);

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl font-bold">Event Dashboard</h1>
        <Button onClick={handleCreateEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>
      
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
            Create your first event to get started
          </p>
          <Button 
            className="mt-4" 
            onClick={handleCreateEvent}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
