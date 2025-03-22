import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = 'Avatar', size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-full overflow-hidden border-2 border-black neobrutalism-shadow',
          sizes[size],
          className,
        )}
        {...props}
      >
        {src ? (
          <img
            src={src || '/placeholder.svg'}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <User className="w-1/2 h-1/2 text-muted-foreground" />
          </div>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
