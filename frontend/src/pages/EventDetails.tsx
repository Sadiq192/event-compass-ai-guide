
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventDetailsComponent, { EventDetailsProps, Task } from '@/components/EventDetails';
import { toast } from 'sonner';

// Define an interface for the event data received from the backend
interface BackendEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer?: string;
  createdAt: string;
}

// Define an interface for the task data received from the backend
interface BackendTask {
  _id: string;
  title: string;
  completed: boolean;
  eventId: string;
  createdAt: string;
}

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetailsProps | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]); // State for tasks
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true); // New state for event loading
  const [tasksLoading, setTasksLoading] = useState(true); // New state for tasks loading

  const fetchEventDetails = async () => {
    if (!id) {
      toast.error("Event ID is missing.");
      return;
    }
    setEventLoading(true);
    try {
      const eventResponse = await fetch(`http://localhost:5000/api/events/${id}`);
      if (!eventResponse.ok) {
        throw new Error(`HTTP error! status: ${eventResponse.status}`);
      }
      const eventData: BackendEvent = await eventResponse.json();
      setEvent({
        id: eventData._id,
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        organizer: eventData.organizer,
        tasks: [], // Initialize tasks as empty array for EventDetailsProps
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event details.');
      setEvent(null); // Set event to null on error
    } finally {
      setEventLoading(false);
    }
  };

  const fetchTasks = async () => {
    if (!id) {
      toast.error("Event ID is missing.");
      return;
    }
    setTasksLoading(true);
    try {
      const tasksResponse = await fetch(`http://localhost:5000/api/tasks/${id}`);
      if (!tasksResponse.ok) {
        throw new Error(`HTTP error! status: ${tasksResponse.status}`);
      }
      const tasksData: BackendTask[] = await tasksResponse.json();
      setTasks(tasksData.map(task => ({ ...task, id: task._id })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks.');
      setTasks([]); // Set tasks to empty array on error
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchTasks();
  }, [id]);

  useEffect(() => {
    setLoading(eventLoading || tasksLoading);
  }, [eventLoading, tasksLoading]);
  
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
  
  return <EventDetailsComponent {...event} tasks={tasks} onTaskChange={fetchTasks} />;
};

export default EventDetailsPage;
