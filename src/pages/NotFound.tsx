import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-9xl font-bold gradient-text-vibrant">404</h1>
      <div className="neobrutalism-card mt-8 p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button leftIcon={<Home className="w-4 h-4" />}>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
