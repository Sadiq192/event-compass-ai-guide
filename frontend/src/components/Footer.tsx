import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground p-6 text-center text-sm mt-auto">
      <p>&copy; {new Date().getFullYear()} Eventify. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
