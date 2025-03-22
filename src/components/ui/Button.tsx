import type React from 'react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'font-bold border-2 border-black rounded-md transition-all focus:outline-none';

    const variants = {
      default: 'neobrutalism-button',
      outline:
        'bg-transparent text-foreground hover:bg-muted neobrutalism-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none',
      ghost:
        'bg-transparent text-foreground hover:bg-muted border-transparent hover:border-black',
      link: 'bg-transparent text-primary underline-offset-4 hover:underline border-transparent',
    };

    const sizes = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && 'opacity-70 cursor-not-allowed',
          disabled &&
            'opacity-50 cursor-not-allowed hover:translate-x-0 hover:translate-y-0 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.3)]',
          className,
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {children}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </div>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
