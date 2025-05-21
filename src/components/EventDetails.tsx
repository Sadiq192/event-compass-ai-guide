
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Calendar, Download, MapPin, Trash } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface EventDetailsProps {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  requiresVenue: boolean;
  requiresCatering: boolean;
  tasks: Task[];
}

const EventDetails: React.FC<EventDetailsProps> = ({ 
  id, 
  name, 
  date, 
  time, 
  location, 
  description, 
  requiresVenue, 
  requiresCatering,
  tasks 
}) => {
  const navigate = useNavigate();
  const [eventTasks, setEventTasks] = useState<Task[]>(tasks);
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  const toggleTask = (taskId: string) => {
    setEventTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedTasksCount = eventTasks.filter(task => task.completed).length;
  const progress = eventTasks.length > 0 
    ? Math.round((completedTasksCount / eventTasks.length) * 100) 
    : 0;
  
  const handleEdit = () => {
    navigate(`/edit-event/${id}`);
  };
  
  const handleDelete = () => {
    console.log(`Deleting event ${id}`);
    toast.success("Event deleted successfully");
    navigate('/');
  };
  
  const handleDownloadPDF = () => {
    console.log(`Downloading PDF for event ${id}`);
    toast.success("PDF downloaded successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold">{name}</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            Edit Event
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the event
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 mt-0.5 text-event-primary" />
              <div>
                <p className="font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">{formattedDate} at {time}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 mt-0.5 text-event-primary" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{location}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="font-medium mb-1">Description</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="border rounded-md px-3 py-1 text-xs">
              {requiresVenue ? "Venue Required" : "No Venue Required"}
            </div>
            <div className="border rounded-md px-3 py-1 text-xs">
              {requiresCatering ? "Catering Required" : "No Catering Required"}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full md:w-auto" 
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Tasks</CardTitle>
            <p className="text-sm text-muted-foreground">
              {completedTasksCount} of {eventTasks.length} completed
            </p>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="pt-4">
          {eventTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No tasks available</p>
          ) : (
            <div className="space-y-3">
              {eventTasks.map(task => (
                <div 
                  key={task.id}
                  className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50"
                >
                  <Checkbox 
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <label 
                    htmlFor={`task-${task.id}`}
                    className={`text-sm cursor-pointer flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.title}
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
