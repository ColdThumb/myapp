import React from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'filled';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    helperText,
    size = 'medium',
    variant = 'default',
    leftIcon,
    rightIcon,
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = [
      'w-full rounded-md border transition-all duration-normal',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-400',
    ];

    // 尺寸变体
    const sizeClasses = {
      small: 'px-3 py-2 text-sm h-8',
      medium: 'px-4 py-3 text-base h-10',
      large: 'px-5 py-4 text-lg h-12',
    };

    // 样式变体
    const variantClasses = {
      default: 'bg-white',
      filled: 'bg-gray-50',
    };

    // 状态样式
    const stateClasses = error
      ? 'border-error focus:ring-error focus:border-error'
      : 'border-gray-300 focus:ring-primary focus:border-primary';

    const inputClasses = cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      stateClasses,
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <div className="mt-2">
            {error && (
              <p className="text-sm text-error">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;