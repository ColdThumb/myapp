import React from 'react';
import { cn } from '../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'small' | 'medium';
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, children, variant = 'neutral', size = 'medium', dot = false, ...props }, ref) => {
    const baseClasses = [
      'inline-flex items-center font-medium rounded-full',
      'ring-1 ring-inset',
    ];

    // 尺寸变体
    const sizeClasses = {
      small: 'px-2 py-1 text-xs',
      medium: 'px-3 py-1 text-sm',
    };

    // 样式变体
    const variantClasses = {
      success: 'bg-success-light text-success ring-success/20',
      warning: 'bg-warning-light text-warning ring-warning/20',
      error: 'bg-error-light text-error ring-error/20',
      info: 'bg-info-light text-info ring-info/20',
      neutral: 'bg-gray-100 text-gray-700 ring-gray-300',
    };

    const classes = cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      className
    );

    if (dot) {
      return (
        <span ref={ref} className={classes} {...props}>
          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
          {children}
        </span>
      );
    }

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;