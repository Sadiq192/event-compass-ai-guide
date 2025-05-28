import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Plus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'All Events', path: '/all-events' },
    { icon: Plus, label: 'Create Event', path: '/create-event' }
  ];

  const handleLogout = () => {
    console.log('User logged out');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold">Eventify</div>
      <div className="hidden md:flex space-x-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              isActive
                ? "bg-primary-foreground text-primary font-medium"
                : "hover:bg-primary-foreground/20"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      <Button
        variant="ghost"
        className="hidden md:flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/20"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
      {/* Mobile menu button would go here */}
    </nav>
  );
};

export default Navbar;
