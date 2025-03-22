import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h2 className="mt-4 text-xl font-bold">Loading...</h2>
        <div className="mt-2 w-48 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
