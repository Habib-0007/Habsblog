const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-r-2 border-l-2 border-accent animate-spin animate-reverse"></div>
          </div>
        </div>
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
