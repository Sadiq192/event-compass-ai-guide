import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateEventForm from '@/components/CreateEventForm';
import { toast } from 'sonner';

interface EventData {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer?: string;
}

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setLoading(false);
        toast.error("Event ID is missing for editing.");
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEventData({
          id: data._id,
          title: data.title,
          description: data.description,
          date: new Date(data.date), // Convert date string to Date object
          location: data.location,
          organizer: data.organizer,
        });
      } catch (error) {
        console.error('Error fetching event for editing:', error);
        toast.error('Failed to load event for editing. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Event not found</h2>
        <p className="text-muted-foreground mt-2">
          The event you're trying to edit doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Event</h1>
      <CreateEventForm eventId={id} defaultValues={eventData} />
    </div>
  );
};

export default EditEvent;
