import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import EventCard, { EventCardProps } from '@/components/EventCard';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

// Define an interface for the event data received from the backend
interface BackendEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer?: string; // Assuming organizer is the email address
  createdAt: string;
  reminderSent?: boolean; // Added to track if reminder was sent
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [reminders, setReminders] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminderLoading, setReminderLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BackendEvent[] = await response.json();
        // Map _id from backend to id for frontend components
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

    const fetchReminders = async () => {
      setReminderLoading(true);
      try {
        const now = new Date();
        const reminderThreshold = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next 24 hours

        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BackendEvent[] = await response.json();

        // Filter events within the next 24 hours and not yet reminded
        const upcomingEvents = data.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= now && eventDate <= reminderThreshold && !event.reminderSent;
        });

        setReminders(upcomingEvents);

        // Send email reminders
        for (const event of upcomingEvents) {
          if (event.organizer) {
            const emailParams = {
              to_email: event.organizer,
              event_title: event.title,
              event_date: new Date(event.date).toLocaleString(),
            };

            try {
              await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                emailParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
              );
              // Update backend to mark reminder as sent
              await fetch(`http://localhost:5000/api/events/${event._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reminderSent: true }),
              });
              toast.success(`Reminder sent for ${event.title}`);
            } catch (error) {
              console.error(`Failed to send reminder for ${event.title}:`, error);
              toast.error(`Failed to send reminder for ${event.title}`);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching reminders:', error);
        toast.error('Failed to load reminders. Please try again.');
      } finally {
        setReminderLoading(false);
      }
    };

    fetchEvents();
    fetchReminders();
  }, []);

  const handleDismissReminder = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE', // Changed to DELETE method
        headers: {
          'Content-Type': 'application/json',
        },
        // DELETE requests typically do not have a body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('Event deleted successfully!'); // Updated success message
      // Update frontend state to remove the deleted event from both lists
      setReminders(prevReminders => prevReminders.filter(r => r._id !== eventId));
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error(`Failed to delete event ${eventId}:`, error); // Updated error message
      toast.error(`Failed to delete event.`); // Updated error message
    }
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  return (
    <div className="space-y-8 p-6 lg:p-8"> {/* Adjusted padding and spacing */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold text-foreground">Event Dashboard</h1> {/* Larger, more prominent heading */}
        <Button onClick={handleCreateEvent} className="px-6 py-3 text-base"> {/* Slightly larger button */}
          <Plus className="h-5 w-5 mr-2" /> {/* Larger icon */}
          Create New Event
        </Button>
      </div>

      {/* Reminders Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Reminders</h2>
        {reminderLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No upcoming reminders within the next 24 hours.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-s">
            {reminders.map((reminder) => (
              <div key={reminder._id} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-md">
                <p className="text-blue-800">
                  <strong>Event:</strong> {reminder.title}
                </p>
                <p className="text-blue-700 text-sm">
                  <strong>Date:</strong> {new Date(reminder.date).toLocaleString()}
                </p>
                <p className="text-blue-700 text-sm">
                  <strong>Reminder Sent To:</strong> {reminder.organizer || 'N/A'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                  onClick={() => handleDismissReminder(reminder._id)}
                >
                  Dismiss Reminder
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Events Section */}
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
          <Button className="mt-4" onClick={handleCreateEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
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

export default Dashboard;
