import type React from 'react';
import { forwardRef } from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = '', fallback, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
        {...props}
      >
        {src ? (
          <img
            src={src || '/placeholder.svg'}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            {fallback || alt.charAt(0) || '?'}
          </div>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
