import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: 'none' | 'subtle' | 'vibrant' | 'cool';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, gradient = "none", ...props }, ref) => {
    const gradientClasses = {
      none: '',
      subtle: 'card-gradient-subtle',
      vibrant: 'card-gradient-vibrant',
      cool: 'card-gradient-cool',
    };
    return (
      <div
        ref={ref}
        className={cn(
          'neobrutalism-card',
          gradientClasses[gradient],
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = 'Card';

export default Card;
