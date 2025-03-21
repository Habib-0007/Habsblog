interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin ${className}`}
    ></div>
  );
};

export default LoadingSpinner;
