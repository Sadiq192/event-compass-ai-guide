
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  organizer?: string;
}

const EventCard: React.FC<EventCardProps> = ({ id, title, date, location, description, organizer }) => {
  const navigate = useNavigate();
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  
  const handleView = () => {
    navigate(`/event/${id}`);
  };

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mt-0.5" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5" />
          <span>{location}</span>
        </div>
        {organizer && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <span>Organized by: {organizer}</span>
          </div>
        )}
        <p className="text-sm line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleView}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
