import React from 'react';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  children: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'medium', loading = false, disabled, children, asChild = false, ...props }, ref) => {
    const baseClasses = [
      // 基础样式
      'inline-flex items-center justify-center',
      'font-medium rounded-md',
      'transition-all duration-normal ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'select-none',
    ];

    // 尺寸变体
    const sizeClasses = {
      small: 'px-4 py-2 text-sm h-8',
      medium: 'px-6 py-3 text-base h-10',
      large: 'px-8 py-4 text-lg h-12',
    };

    // 样式变体
    const variantClasses = {
      primary: [
        'bg-primary text-white',
        'hover:bg-primary-light',
        'focus:ring-primary',
        'shadow-sm hover:shadow-md',
      ],
      secondary: [
        'bg-gray-100 text-gray-700',
        'hover:bg-gray-200',
        'focus:ring-gray-500',
        'border border-gray-300',
      ],
      outline: [
        'bg-transparent text-primary',
        'border border-primary',
        'hover:bg-gray-50',
        'focus:ring-primary',
      ],
      ghost: [
        'bg-transparent text-gray-700',
        'hover:bg-gray-100',
        'focus:ring-gray-500',
      ],
    };

    const classes = cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      className
    );

    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn(classes, (children as React.ReactElement).props?.className),
        ...props
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;