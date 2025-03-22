import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-white',
      outline: 'bg-transparent border-2 border-black text-foreground',
      secondary: 'bg-secondary text-white',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-bold border-2 border-black',
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
