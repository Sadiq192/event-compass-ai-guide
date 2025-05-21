
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventDetailsComponent, { EventDetailsProps, Task } from '@/components/EventDetails';
import { toast } from 'sonner';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock tasks data
        const mockTasks: Task[] = [
          { id: '1', title: 'Book venue', completed: true },
          { id: '2', title: 'Arrange catering', completed: false },
          { id: '3', title: 'Send invitations', completed: true },
          { id: '4', title: 'Prepare presentation slides', completed: false },
          { id: '5', title: 'Set up AV equipment', completed: false },
        ];
        
        // Mock event data based on ID
        let mockEvent;
        
        if (id === '1') {
          mockEvent = {
            id: '1',
            name: 'Annual Company Conference',
            date: '2025-09-15T09:00:00',
            time: '09:00',
            location: 'Grand Hotel, New York',
            description: 'Our annual company conference bringing together team members from all departments for strategic planning and team building.',
            requiresVenue: true,
            requiresCatering: true,
            tasks: mockTasks
          };
        } else if (id === '2') {
          mockEvent = {
            id: '2',
            name: 'Product Launch',
            date: '2025-06-30T14:00:00',
            time: '14:00',
            location: 'Tech Hub, San Francisco',
            description: 'Launch event for our newest product line featuring presentations and interactive demos.',
            requiresVenue: true,
            requiresCatering: false,
            tasks: mockTasks.slice(0, 3)
          };
        } else if (id === '3') {
          mockEvent = {
            id: '3',
            name: 'Client Appreciation Dinner',
            date: '2025-07-22T18:00:00',
            time: '18:00',
            location: 'Skyline Restaurant, Chicago',
            description: 'An elegant dinner event to thank our top clients for their continued partnership.',
            requiresVenue: true,
            requiresCatering: true,
            tasks: mockTasks.slice(2, 5)
          };
        } else {
          throw new Error('Event not found');
        }
        
        setEvent(mockEvent);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
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
        <div className="h-48 bg-muted rounded animate-pulse" />
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Event not found</h2>
        <p className="text-muted-foreground mt-2">
          The event you're looking for doesn't exist or has been deleted.
        </p>
      </div>
    );
  }
  
  return <EventDetailsComponent {...event} />;
};

export default EventDetailsPage;
