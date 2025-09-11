import React from 'react';
import { cn } from '../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({
    className,
    variant = 'rectangular',
    width,
    height,
    lines = 1,
    animation = 'pulse',
    ...props
  }, ref) => {
    const baseClasses = [
      'bg-gray-200',
      'select-none',
    ];

    // 动画类
    const animationClasses = {
      pulse: 'animate-pulse',
      wave: 'animate-pulse', // 可以扩展为波浪动画
      none: '',
    };

    // 变体样式
    const variantClasses = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
    };

    const classes = cn(
      baseClasses,
      animationClasses[animation],
      variantClasses[variant],
      className
    );

    const style: React.CSSProperties = {
      width: width || (variant === 'text' ? '100%' : undefined),
      height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '2.5rem' : '1.5rem'),
    };

    // 如果是文本变体且指定了行数，渲染多行
    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className="space-y-2" {...props}>
          {Array.from({ length: lines }, (_, index) => (
            <div
              key={index}
              className={cn(
                classes,
                index === lines - 1 && 'w-3/4' // 最后一行稍短
              )}
              style={{
                ...style,
                width: index === lines - 1 ? '75%' : style.width,
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={classes}
        style={style}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// 预定义的骨架屏组件
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className }) => (
  <Skeleton variant="text" lines={lines} className={className} />
);

export const SkeletonAvatar: React.FC<{ size?: 'small' | 'medium' | 'large'; className?: string }> = ({ 
  size = 'medium', 
  className 
}) => {
  const sizeMap = {
    small: { width: '2rem', height: '2rem' },
    medium: { width: '2.5rem', height: '2.5rem' },
    large: { width: '3rem', height: '3rem' },
  };
  
  return (
    <Skeleton 
      variant="circular" 
      width={sizeMap[size].width} 
      height={sizeMap[size].height}
      className={className}
    />
  );
};

export const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => (
  <Skeleton width="6rem" height="2.5rem" className={className} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 space-y-4', className)}>
    <Skeleton height="1.5rem" width="60%" />
    <SkeletonText lines={3} />
    <div className="flex justify-between items-center">
      <SkeletonButton />
      <Skeleton width="4rem" height="1rem" />
    </div>
  </div>
);

export default Skeleton;