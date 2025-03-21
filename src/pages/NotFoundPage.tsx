import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-bold mt-4 mb-6">Page Not Found</h2>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
