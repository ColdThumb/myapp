import React from 'react';
import { cn } from '../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', padding = 'medium', ...props }, ref) => {
    const baseClasses = [
      'bg-white rounded-lg overflow-hidden',
      'transition-all duration-normal ease-in-out',
    ];

    // 变体样式
    const variantClasses = {
      default: 'border border-gray-200 shadow-sm hover:shadow-md',
      elevated: 'shadow-md hover:shadow-lg',
      outlined: 'border-2 border-gray-300',
    };

    // 内边距
    const paddingClasses = {
      none: '',
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8',
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card 子组件
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const classes = cn('px-6 py-4 border-b border-gray-200', className);
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    const classes = cn('px-6 py-4', className);
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    const classes = cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className);
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

// 导出所有组件
export { Card as default, CardHeader, CardBody, CardFooter };